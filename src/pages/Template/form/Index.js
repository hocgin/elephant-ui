import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Card, DatePicker, Divider, Dropdown, Form, Icon, Menu, Modal } from 'antd';
import * as LangKit from '../../../utils/LangKit';
import StandardTable from '../../../components/StandardTable';
import PageHeaderWrapper from '../../../components/PageHeaderWrapper';
import * as DateFormatter from '../../../utils/formatter/DateFormatter';
import SearchBar from '../../../components/ext/SearchBar';
import Toolbar from '../../../components/ext/Toolbar';

@connect(
    ({ example: { page }, loading }) => ({
        data: LangKit.toAntProPage(page),
        loading: loading.models.page,
    }),
    dispatch => ({
        $paging: (args = {}) => dispatch({ type: 'example/$paging', ...args }),
        $deletes: (args = {}) => {
            Modal.confirm({
                title: '删除确认',
                content: '是否确定删除？',
                okText: '确认',
                cancelText: '取消',
                onOk: () => dispatch({ type: 'example/$deletes', ...args }),
            });
        },
        $gotoEditPage: (args = {}) => dispatch({ type: 'router/gotoExampleEdit', ...args }),
        $gotoAddPage: (args = {}) => dispatch({ type: 'router/gotoExampleAdd', ...args }),
        $gotoDetailPage: (args = {}) => dispatch({ type: 'router/gotoExampleDetail', ...args }),
    })
)
@Form.create()
export default class Index extends React.Component {
    state = {
        selectedRows: [],
        searchValues: {},
    };

    columns = [
        {
            title: '编号',
            dataIndex: 'id',
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            sorter: true,
            render: val => <span>{DateFormatter.toUTC(val)}</span>,
        },
        {
            title: '更新时间',
            dataIndex: 'updatedAt',
            sorter: true,
            render: val => <span>{DateFormatter.toUTC(val)}</span>,
        },
        {
            title: '操作',
            key: 'operation',
            render: (text, record) => {
                const MoreMenus = ({ onClick }) => (
                    <Menu onClick={onClick}>
                        <Menu.Item key="edit">修改</Menu.Item>
                        <Menu.Item key="delete">删除</Menu.Item>
                    </Menu>
                );

                return (
                    <Fragment>
                        <a onClick={this.onClickMoreMenu.bind(this, record, { key: 'detail' })}>
                            查看详情
                        </a>
                        <Divider type="vertical" />
                        <Dropdown
                            overlay={
                                <MoreMenus onClick={this.onClickMoreMenu.bind(this, record)} />
                            }
                        >
                            <a className="ant-dropdown-link">
                                更多操作 <Icon type="down" />
                            </a>
                        </Dropdown>
                    </Fragment>
                );
            },
        },
    ];

    componentDidMount() {
        const { $paging } = this.props;
        $paging();
    }

    render() {
        const {
            route: { name },
            data,
            loading,
        } = this.props;
        const { selectedRows } = this.state;

        /**
         * 批量操作菜单
         */
        const BatchMenus = ({ onClick }) => (
            <Menu onClick={onClick}>
                <Menu.Item key="delete">批量删除</Menu.Item>
            </Menu>
        );
        return (
            <PageHeaderWrapper title={name}>
                <Card bordered={false}>
                    <SearchBar onSubmit={this.onClickSearch}>
                        {form => [
                            <Form.Item label="创建日期">
                                {form.getFieldDecorator('createdAt')(
                                    <DatePicker
                                        style={{ width: '100%' }}
                                        placeholder="请输入更新日期"
                                    />
                                )}
                            </Form.Item>,
                        ]}
                    </SearchBar>
                    <Toolbar
                        menu={<BatchMenus onClick={this.onClickBatchMenu} />}
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

    /**
     * 点击批量操作菜单
     * @param e
     */
    onClickBatchMenu = e => {
        const { selectedRows } = this.state;
        if (!selectedRows) return;
        const { $deletes } = this.props;
        switch (e.key) {
            case 'delete': {
                $deletes({
                    id: selectedRows.map(row => row.key),
                    callback: () => {
                        this.setState({
                            selectedRows: [],
                        });
                    },
                });
                break;
            }
            default:
                return;
        }
    };

    /**
     * 点击更多操作菜单
     * @param obj
     * @param e
     */
    onClickMoreMenu = ({ id }, e) => {
        console.log('点击更多操作菜单', id, e.key);
        const { $deletes, $gotoDetailPage, $gotoEditPage } = this.props;
        switch (e.key) {
            case 'edit': {
                $gotoEditPage({
                    payload: {
                        id,
                    },
                });
                break;
            }
            case 'detail': {
                $gotoDetailPage({
                    payload: {
                        id,
                    },
                });
                break;
            }
            case 'delete': {
                $deletes({
                    payload: {
                        id: [id],
                    },
                });
                break;
            }
            default:
                return;
        }
    };

    onClickAdd = () => {
        const { $gotoAddPage } = this.props;
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
            const newObj = { ...obj };
            newObj[key] = toString(filtersArg[key]);
            return newObj;
        }, {});
        const { searchValues } = this.state;
        const { $paging } = this.props;

        const params = {
            page: pagination.current,
            limit: pagination.pageSize,
            ...searchValues,
            ...filters,
        };
        if (sorter.field) {
            params.sort = {
                [sorter.field]: sorter.order === 'descend' ? 'DESC' : 'ASC',
            };
        }
        this.setState({ searchValues: params });
        $paging({ payload: params });
    };

    /**
     * 点击搜索按钮
     * @param values
     */
    onClickSearch = values => {
        const { $paging } = this.props;
        const { searchValues } = this.state;
        const params = Object.assign(searchValues, values);
        this.setState({
            searchValues: params,
        });
        $paging({ payload: params });
    };
}
