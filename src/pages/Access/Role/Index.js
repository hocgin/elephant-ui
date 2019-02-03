import React, { Fragment, PureComponent } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
    Badge,
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
    Row,
    Select,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import styles from './Index.less';
import * as LangKit from '../../../utils/LangKit';
import CreateModal from './Modal/CreateModal';

const Expand = {
    // 发起请求
    mapDispatchToProps(dispatch) {
        return {
            example() {},
            page(params) {
                dispatch({
                    type: 'roles/page',
                    payload: params,
                });
            },
            // 查询
            query(params) {
                dispatch({
                    type: 'role/query',
                    payload: params,
                });
            },
            remove(key, callback) {
                dispatch({
                    type: 'rule/remove',
                    payload: {
                        key: key,
                    },
                    callback: callback,
                });
            },
            add(desc) {
                dispatch({
                    type: 'rule/add',
                    payload: {
                        desc: desc,
                    },
                });
            },
            update(name, desc, key) {
                dispatch({
                    type: 'rule/update',
                    payload: {
                        name,
                        desc,
                        key,
                    },
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
const Constant = {
    CREATE_MODAL_VISIBLE: 'createModalVisible',
};

const TITLE = '角色管理';
/* eslint react/no-multi-comp:0 */
@connect(({ role, loading }) => ({
    result: role,
    // data 数据的加载状态
    loading: loading.models.role,
}))
@Form.create()
export default class Index extends PureComponent {
    state = {
        modalVisible: false,
        updateModalVisible: false,
        expandForm: false,
        selectedRows: [],
        createModalValues: {},
        // 新建临时保存的值
        editModalValues: {},
    };

    constructor(props) {
        super(props);
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
            //     filters: [
            //         {
            //             text: Expand.status()[0].text,
            //             value: 0,
            //         },
            //         {
            //             text: Expand.status()[1].text,
            //             value: 1,
            //         },
            //     ],
            render(val) {
                // let {status, text} = Expand.status()[val];
                return <Badge status="success" text="启用" />;
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
                const menu = (
                    <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
                        <Menu.Item key="edit">修改</Menu.Item>
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

    /**
     * @组件挂载后
     */
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'roles/page',
            payload: {},
        });
    }

    /**
     * 处理标题条件变更, 如[排序, 过滤]
     * @param pagination
     * @param filtersArg
     * @param sorter
     */
    handleStandardTableChange = (pagination, filtersArg, sorter) => {
        const { formValues } = this.state;

        const filters = Object.keys(filtersArg).reduce((obj, key) => {
            const newObj = { ...obj };
            newObj[key] = toString(filtersArg[key]);
            return newObj;
        }, {});

        const params = {
            currentPage: pagination.current,
            pageSize: pagination.pageSize,
            ...formValues,
            ...filters,
        };
        if (sorter.field) {
            params.sorter = `${sorter.field}_${sorter.order}`;
        }

        this.props.query();
    };

    /**
     * 处理搜索条件重置
     */
    handleFormReset = () => {
        const { form } = this.props;
        form.resetFields();
        this.setState({
            createModalValues: {},
        });
        this.props.query({});
    };

    /**
     * 处理展开/收起
     */
    toggleForm = () => {
        const { expandForm } = this.state;
        this.setState({
            expandForm: !expandForm,
        });
    };

    /**
     * 处理菜单按钮点击 [...删除]
     */
    handleMenuClick = e => {
        const { selectedRows } = this.state;

        if (!selectedRows) return;
        switch (e.key) {
            case 'remove':
                this.props.remove(selectedRows.map(row => row.key), () => {
                    this.setState({
                        selectedRows: [],
                    });
                });
                break;
            default:
                break;
        }
    };

    /**
     * 处理选中行
     */
    handleSelectRows = rows => {
        this.setState({
            selectedRows: rows,
        });
    };

    /**
     * 处理查询按钮的点击
     */
    handleSearch = e => {
        e.preventDefault();

        const { form } = this.props;

        form.validateFields((err, fieldsValue) => {
            if (err) return;

            const values = {
                ...fieldsValue,
                updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
            };

            this.setState({
                createModalValues: values,
            });
            this.props.query(values);
        });
    };

    /**
     * 处理[新建]按钮的点击
     */
    handleModalVisible = flag => {
        this.setState({
            modalVisible: !!flag,
        });
    };

    /**
     * 处理[配置]按钮的点击
     * @param flag
     * @param record
     */
    handleUpdateModalVisible = (flag, record) => {
        this.setState({
            updateModalVisible: !!flag,
            editModalValues: record || {},
        });
    };

    render() {
        const that = this;
        const { result, loading } = this.props;
        const { selectedRows, createModalVisible, updateModalVisible } = this.state;
        const menu = (
            <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
                <Menu.Item key="remove">删除</Menu.Item>
                <Menu.Item key="approval">批量审批</Menu.Item>
            </Menu>
        );

        return (
            <PageHeaderWrapper title={TITLE}>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        {/*搜索层*/}
                        <div className={styles.tableListForm}>{this.renderSearchBar()}</div>
                        {/*工具栏(新建/批量操作)层*/}
                        <div className={styles.tableListOperator}>
                            <Button
                                htmlType="button"
                                icon="plus"
                                onClick={() => this.onShow(Constant.CREATE_MODAL_VISIBLE)}
                                type="primary"
                            >
                                新建
                            </Button>
                            {selectedRows.length > 0 && (
                                <span>
                                    <Button htmlType="button">批量操作</Button>
                                    <Dropdown overlay={menu}>
                                        <Button htmlType="button">
                                            更多操作 <Icon type="down" />
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
                            data={LangKit.toAntProPage(result)}
                            columns={this.columns}
                            onSelectRow={this.onSelectRows}
                            onChange={this.handleStandardTableChange}
                        />
                    </div>
                </Card>
                {/*新增弹窗*/}
                <CreateModal
                    visible={createModalVisible}
                    onCancel={() => this.onClose(Constant.CREATE_MODAL_VISIBLE)}
                    onDone={() => this.onClose(Constant.CREATE_MODAL_VISIBLE)}
                />
                {/*更新弹窗*/}
                {/*<CreateModal*/}
                {/*visible={updateModalVisible}*/}
                {/*onModalVisible={this.onClickDetailButton}*/}
                {/*onDone={this.methods().handleUpdate}*/}
                {/*values={stepFormValues}*/}
                {/*/>*/}
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
                that.props.add(fields.desc);

                message.success('添加成功');
                that.onClickCreateButton();
            },
            /**
             * 处理更改请求
             * @param fields
             */
            handleUpdate(fields) {
                that.props.update({
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
                                    {Expand.status().map(({ status, text }) => {
                                        return (
                                            <Select.Option key={status} value={status}>
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

                /**
                 * 点击搜索按钮
                 * @param e
                 */
                let onClickSearchButton = e => {
                    e.preventDefault();
                    const { form, result } = that.props;

                    form.validateFields((err, fieldsValue) => {
                        if (err) return;
                        console.log('[搜索]', fieldsValue);
                        // todo: fetch query
                    });
                };
                return (
                    <Form onSubmit={onClickSearchButton} layout="inline">
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
             * =====
             */
        };
    };

    /**
     * 事件监听函数
     */
    listener = () => {
        const that = this;
        return {
            onClickUpdateButton() {},
        };
    };
}
