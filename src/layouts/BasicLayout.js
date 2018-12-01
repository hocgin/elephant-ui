import React from 'react';
import {Layout} from 'antd';
import DocumentTitle from 'react-document-title';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import {connect} from 'dva';
import {ContainerQuery} from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import {enquireScreen, unenquireScreen} from 'enquire-js';
import {formatMessage} from 'umi/locale';
import SiderMenu from '@/components/SiderMenu';
import Authorized from '@/utils/Authorized';
import SettingDrawer from '@/components/SettingDrawer';
import logo from '../assets/logo.svg';
import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';
import Exception403 from '../pages/Exception/403';

const {Content} = Layout;
const query = {
    'screen-xs': {
        maxWidth: 575,
    },
    'screen-sm': {
        minWidth: 576,
        maxWidth: 767,
    },
    'screen-md': {
        minWidth: 768,
        maxWidth: 991,
    },
    'screen-lg': {
        minWidth: 992,
        maxWidth: 1199,
    },
    'screen-xl': {
        minWidth: 1200,
        maxWidth: 1599,
    },
    'screen-xxl': {
        minWidth: 1600,
    },
};

/**
 * 发起请求
 */
const mapDispatchToProps = (dispatch) => {
    return {
        onTestDispatch() {
            dispatch({
                type: ``
            });
        },
        handleMenuCollapse(collapsed) {
            dispatch({
                type: `global/changeLayoutCollapsed`,
                payload: collapsed,
            });
        },
        user_fetchCurrent() {
            dispatch({
                type: 'user/fetchCurrent',
            });
        },
        setting_getSetting() {
            dispatch({
                type: 'setting/getSetting',
            });
        },
        user_queryUserMenu() {
            dispatch({
                type: 'user/queryUserMenu',
                payload: {
                    token: '123456'
                }
            });
        }
    };
};

/**
 * 取数据
 */
const mapStateToProps = (states) => {
    const {global, setting, user} = states;
    return {
        collapsed: global.collapsed,
        menuData: user.menuData,
        layout: setting.layout,
        ...setting,
    };
};

@connect(mapStateToProps, mapDispatchToProps)
class BasicLayout extends React.PureComponent {

    constructor(props) {
        super(props);
        this.getPageTitle = memoizeOne(this.getPageTitle);
        this.getBreadcrumbNameMap = memoizeOne(this.getBreadcrumbNameMap, isEqual);
        this.breadcrumbNameMap = this.getBreadcrumbNameMap();
        this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
    }

    state = {
        // 是否正在渲染
        rendering: true,
        // 是否移动端
        isMobile: false,
        // 菜单数据
        menuData: [],
    };

    componentDidMount() {
        this.props.user_fetchCurrent();
        this.props.setting_getSetting();
        this.props.user_queryUserMenu();


        this.renderRef = requestAnimationFrame(() => {
            this.setState({
                rendering: false,
            });
        });
        this.enquireHandler = enquireScreen(mobile => {
            const {isMobile} = this.state;
            if (isMobile !== mobile) {
                this.setState({
                    isMobile: mobile,
                });
            }
        });
    }

    componentDidUpdate(preProps) {
        // After changing to phone mode,
        // if collapsed is true, you need to click twice to display
        this.breadcrumbNameMap = this.getBreadcrumbNameMap();
        const {isMobile} = this.state;
        const {collapsed} = this.props;
        if (isMobile && !preProps.isMobile && !collapsed) {
            this.props.handleMenuCollapse(false);
        }
    }

    componentWillUnmount() {
        cancelAnimationFrame(this.renderRef);
        unenquireScreen(this.enquireHandler);
    }

    getContext() {
        const {location} = this.props;
        return {
            location,
            breadcrumbNameMap: this.breadcrumbNameMap,
        };
    }

    /**
     * 获取面包屑映射
     * @param {Object} menuData 菜单配置
     */
    getBreadcrumbNameMap() {
        const routerMap = {};
        const mergeMenuAndRouter = data => {
            data.forEach(menuItem => {
                if (menuItem.children) {
                    mergeMenuAndRouter(menuItem.children);
                }
                // Reduce memory usage
                routerMap[menuItem.path] = menuItem;
            });
        };
        mergeMenuAndRouter(this.state.menuData);
        return routerMap;
    }

    matchParamsPath = pathname => {
        const pathKey = Object.keys(this.breadcrumbNameMap).find(key =>
            pathToRegexp(key).test(pathname)
        );
        return this.breadcrumbNameMap[pathKey];
    };

    /**
     * 标签页文字
     **/
    getPageTitle = pathname => {
        let title = '后台管理系统';

        const currRouterData = this.matchParamsPath(pathname);

        if (!currRouterData) {
            return `${title}`;
        }
        const message = formatMessage({
            id: currRouterData.locale || currRouterData.name,
            defaultMessage: currRouterData.name,
        });
        return `${message} - ${title}`;
    };

    getLayoutStyle = () => {
        const {isMobile} = this.state;
        const {fixSiderbar, collapsed, layout} = this.props;
        if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
            return {
                paddingLeft: collapsed ? '80px' : '256px',
            };
        }
        return null;
    };

    getContentStyle = () => {
        const {fixedHeader} = this.props;
        return {
            margin: '24px 24px 0',
            paddingTop: fixedHeader ? 64 : 0,
        };
    };


    renderSettingDrawer() {
        // Do not render SettingDrawer in production
        // unless it is deployed in preview.pro.ant.design as demo
        const {rendering} = this.state;
        if ((rendering || process.env.NODE_ENV === 'production') && APP_TYPE !== 'site') {
            return null;
        }
        return <SettingDrawer/>;
    }

    render() {
        const {
            navTheme,
            layout: PropsLayout,
            children,
            location: {pathname},
        } = this.props;
        const {isMobile, menuData} = this.state;
        const isTop = PropsLayout === 'topmenu';
        const routerConfig = this.matchParamsPath(pathname);
        const layout = (
            <Layout>
                {/* 左侧菜单栏 */}
                {isTop && !isMobile ? null : (
                    <SiderMenu
                        logo={logo}
                        Authorized={Authorized}
                        theme={navTheme}
                        onCollapse={this.props.handleMenuCollapse}
                        menuData={menuData}
                        isMobile={isMobile}
                        {...this.props}
                    />
                )}
                {/* 右侧内容 */}
                <Layout
                    style={{
                        ...this.getLayoutStyle(),
                        minHeight: '100vh',
                    }}
                >
                    <Header
                        menuData={menuData}
                        handleMenuCollapse={this.props.handleMenuCollapse}
                        logo={logo}
                        isMobile={isMobile}
                        {...this.props}
                    />
                    <Content style={this.getContentStyle()}>
                        <Authorized
                            authority={routerConfig && routerConfig.authority}
                            noMatch={<Exception403/>}
                        >
                            {children}
                        </Authorized>
                    </Content>
                    <Footer/>
                </Layout>
            </Layout>
        );
        return (
            <React.Fragment>
                <DocumentTitle title={this.getPageTitle(pathname)}>
                    <ContainerQuery query={query}>
                        {params => (
                            <Context.Provider value={this.getContext()}>
                                <div className={classNames(params)}>{layout}</div>
                            </Context.Provider>
                        )}
                    </ContainerQuery>
                </DocumentTitle>
                {this.renderSettingDrawer()}
            </React.Fragment>
        );
    }
}

export default BasicLayout;
