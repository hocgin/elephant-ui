import React from 'react';
import {Layout} from 'antd';
import DocumentTitle from 'react-document-title';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import {connect} from 'dva';
import config from '../app.config';
import {ContainerQuery} from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import {enquireScreen, unenquireScreen} from 'enquire-js';
import {formatMessage} from 'umi/locale';
import SiderMenu from '@/components/SiderMenu';
import SettingDrawer from '@/components/SettingDrawer';
import logo from '../assets/logo.svg';
import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';

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

@connect(({global, setting, account}) => ({
        collapsed: global.collapsed,
        menuData: account.menus,
        layout: setting.layout,
        ...setting,
    }),
    dispatch => ({
        $getCurrentAccount: (args = {}) => dispatch({type: 'account/getCurrentAccount', ...args}),
        $getMenus: (args = {}) => dispatch({type: 'account/getMenus', ...args}),
    })
)
class BasicLayout extends React.PureComponent {
    state = {
        // 是否正在渲染
        rendering: true,
        // 是否移动端
        isMobile: false,
    };

    constructor(props) {
        super(props);
        const {
            getBreadcrumbNameMap,
            matchParamsPath,
            getLayoutStyle,
            getContentStyle,
            getContext,
        } = this.method();

        this.getPageTitle = memoizeOne(this.getPageTitle);
        this.getLayoutStyle = getLayoutStyle;
        this.getContentStyle = getContentStyle;
        this.getContext = getContext;
        this.getBreadcrumbNameMap = memoizeOne(getBreadcrumbNameMap, isEqual);
        this.breadcrumbNameMap = this.getBreadcrumbNameMap();
        this.matchParamsPath = memoizeOne(matchParamsPath, isEqual);

        const {renderSettingDrawer} = this.rendering();
        this.renderSettingDrawer = renderSettingDrawer;
    }

    /**
     * 组件挂载后触发
     */
    componentDidMount() {
        const {$getCurrentAccount, $getMenus} = this.props;
        $getCurrentAccount();
        $getMenus();

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

    /**
     * 组件渲染后触发
     * @param preProps
     */
    componentDidUpdate(preProps) {
        // After changing to phone mode,
        // if collapsed is true, you need to click twice to display
        this.breadcrumbNameMap = this.getBreadcrumbNameMap();
        const {isMobile} = this.state;
        let {collapsed} = this.props;
        if (isMobile && !preProps.isMobile && !collapsed) {
            this.props.handleMenuCollapse(false);
        }
    }

    /**
     * 组件卸载后触发
     */
    componentWillUnmount() {
        cancelAnimationFrame(this.renderRef);
        unenquireScreen(this.enquireHandler);
    }

    render() {
        const {
            navTheme,
            layout: PropsLayout,
            children,
            location: {pathname},
            menuData,
            route: {routes}
        } = this.props;
        const {isMobile} = this.state;
        const isTop = PropsLayout === 'topmenu';
        const routerConfig = this.matchParamsPath(pathname);
        const layout = (
            <Layout>
                {/* 左侧菜单栏 */}
                {isTop && !isMobile ? null : (
                    <SiderMenu
                        logo={logo}
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
                    <Layout.Content style={this.getContentStyle()}>{children}</Layout.Content>
                    <Footer/>
                </Layout>
            </Layout>
        );
        return (
            <React.Fragment>
                {menuData.length > 0 && (
                    <DocumentTitle title={this.getPageTitle(pathname)}>
                        <ContainerQuery query={query}>
                            {params => (
                                <Context.Provider value={this.getContext()}>
                                    <div className={classNames(params)}>{layout}</div>
                                </Context.Provider>
                            )}
                        </ContainerQuery>
                    </DocumentTitle>
                )}
                {this.renderSettingDrawer()}
            </React.Fragment>
        );
    }

    /**
     * 标签页文字
     * @param pathname
     * @returns {string}
     */
    getPageTitle = pathname => {
        let title = config.title;

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

    /**
     * 自定义函数
     */
    method = () => {
        const that = this;
        return {
            getLayoutStyle() {
                const {isMobile} = that.state;
                const {fixSiderbar, collapsed, layout} = that.props;
                if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
                    return {
                        paddingLeft: collapsed ? '80px' : '256px',
                    };
                }
                return null;
            },
            getContentStyle() {
                const {fixedHeader} = that.props;
                return {
                    margin: '24px 24px 0',
                    paddingTop: fixedHeader ? 64 : 0,
                };
            },
            matchParamsPath(pathname) {
                const pathKey = Object.keys(that.breadcrumbNameMap).find(key =>
                    pathToRegexp(key).test(pathname)
                );
                return that.breadcrumbNameMap[pathKey];
            },
            getContext() {
                const {location} = that.props;
                return {
                    location,
                    breadcrumbNameMap: that.breadcrumbNameMap,
                };
            },
            /**
             * 获取面包屑映射
             */
            getBreadcrumbNameMap() {
                const {
                    route: {routes},
                } = that.props;
                const routerMap = {};
                const mergeMenuAndRouter = data => {
                    (data || []).forEach(menuItem => {
                        if (menuItem.routes) {
                            mergeMenuAndRouter(menuItem.routes);
                        }
                        // Reduce memory usage
                        routerMap[menuItem.path] = menuItem;
                    });
                };

                mergeMenuAndRouter(routes);
                return routerMap;
            },
        };
    };

    /**
     * 渲染函数
     */
    rendering = () => {
        const that = this;
        return {
            renderSettingDrawer() {
                // Do not render SettingDrawer in production
                // unless it is deployed in preview.pro.ant.design as demo
                const {rendering} = that.state;
                if ((rendering || process.env.NODE_ENV === 'production') && APP_TYPE !== 'site') {
                    return null;
                }
                return <SettingDrawer/>;
            },
        };
    };

    /**
     * 事件监听函数
     */
    listener = () => {
        return {};
    };
}

export default BasicLayout;
