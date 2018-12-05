import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import moment from 'moment';
import {
    Row,
    Col,
    Card,
    Form,
    Input,
    Select,
    Icon,
    Button,
    Dropdown,
    Menu,
    InputNumber,
    DatePicker,
    Modal,
    message,
    Badge,
    Divider,
    Steps,
    Radio,
    Switch,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import EditModal from './Modal/EditModal'
import CreateModal from './Modal/CreateModal'

import styles from './Index.less';

const getValue = obj =>
    Object.keys(obj)
        .map(key => obj[key])
        .join(',');

const Expand = {
    // 标题
    title() {
        return '数据字典';
    },
    // 取数据
    mapStateToProps(states) {
        const {dictionary, loading} = states;
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
            example() {
            },
            // 查询
            query(params) {
                dispatch({
                    type: 'dictionary/query',
                    payload: params,
                });
            },
            remove(key, callback) {
                dispatch({
                    type: 'dictionary/remove',
                    payload: {
                        key: key,
                    },
                    callback: callback,
                });
            },
            add(desc) {
                dispatch({
                    type: 'dictionary/add',
                    payload: {
                        desc: desc,
                    },
                });
            },
            update(name, desc, key) {
                dispatch({
                    type: 'dictionary/update',
                    payload: {
                        name,
                        desc,
                        key
                    },
                });
            }
        };
    },
    // 状态解析
    status() {
        return [{
            status: 'error',
            text: '禁用'
        }, {
            status: 'success',
            text: '启用'
        }];
    }
};

/* eslint react/no-multi-comp:0 */
@connect(Expand.mapStateToProps, Expand.mapDispatchToProps)
@Form.create()
export default class Index extends PureComponent {
    state = {
        modalVisible: false,
        updateModalVisible: false,
        // 是否展开多项搜索框
        expandForm: false,
        selectedRows: [],
        formValues: {},
        // 新建临时保存的值
        stepFormValues: {},
    };

    // 字段
    columns = [
        {
            title: '属性值',
            dataIndex: 'label',
        }, {
            title: '描述',
            dataIndex: 'description',
        }, {
            title: '创建时间',
            dataIndex: 'createdAt',
            sorter: true,
            render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        }, {
            title: '操作',
            key: 'operation',
            fixed: 'right',
            width: 200,
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
                        <a onClick={() => this.handleUpdateModalVisible(true, record)}>查看详情</a>
                        <Divider type="vertical"/>
                        <Dropdown overlay={menu}>
                            <a className="ant-dropdown-link" href="#">
                                更多操作 <Icon type="down"/>
                            </a>
                        </Dropdown>
                    </Fragment>
                );
            },
        },
    ];

    constructor(props) {
        super(props);
        const {
            handleAdd,
            handleUpdate
        } = this.methods();
        this.handleUpdate = handleUpdate;
        this.handleAdd = handleAdd;

        const {
            renderSimpleForm,
            renderForm,
            renderAdvancedForm
        } = this.rendering();
        this.renderAdvancedForm = renderAdvancedForm;
        this.renderForm = renderForm;
        this.renderSimpleForm = renderSimpleForm;

        const {
            handleFormReset,
            handleStandardTableChange,
            toggleForm,
            handleMenuClick,
            handleSelectRows,
            handleSearch,
            handleModalVisible,
            handleUpdateModalVisible,
        } = this.listener();
        this.handleFormReset = handleFormReset;
        this.handleStandardTableChange = handleStandardTableChange;
        this.toggleForm = toggleForm;
        this.handleMenuClick = handleMenuClick;
        this.handleSelectRows = handleSelectRows;
        this.handleSearch = handleSearch;
        this.handleModalVisible = handleModalVisible;
        this.handleUpdateModalVisible = handleUpdateModalVisible;
    }

    /**
     * @组件挂载后
     */
    componentDidMount() {
        this.props.query();
    }

    render() {
        const {
            result: {data},
            loading,
        } = this.props;

        const {
            selectedRows,
            modalVisible,
            updateModalVisible,
            stepFormValues
        } = this.state;
        const menu = (
            <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
                <Menu.Item key="remove">删除</Menu.Item>
                <Menu.Item key="approval">批量审批</Menu.Item>
            </Menu>
        );
        return (
            <PageHeaderWrapper title={Expand.title()}>
                <Card bordered={false}>
                    <div className={styles.tableList}>
                        {/*搜索层*/}
                        <div className={styles.tableListForm}>{this.renderForm()}</div>
                        {/*工具栏(新建/批量操作)层*/}
                        <div className={styles.tableListOperator}>
                            <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                                新建
                            </Button>
                            {selectedRows.length > 0 && (
                                <span>
                                  <Button>批量操作</Button>
                                  <Dropdown overlay={menu}>
                                    <Button>
                                      更多操作 <Icon type="down"/>
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
                            onSelectRow={this.handleSelectRows}
                            onChange={this.handleStandardTableChange}
                        />
                    </div>
                </Card>
                {/*新增弹窗*/}
                <CreateModal visible={modalVisible}
                             onModalVisible={this.handleModalVisible}
                             onDone={this.methods().handleAdd}/>
                {/*更新弹窗*/}
                {/*{stepFormValues && Object.keys(stepFormValues).length ? (*/}
                {/*<EditModal visible={modalVisible}*/}
                {/*onModalVisible={this.handleModalVisible}*/}
                {/*onDone={this.handleAdd}/>*/}
                {/*) : null}{(*/}
                <EditModal visible={updateModalVisible}
                           onModalVisible={this.handleUpdateModalVisible}
                           onDone={this.methods().handleUpdate}
                           values={stepFormValues}/>
            </PageHeaderWrapper>
        );
    }

    /**
     * 自定义函数
     */
    methods = () => {
        const that = this;
        return {
            /**
             * 处理新增请求
             * @param fields
             */
            handleAdd(fields) {
                that.props.add(fields.desc);

                message.success('添加成功');
                that.handleModalVisible();
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
                that.handleUpdateModalVisible();
            }
        };
    };

    /**
     * 渲染函数
     */
    rendering = () => {
        const that = this;
        return {
            renderSimpleForm() {
                const {
                    form: {getFieldDecorator},
                } = that.props;
                return (
                    <Form onSubmit={that.handleSearch} layout="inline">
                        <Row gutter={{md: 8, lg: 24, xl: 48}}>
                            <Col md={8} sm={24}>
                                <Form.Item label="角色名称">
                                    {getFieldDecorator('name')(<Input placeholder="请输入"/>)}
                                </Form.Item>
                            </Col>
                            <Col md={8} sm={24}>
                                <Form.Item label="使用状态">
                                    {getFieldDecorator('status')(
                                        <Select placeholder="请选择" style={{width: '100%'}}>
                                            {
                                                Expand.status().map((({status, text}) => {
                                                    return (<Select.Option key={status}
                                                                           value={status}>{text}</Select.Option>);
                                                }))
                                            }
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col md={8} sm={24}>
                        <span className={styles.submitButtons}>
                          <Button type="primary" htmlType="submit">
                            查询
                          </Button>
                          <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
                            重置
                          </Button>
                          <a style={{marginLeft: 8}} onClick={this.toggleForm}>
                            展开 <Icon type="down"/>
                          </a>
                        </span>
                            </Col>
                        </Row>
                    </Form>
                );
            },
            /**
             * 根据情况渲染搜索框
             */
            renderForm() {
                const {expandForm} = that.state;
                return expandForm ? that.renderAdvancedForm() : that.renderSimpleForm();
            },

            /**
             * 渲染搜索框展开状态
             */
            renderAdvancedForm() {
                const {
                    form: {getFieldDecorator},
                } = that.props;
                return (
                    <Form onSubmit={that.handleSearch} layout="inline">
                        <Row gutter={{md: 8, lg: 24, xl: 48}}>
                            <Col md={8} sm={24}>
                                <Form.Item label="角色名称">
                                    {getFieldDecorator('name')(<Input placeholder="请输入"/>)}
                                </Form.Item>
                            </Col>
                            <Col md={8} sm={24}>
                                <Form.Item label="使用状态">
                                    {getFieldDecorator('status')(
                                        <Select placeholder="请选择" style={{width: '100%'}}>
                                            {
                                                Expand.status().map((({status, text}) => {
                                                    return (<Select.Option key={status}
                                                                           value={status}>{text}</Select.Option>);
                                                }))
                                            }
                                        </Select>
                                    )}
                                </Form.Item>
                            </Col>
                            <Col md={8} sm={24}>
                                <Form.Item label="创建日期">
                                    {getFieldDecorator('createdAt')(
                                        <DatePicker style={{width: '100%'}} placeholder="请输入更新日期"/>
                                    )}
                                </Form.Item>
                            </Col>
                        </Row>
                        <div style={{overflow: 'hidden'}}>
                            <div style={{float: 'right', marginBottom: 24}}>
                                <Button type="primary" htmlType="submit">
                                    查询
                                </Button>
                                <Button style={{marginLeft: 8}} onClick={that.handleFormReset}>
                                    重置
                                </Button>
                                <a style={{marginLeft: 8}} onClick={that.toggleForm}>
                                    收起 <Icon type="up"/>
                                </a>
                            </div>
                        </div>
                    </Form>
                );
            }
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
                const {form} = that.props;
                form.resetFields();
                that.setState({
                    formValues: {},
                });
                that.props.query({});
            },

            /**
             * 处理标题条件变更, 如[排序, 过滤]
             */
            handleStandardTableChange(pagination, filtersArg, sorter) {
                const {formValues} = that.state;

                const filters = Object.keys(filtersArg).reduce((obj, key) => {
                    const newObj = {...obj};
                    newObj[key] = getValue(filtersArg[key]);
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

                that.props.query();
            },
            /**
             * 处理展开/收起
             */
            toggleForm() {
                const {expandForm} = that.state;
                that.setState({
                    expandForm: !expandForm,
                });
            },
            /**
             * 处理菜单按钮点击 [...删除]
             * @param e
             */
            handleMenuClick(e) {
                const {selectedRows} = that.state;

                if (!selectedRows) return;
                switch (e.key) {
                    case 'remove':
                        that.props.remove(
                            selectedRows.map(row => row.key),
                            () => {
                                that.setState({
                                    selectedRows: [],
                                });
                            });
                        break;
                    default:
                        break;
                }
            },
            /**
             * 处理选中行
             * @param rows
             */
            handleSelectRows(rows) {
                this.setState({
                    selectedRows: rows,
                });
            },
            /**
             * 处理查询按钮的点击
             */
            handleSearch(e) {
                e.preventDefault();

                const {form} = that.props;

                form.validateFields((err, fieldsValue) => {
                    if (err) return;

                    const values = {
                        ...fieldsValue,
                        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
                    };

                    that.setState({
                        formValues: values,
                    });
                    that.props.query(values);
                });
            },
            /**
             * 处理[新建]按钮的点击
             */
            handleModalVisible(flag) {
                that.setState({
                    modalVisible: !!flag,
                });
            },
            /**
             * 处理[配置]按钮的点击
             */
            handleUpdateModalVisible(flag, record) {
                that.setState({
                    updateModalVisible: !!flag,
                    stepFormValues: record || {},
                });
            },
        };
    };
}
