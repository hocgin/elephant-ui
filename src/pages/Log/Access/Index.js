import React, {Fragment} from 'react';
import {connect} from 'dva';
import {Button, Card, Divider, Dropdown, Form, Icon, Input, Menu, Select, message as Message, DatePicker} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import SearchBar from '@/components/ext/SearchBar';
import Toolbar from '@/components/ext/Toolbar';
import * as LangKit from '../../../utils/LangKit';
import * as DateFormatter from '../../../utils/formatter/DateFormatter';
import router from "umi/router";
const { RangePicker } = DatePicker;

@connect(
    ({accessLog: {page}, loading}) => ({
        data: LangKit.toAntProPage(page),
        loading: loading.effects['accessLog/paging'],
    }),
    dispatch => ({
        $paging: (args = {}) => dispatch({type: 'accessLog/paging', ...args}),
        $deletes: (args = {}) => console.error('no support'),
        $gotoEditPage: (args = {}) => console.error('no support'),
        $gotoAddPage: (args = {}) => console.error('no support'),
        $gotoDetailPage: (args = {}) => router.push({pathname: '/log/access-log/detail', ...args}),
    })
)
@Form.create()
export default class Index extends React.Component {
    state = {
        selectedRows: [],
        searchValues: {},
        operateRow: {},
    };

    columns = [
        {
            title: '操作描述',
            dataIndex: 'operating',
        },
        {
            title: '来源',
            dataIndex: 'source',
        },
        {
            title: '请求耗时',
            dataIndex: 'usageTime',
            render: text => `${text} ms`
        },
        {
            title: '日志级别',
            dataIndex: 'level',
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            sorter: true,
            render: val => <span>{DateFormatter.toUTC(val)}</span>,
        },
        {
            title: '访问者IP',
            dataIndex: 'ip',
        },
        {
            title: '操作',
            key: 'operation',
            render: (text, record) => {
                const MoreMenus = ({onClick}) => (
                    <Menu onClick={onClick}>
                        <Menu.Item key="detail">查看详情</Menu.Item>
                    </Menu>
                );

                const onClickOperateRow = (record, e) => {
                    this.setState(
                        {
                            operateRow: record,
                        },
                        () => {
                            this.onClickMoreMenu(record, e);
                        }
                    );
                };

                return (
                    <Fragment>
                        <a onClick={onClickOperateRow.bind(this, record, {key: 'detail'})}>
                            查看详情
                        </a>
                        <Divider type="vertical"/>
                        <Dropdown
                            overlay={<MoreMenus onClick={onClickOperateRow.bind(this, record)}/>}
                        >
                            <a className="ant-dropdown-link">
                                更多操作 <Icon type="down"/>
                            </a>
                        </Dropdown>
                    </Fragment>
                );
            },
        },
    ];

    render() {
        const {
            route: {name},
            data,
            loading,
            roles,
        } = this.props;
        const {
            selectedRows,
            operateRow,
        } = this.state;
        /**
         * 批量操作菜单
         */
        const BatchMenus = ({onClick}) => (
            <Menu onClick={onClick}>
                <Menu.Item key="delete">批量删除</Menu.Item>
            </Menu>
        );
        return (
            <PageHeaderWrapper title={name}>
                <Card bordered={false}>
                    <SearchBar onSubmit={this.onClickSearch}>
                        {form => [
                            <Form.Item label="请求路径">
                                {form.getFieldDecorator('uri')(
                                    <Input style={{width: '100%'}} placeholder="请输入请求路径"/>
                                )}
                            </Form.Item>,
                            <Form.Item label="访问者ID">
                                {form.getFieldDecorator('visitor')(
                                    <Input style={{width: '100%'}} placeholder="请输入账号ID"/>
                                )}
                            </Form.Item>,
                            <Form.Item label="日志级别">
                                {form.getFieldDecorator('level')(
                                    <Select style={{width: '100%'}}>
                                        <Option value="INFO">INFO</Option>
                                        <Option value="ERROR">ERROR</Option>
                                    </Select>
                                )}
                            </Form.Item>,
                            <Form.Item label="创建时间">
                                {form.getFieldDecorator('createdAt')(
                                    <RangePicker />
                                )}
                            </Form.Item>,
                        ]}
                    </SearchBar>
                    <Toolbar
                        menu={<BatchMenus onClick={this.onClickBatchMenu}/>}
                        selectedRows={selectedRows}
                    >
                        <Button
                            htmlType="button"
                            icon="plus"
                            type="primary"
                            onClick={this.onClickAdd}
                        >
                            新建
                        </Button>
                    </Toolbar>
                    <div>
                        {/*数据表格层*/}
                        <StandardTable
                            rowKey="id"
                            selectedRows={selectedRows}
                            loading={loading}
                            data={data}
                            columns={this.columns}
                            onSelectRow={this.onSelectRows}
                            onChange={this.onChangeStandardTableCondition}
                        />
                    </div>
                </Card>
            </PageHeaderWrapper>
        );
    }

    onShow = key => {
        this.setState({
            [key]: true,
        });
    };

    onClose = key => {
        this.setState({
            [key]: false,
        });
    };

    /**
     * 点击批量操作菜单
     * @param e
     */
    onClickBatchMenu = e => {
        const {selectedRows, searchValues} = this.state;
        if (!selectedRows) return;
        const {$deletes, $paging} = this.props;
        switch (e.key) {
            default:
                Message.error('暂不支持');
                return;
        }
    };

    /**
     * 点击更多操作菜单
     * @param obj
     * @param e
     */
    onClickMoreMenu = ({id}, e) => {
        const {searchValues} = this.state;
        const {$gotoDetailPage} = this.props;
        switch (e.key) {
            case 'detail': {
                $gotoDetailPage({
                    query: {
                        id: id,
                    },
                });
                break;
            }
            default:
                return;
        }
    };

    onClickAdd = () => {
        const {$gotoAddPage} = this.props;
        $gotoAddPage();
    };

    /**
     * 选中行
     * @param rows
     */
    onSelectRows = rows => {
        this.setState({
            selectedRows: rows,
        });
    };

    /**
     * 处理 Table 条件变更
     * @param pagination
     * @param filtersArg
     * @param sorter
     */
    onChangeStandardTableCondition = (pagination, filtersArg, sorter) => {
        const filters = Object.keys(filtersArg).reduce((obj, key) => {
            const newObj = {...obj};
            newObj[key] = toString(filtersArg[key]);
            return newObj;
        }, {});
        const {searchValues} = this.state;
        const {$paging} = this.props;

        const params = {
            page: pagination.current,
            limit: pagination.pageSize,
            condition: {
                ...searchValues,
            },
            ...filters,
        };
        if (sorter.field) {
            params.sort = {
                [sorter.field]: sorter.order === 'descend' ? 'DESC' : 'ASC',
            };
        }
        this.setState({searchValues: params});
        $paging({payload: params});
    };

    /**
     * 点击搜索按钮
     * @param values
     */
    onClickSearch = values => {
        this.setState(
            state => ({
                searchValues: {
                    ...state.searchValues,
                    condition: {
                        ...state.condition,
                        ...values,
                    },
                },
            }),
            () => {
                const {$paging} = this.props;
                const {searchValues} = this.state;
                $paging({payload: searchValues});
            }
        );
    };
}
