import React, {Fragment, PureComponent} from 'react';
import {connect} from 'dva';
import moment from 'moment';
import {Button, Card, DatePicker, Divider, Dropdown, Form, Icon, Input, Menu, message, Modal, Select,} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import {Status} from './constant/constant';
import CreateModal from './Modal/CreateModal';
import UpdateModal from './Modal/UpdateModal';
import router from 'umi/router';
import * as RenderKit from '../../../utils/RenderKit';
import SearchBar from "@/components/ext/SearchBar";
import Toolbar from "@/components/ext/Toolbar";
import StandardTable from "@/components/StandardTable";
import * as LangKit from "../../../utils/LangKit";

const Constant = {
    CREATE_MODAL_VISIBLE: 'createModalVisible',
    UPDATE_MODAL_VISIBLE: 'updateModalVisible',
};

/* eslint react/no-multi-comp:0 */
@connect(({role: {page}, loading}) => ({
    data: LangKit.toAntProPage(page),
    loading: loading.effects['role/paging'],
}), dispatch => ({
    $paging: (args = {}) => dispatch({type: 'role/paging', ...args}),
    $deletes: (args = {}) => {
        Modal.confirm({
            title: '警告',
            content: '确认删除角色?',
            onOk() {
                dispatch({
                    type: 'role/deletes',
                    callback: () => {
                        message.success('删除成功');
                    },
                    ...args
                });
            },
        });
    },
    $gotoDetailPage: (args = {}) => {
        router.push({pathname: '/access/role/detail', ...args})
    },
}))
@Form.create()
export default class Index extends PureComponent {
    state = {
        selectedRows: [],
        operateRow: {},
        searchValues: {},
    };

    /**
     * @组件挂载后
     */
    componentDidMount() {
        const {$paging} = this.props;
        $paging({
            payload: {},
        });
    }

    // 字段
    columns = [
        {
            title: '角色名',
            dataIndex: 'name',
        },
        {
            title: '角色标识',
            dataIndex: 'mark',
        },
        {
            title: '描述',
            dataIndex: 'description',
        },
        {
            title: '状态',
            dataIndex: 'enabled',
            render(val) {
                return RenderKit.renderSwitch(val);
            },
        },
        {
            title: '创建时间',
            dataIndex: 'createdAt',
            sorter: true,
            render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        },
        {
            title: '操作',
            key: 'operation',
            render: (text, record) => {
                const MoreMenus = ({onClick}) => (
                    <Menu onClick={onClick}>
                        <Menu.Item key="edit">修改</Menu.Item>
                        <Menu.Item key="delete">删除</Menu.Item>
                        <Menu.Item key="on">启用</Menu.Item>
                        <Menu.Item key="off">禁用</Menu.Item>
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
        }
    ];

    render() {
        const {
            route: {name},
            data,
            loading,
        } = this.props;
        const {
            selectedRows,
            operateRow,
            [Constant.CREATE_MODAL_VISIBLE]: createModalVisible,
            [Constant.UPDATE_MODAL_VISIBLE]: updateModalVisible,
        } = this.state;
        const BatchMenus = ({onClick}) => (
            <Menu onClick={onClick}>
                <Menu.Item key="delete">批量删除</Menu.Item>
            </Menu>
        );

        return (
            <PageHeaderWrapper title={name}>
                <Card bordered={false}>
                    <SearchBar onSubmit={this.onClickSearch}>
                        {(form) => [
                            <Form.Item label="角色名称">
                                {form.getFieldDecorator('name')(<Input placeholder="请输入"/>)}
                            </Form.Item>,
                            <Form.Item label="使用状态">
                                {form.getFieldDecorator('status')(
                                    <Select placeholder="请选择" style={{width: '100%'}}>
                                        {Status.map(({value, text}, index) => {
                                            return (
                                                <Select.Option key={index} value={value}>
                                                    {text}
                                                </Select.Option>
                                            );
                                        })}
                                    </Select>
                                )}
                            </Form.Item>,
                            <Form.Item label="创建日期">
                                {form.getFieldDecorator('createdAt')(
                                    <DatePicker
                                        style={{width: '100%'}}
                                        placeholder="请输入更新日期"
                                    />
                                )}
                            </Form.Item>,
                        ]}
                    </SearchBar>
                    <Toolbar menu={<BatchMenus onClick={this.onClickBatchMenu}/>}
                        selectedRows={selectedRows}>
                        <Button htmlType="button"
                            icon="plus"
                            type="primary"
                            onClick={this.onClickAdd}
                        >
                            新建
                        </Button>
                    </Toolbar>
                    <div>
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
                {createModalVisible && (
                    <CreateModal
                        visible={createModalVisible}
                        onCancel={this.onClose.bind(this, Constant.CREATE_MODAL_VISIBLE)}
                        onDone={this.onClose.bind(this, Constant.CREATE_MODAL_VISIBLE)}
                    />
                )}
                {operateRow.id &&
                updateModalVisible && (
                    <UpdateModal
                        visible={updateModalVisible}
                        onCancel={this.onClose.bind(this, Constant.UPDATE_MODAL_VISIBLE)}
                        onDone={this.onClose.bind(this, Constant.UPDATE_MODAL_VISIBLE)}
                        id={operateRow.id}
                    />
                )}
            </PageHeaderWrapper>
        );
    }

    onShow = (key) => {
        this.setState({
            [key]: true,
        });
    };

    onClose = (key) => {
        this.setState({
            [key]: false,
        });
    };

    // 新建
    onClickAdd = () => {
        this.onShow(Constant.CREATE_MODAL_VISIBLE);
    };

    // 点击批量操作菜单
    onClickBatchMenu = e => {
        const {selectedRows, searchValues} = this.state;
        if (!selectedRows) return;
        const {$deletes, $paging} = this.props;
        switch (e.key) {
            case 'delete': {
                $deletes({
                    payload: {
                        id: selectedRows.map(row => row.id),
                    },
                    callback: this.setState.bind(this,
                        {
                            selectedRows: [],
                        },
                        $paging.bind(this, {payload: searchValues})
                    ),
                });
                break;
            }
            default:
                return;
        }
    };


    // 点击更多操作菜单
    onClickMoreMenu = ({id}, e) => {
        const {$gotoDetailPage} = this.props;
        switch (e.key) {
            case 'edit': {
                this.onShow(Constant.UPDATE_MODAL_VISIBLE);
                break;
            }
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

    // 选中行
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
