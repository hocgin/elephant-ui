import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
    Button,
    Card,
    Col,
    DatePicker,
    Divider,
    Dropdown,
    Form,
    Icon,
    Input,
    Menu,
    message,
    Modal,
    Row,
    Select,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import UpdateModal from './Modal/UpdateModal';
import CreateModal from './Modal/CreateModal';
import DetailModal from './Modal/DetailModal';
import styles from './Index.less';

import Sup from '@/utils/supplement';
import { Status } from '../../Access/Role/constant/constant';

const Constant = {
    CREATE_MODAL_VISIBLE: 'createModalVisible',
    UPDATE_MODAL_VISIBLE: 'updateModalVisible',
    DETAIL_MODAL_VISIBLE: 'detailModalVisible',
};

const Expand = {
    // 取数据
    mapStateToProps(states) {
        const { dictionary, loading } = states;
        console.log('mapStateToProps', dictionary);
        return {
            result: dictionary,
            // data 数据的加载状态
            loading: loading.models.dictionary,
        };
    },
    // 发起请求
    mapDispatchToProps(dispatch) {
        return {
            $example() {},
            /**
             * 查询
             * @param params
             * @param callback 回调
             */
            $query(params, callback) {
                dispatch({
                    type: 'dictionary/query',
                    payload: {
                        ...params,
                    },
                    callback,
                });
            },
            /**
             * 详情
             * @param params
             * @param callback 回调
             */
            $fetch(params, callback) {
                dispatch({
                    type: `dictionary/fetch`,
                    payload: {
                        ...params,
                    },
                    callback,
                });
            },
            /**
             * 删除
             * @param id [] 要删除的ID
             * @param callback 回调
             */
            $remove(id, callback) {
                dispatch({
                    type: 'dictionary/remove',
                    payload: {
                        id: id,
                    },
                    callback,
                });
            },
            /**
             * 新增
             * @param param
             * @param callback 回调
             */
            $add(param, callback) {
                dispatch({
                    type: 'dictionary/add',
                    payload: {
                        ...param,
                    },
                    callback,
                });
            },
            /**
             * 更新
             * @param param
             * @param callback 回调
             */
            $update(param, callback) {
                dispatch({
                    type: 'dictionary/update',
                    payload: {
                        ...param,
                    },
                    callback,
                });
            },
        };
    },
    // 状态解析
    status() {
        return [
            {
                status: 'error',
                text: '禁用',
            },
            {
                status: 'success',
                text: '启用',
            },
        ];
    },
};

/* eslint react/no-multi-comp:0 */
@connect(
    Expand.mapStateToProps,
    Expand.mapDispatchToProps
)
@Form.create()
export default class Index extends PureComponent {
    state = {
        // 选中的行
        selectedRows: [],
        // 编辑弹窗的值
        editModalValues: {},
        // 详情弹窗的值
        detailModalValues: {},
    };

    constructor(props) {
        super(props);

        /**
         * 挂载函数
         */
        [this.methods(), this.rendering(), this.listener()]
            .map(item => {
                return Object.keys(item).map(key => {
                    return item[key];
                });
            })
            .reduce((func1, func2) => {
                return [...func1, ...func2];
            })
            .forEach(func => {
                this[func.name] = func;
            });
    }

    /**
     * @组件挂载后
     */
    componentDidMount() {
        this.props.$query();
    }

    // 字段
    columns = [
        {
            title: '属性值',
            dataIndex: 'label',
        },
        {
            title: '描述',
            dataIndex: 'description',
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
            fixed: 'right',
            width: 200,
            render: (text, record) => {
                const menu = (
                    <Menu>
                        <Menu.Item key="remove" onClick={() => this.onClickDeleteButton(record)}>
                            删除
                        </Menu.Item>
                        <Menu.Item key="edit" onClick={() => this.onClickEditButton(true, record)}>
                            修改
                        </Menu.Item>
                        <Menu.Item key="on">启用</Menu.Item>
                        <Menu.Item key="off">禁用</Menu.Item>
                    </Menu>
                );
                return (
                    <Fragment>
                        <a onClick={() => this.onClickDetailButton(true, record)}>查看详情</a>
                        <Divider type="vertical" />
                        <Dropdown overlay={menu}>
                            <a className="ant-dropdown-link" href="#">
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
            result: { data },
            loading,
        } = this.props;

        const { selectedRows } = this.state;
        const menu = (
            <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
                <Menu.Item key="remove">批量删除</Menu.Item>
            </Menu>
        );
        return (
            <PageHeaderWrapper title={name}>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        {/*搜索层*/}
                        <div className={styles.tableListForm}>{this.renderSearchBar()}</div>
                        {/*工具栏(新建/批量操作)层*/}
                        <div className={styles.tableListOperator}>
                            <Button
                                icon="plus"
                                type="primary"
                                onClick={() => this.onClickCreateButton(true)}
                            >
                                新建
                            </Button>
                            {selectedRows.length > 0 && (
                                <span>
                                    <Dropdown overlay={menu}>
                                        <Button>
                                            批量操作 <Icon type="down" />
                                        </Button>
                                    </Dropdown>
                                </span>
                            )}
                        </div>
                        {/*数据表格层*/}
                        <StandardTable
                            rowKey="id"
                            selectedRows={selectedRows}
                            loading={loading}
                            data={data}
                            columns={this.columns}
                            onSelectRow={this.onSelectRows}
                            onChange={this.handleStandardTableChange}
                        />
                    </div>
                </Card>
                {this.renderCreateModal()}
                {this.renderUpdateModal()}
                {this.renderDetailModal()}
            </PageHeaderWrapper>
        );
    }

    /**
     * 自定义函数
     */
    methods = () => {
        const that = this;
        return {
            onShow(key) {
                that.setState({
                    [key]: true,
                });
            },
            onClose(key) {
                that.setState({
                    [key]: false,
                });
            },
            /**
             * 处理新增请求
             * @param fields
             */
            handleAdd(fields) {
                that.props.$add(fields.desc);

                message.success('添加成功');
                that.onClickCreateButton();
            },
            /**
             * 处理更改请求
             * @param fields
             */
            handleUpdate(fields) {
                that.props.$update({
                    name: fields.name,
                    desc: fields.desc,
                    key: fields.key,
                });

                message.success('配置成功');
                that.onClickDetailButton();
            },
        };
    };

    /**
     * 渲染函数
     */
    rendering = () => {
        const that = this;
        return {
            /**
             * 根据情况渲染搜索框
             */
            renderSearchBar() {
                const {
                    form: { getFieldDecorator },
                } = that.props;
                const { expandForm } = that.state;

                const items = [
                    <Col key={0} md={8} sm={24}>
                        <Form.Item label="角色名称">
                            {getFieldDecorator('name')(<Input placeholder="请输入" />)}
                        </Form.Item>
                    </Col>,
                    <Col key={1} md={8} sm={24}>
                        <Form.Item label="使用状态">
                            {getFieldDecorator('status')(
                                <Select placeholder="请选择" style={{ width: '100%' }}>
                                    {Status.map(({ value, text }, index) => {
                                        return (
                                            <Select.Option key={index} value={value}>
                                                {text}
                                            </Select.Option>
                                        );
                                    })}
                                </Select>
                            )}
                        </Form.Item>
                    </Col>,
                    <Col key={2} md={8} sm={24}>
                        <Form.Item label="创建日期">
                            {getFieldDecorator('createdAt')(
                                <DatePicker
                                    style={{ width: '100%' }}
                                    placeholder="请输入更新日期"
                                />
                            )}
                        </Form.Item>
                    </Col>,
                ];

                /**
                 * 处理展开/收起
                 */
                let onClickToggleSearchMode = () => {
                    const { expandForm } = that.state;
                    that.setState({
                        expandForm: !expandForm,
                    });
                };
                /**
                 * 处理搜索条件重置
                 */
                let onClickResetSearch = () => {
                    const { form } = that.props;
                    form.resetFields();
                };

                return (
                    <Form onSubmit={that.onClickSearch} layout="inline">
                        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                            {!!expandForm ? items : [items[0], items[1]]}
                            {/*收起状态*/}
                            {!expandForm && (
                                <Col md={8} sm={24}>
                                    <span className={styles.submitButtons}>
                                        <Button type="primary" htmlType="submit">
                                            查询
                                        </Button>
                                        <Button
                                            htmlType="button"
                                            style={{ marginLeft: 8 }}
                                            onClick={onClickResetSearch}
                                        >
                                            重置
                                        </Button>
                                        <a
                                            style={{ marginLeft: 8 }}
                                            onClick={onClickToggleSearchMode}
                                        >
                                            展开 <Icon type="down" />
                                        </a>
                                    </span>
                                </Col>
                            )}
                        </Row>
                        {/*展开状态*/}
                        {expandForm && (
                            <div style={{ overflow: 'hidden' }}>
                                <div style={{ float: 'right', marginBottom: 24 }}>
                                    <Button type="primary" htmlType="submit">
                                        查询
                                    </Button>
                                    <Button
                                        htmlType="button"
                                        style={{ marginLeft: 8 }}
                                        onClick={onClickResetSearch}
                                    >
                                        重置
                                    </Button>
                                    <a style={{ marginLeft: 8 }} onClick={onClickToggleSearchMode}>
                                        收起 <Icon type="up" />
                                    </a>
                                </div>
                            </div>
                        )}
                    </Form>
                );
            },

            /**
             * 渲染创建 Modal
             */
            renderCreateModal() {
                const { createModalVisible } = that.state;
                return (
                    <CreateModal
                        visible={createModalVisible}
                        onCancel={() => this.onClose(Constant.CREATE_MODAL_VISIBLE)}
                        onDone={() => this.onClose(Constant.CREATE_MODAL_VISIBLE)}
                    />
                );
            },

            /**
             * 渲染更新 Modal
             */
            renderUpdateModal() {
                const { updateModalVisible, editModalValues } = that.state;
                return (
                    editModalValues &&
                    Object.keys(editModalValues).length && (
                        <UpdateModal
                            visible={updateModalVisible}
                            onCancel={() => this.onClose(Constant.UPDATE_MODAL_VISIBLE)}
                            onDone={() => this.onClose(Constant.UPDATE_MODAL_VISIBLE)}
                        />
                    )
                );
            },

            /**
             * 渲染详情 Modal
             */
            renderDetailModal() {
                const { detailModalVisible, detailModalValues } = that.state;
                return (
                    detailModalValues &&
                    Object.keys(detailModalValues).length && (
                        <DetailModal
                            visible={detailModalVisible}
                            onCancel={() => this.onClose(Constant.DETAIL_MODAL_VISIBLE)}
                            onDone={() => this.onClose(Constant.DETAIL_MODAL_VISIBLE)}
                        />
                    )
                );
            },

            showRemoveModal(id = []) {
                id.length !== 0 &&
                    Modal.confirm({
                        title: '警告',
                        content: '确定删除?',
                        okText: '确定',
                        okType: 'danger',
                        cancelText: '取消',
                        onOk() {
                            that.props.$remove(id, () => {
                                message.success('删除成功');
                                that.setState({
                                    selectedRows: [],
                                });
                            });
                        },
                    });
            },
        };
    };

    /**
     * 事件监听函数
     */
    listener = () => {
        const that = this;
        return {
            /**
             * 处理搜索条件重置
             */
            handleFormReset() {
                const { form } = that.props;
                form.resetFields();
                that.setState({
                    createModalValues: {},
                });
                that.props.$query({});
            },

            /**
             * 处理标题条件变更, 如[排序, 过滤]
             */
            handleStandardTableChange(pagination, filtersArg, sorter) {
                const { createModalValues } = that.state;

                const filters = Object.keys(filtersArg).reduce((obj, key) => {
                    const newObj = { ...obj };
                    newObj[key] = Sup().JSON.toString(filtersArg[key], ',');
                    return newObj;
                }, {});

                const params = {
                    currentPage: pagination.current,
                    pageSize: pagination.pageSize,
                    ...createModalValues,
                    ...filters,
                };
                if (sorter.field) {
                    params.sorter = `${sorter.field}_${sorter.order}`;
                }

                that.props.$query();
            },
            /**
             * 处理展开/收起
             */
            toggleForm() {
                const { expandForm } = that.state;
                that.setState({
                    expandForm: !expandForm,
                });
            },
            /**
             * 处理菜单按钮点击 [...删除]
             * @param e
             */
            handleMenuClick(e) {
                const { selectedRows } = that.state;

                if (!selectedRows) {
                    return;
                }
                switch (e.key) {
                    case 'remove':
                        that.showRemoveModal(selectedRows.map(row => row.id));
                        break;
                    default:
                        break;
                }
            },
            /**
             * 处理选中行
             * @param rows
             */
            onSelectRows(rows) {
                that.setState({
                    selectedRows: rows,
                });
            },
            /**
             * 处理查询按钮的点击
             */
            onClickSearchButton(e) {
                e.preventDefault();

                const { form } = that.props;

                form.validateFields((err, fieldsValue) => {
                    if (err) return;

                    const values = {
                        ...fieldsValue,
                        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
                    };

                    that.setState({
                        createModalValues: values,
                    });
                    that.props.$query(values);
                });
            },
            /**
             * 处理[新建]按钮的点击
             */
            onClickCreateButton(flag) {
                that.setState({
                    createModalVisible: !!flag,
                });
            },
            /**
             * 处理[详情]按钮的点击
             */
            onClickDetailButton(flag, record) {
                if (record) {
                    const { $fetch } = that.props;
                    that.setState({
                        detailModalValues: {},
                    });
                    $fetch({ id: record.id }, data => {
                        that.setState({
                            detailModalValues: data,
                        });
                    });
                }
                that.setState({
                    detailModalVisible: !!flag,
                });
            },
            /**
             * 处理[修改]按钮的点击
             */
            onClickEditButton(flag, record) {
                console.log('修改？', record);
                if (record) {
                    const { $fetch } = that.props;
                    that.setState({
                        editModalValues: {},
                    });
                    $fetch({ id: record.id }, data => {
                        that.setState({
                            editModalValues: data,
                        });
                    });
                }
                that.setState({
                    editModalVisible: !!flag,
                });
            },
            /**
             * 处理[删除]按钮的点击
             */
            onClickDeleteButton(record) {
                that.showRemoveModal(record.id);
            },
        };
    };
}
