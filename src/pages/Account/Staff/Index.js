import React, { Fragment } from 'react';
import { connect } from 'dva';
import {
    Badge,
    Button,
    Card,
    Divider,
    Dropdown,
    Form,
    Icon,
    Input,
    Menu,
    Modal,
    Select,
} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import StandardTable from '@/components/StandardTable';
import SearchBar from '@/components/ext/SearchBar';
import Toolbar from '@/components/ext/Toolbar';
import * as LangKit from '../../../utils/LangKit';
import * as DateFormatter from '../../../utils/formatter/DateFormatter';
import SetRolesModal from './Modal/SetRolesModal';

const Constant = {
    // 分配角色弹窗
    SET_ROLE_MODAL_VISIBLE: 'SET_ROLE_MODAL_VISIBLE',
};

@connect(
    ({ staff: { page }, role: { all }, loading }) => ({
        data: LangKit.toAntProPage(page),
        roles: all,
        loading: loading.effects['staff/paging'],
    }),
    dispatch => ({
        $paging: (args = {}) => dispatch({ type: 'staff/paging', ...args }),
        $findAllRole: (args = {}) => dispatch({ type: 'role/findAll', ...args }),
        $deletes: (args = {}) => {
            Modal.confirm({
                title: '删除确认',
                content: '是否确定删除？',
                okText: '确认',
                cancelText: '取消',
                onOk: () => dispatch({ type: 'staff/deletes', ...args }),
            });
        },
        $gotoEditPage: (args = {}) => dispatch({ type: 'router/gotoStaffEdit', ...args }),
        $gotoAddPage: (args = {}) => dispatch({ type: 'router/gotoStaffAdd', ...args }),
        $gotoDetailPage: (args = {}) => dispatch({ type: 'router/gotoStaffDetail', ...args }),
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
            title: '用户名',
            dataIndex: 'username',
        },
        {
            title: '昵称',
            dataIndex: 'nickname',
        },
        {
            title: '性别',
            dataIndex: 'gender',
            render: text => ['女', '男'][text * 1],
        },
        {
            title: '状态',
            dataIndex: 'status',
            render: (text, record) => {
                let state = {
                    status: 'success',
                    text: '正常',
                };
                if (!record.nonLocked) {
                    state = {
                        status: 'warning',
                        text: '锁定',
                    };
                } else if (!record.nonExpired) {
                    state = {
                        status: 'warning',
                        text: '过期',
                    };
                } else if (!record.enabled) {
                    state = {
                        status: 'error',
                        text: '禁用',
                    };
                }
                return <Badge status={state.status} text={state.text} />;
            },
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            sorter: true,
            render: val => <span>{DateFormatter.toUTC(val)}</span>,
        },
        {
            title: '操作',
            key: 'operation',
            render: (text, record) => {
                const MoreMenus = ({ onClick }) => (
                    <Menu onClick={onClick}>
                        <Menu.Item key="setRoles">分配角色</Menu.Item>
                        <Menu.Item key="edit">修改</Menu.Item>
                        <Menu.Item key="delete">删除</Menu.Item>
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
                        <a onClick={onClickOperateRow.bind(this, record, { key: 'detail' })}>
                            查看详情
                        </a>
                        <Divider type="vertical" />
                        <Dropdown
                            overlay={<MoreMenus onClick={onClickOperateRow.bind(this, record)} />}
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

    render() {
        const {
            route: { name },
            data,
            loading,
            roles,
        } = this.props;
        const {
            selectedRows,
            operateRow,
            [Constant.SET_ROLE_MODAL_VISIBLE]: setRoleModalVisible,
        } = this.state;
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
                            <Form.Item label="昵称">
                                {form.getFieldDecorator('nickname')(
                                    <Input style={{ width: '100%' }} placeholder="请输入昵称" />
                                )}
                            </Form.Item>,
                            <Form.Item label="用户名">
                                {form.getFieldDecorator('username')(
                                    <Input style={{ width: '100%' }} placeholder="请输入用户名" />
                                )}
                            </Form.Item>,
                            <Form.Item label="性别">
                                {form.getFieldDecorator('gender')(
                                    <Select style={{ width: '100%' }}>
                                        <Option value="1">男</Option>
                                        <Option value="0">女</Option>
                                    </Select>
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
                {operateRow.id &&
                    setRoleModalVisible && (
                        <SetRolesModal
                            id={operateRow.id}
                            roles={roles}
                            visible={setRoleModalVisible}
                            onCancel={this.onClose.bind(this, Constant.SET_ROLE_MODAL_VISIBLE)}
                        />
                    )}
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
        const { selectedRows, searchValues } = this.state;
        if (!selectedRows) return;
        const { $deletes, $paging } = this.props;
        switch (e.key) {
            case 'delete': {
                $deletes({
                    payload: {
                        id: selectedRows.map(row => row.id),
                    },
                    callback: this.setState.bind(
                        this,
                        {
                            selectedRows: [],
                        },
                        $paging.bind(this, { payload: searchValues })
                    ),
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
        const { searchValues } = this.state;
        const { $deletes, $gotoDetailPage, $gotoEditPage, $paging } = this.props;
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
                    callback: $paging.bind(this, { payload: searchValues }),
                });
                break;
            }
            case 'setRoles': {
                this.onShow(Constant.SET_ROLE_MODAL_VISIBLE);
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
        this.setState({ searchValues: params });
        $paging({ payload: params });
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
                const { $paging } = this.props;
                const { searchValues } = this.state;
                $paging({ payload: searchValues });
            }
        );
    };
}
