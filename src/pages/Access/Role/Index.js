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

import styles from './Index.less';

const getValue = obj =>
    Object.keys(obj)
        .map(key => obj[key])
        .join(',');

/**
 * 新增弹窗
 * - visible 是否可见
 * - value 更新时携带的原值
 * - onModalVisible 取消时触发
 * - onDone 完成时触发
 */
@Form.create()
class CreateModal extends PureComponent {
    state = {
        // 当前步骤
        step: 0,
        // 待提交的值
        formValue: {}
    };
    formLayout = {
        labelCol: {span: 7},
        wrapperCol: {span: 13},
    };
    /**
     * 步骤渲染
     */
    steps = () => {
        const {step, formValue} = this.state;
        const {form, onModalVisible} = this.props;
        const that = this;

        return [{
            title(key = '') {
                return (<Steps.Step key={key} title="基本信息"/>);
            },
            content() {
                return [
                    <Form.Item key="target" {...that.formLayout} label="监控对象">
                        {form.getFieldDecorator('target', {
                            initialValue: 1,
                        })(
                            <Select style={{width: '100%'}}>
                                <Select.Option value="0">表一</Select.Option>
                                <Select.Option value="1">表二</Select.Option>
                            </Select>
                        )}
                    </Form.Item>
                ]
            },
            footer() {
                return [
                    <Button key="cancel" onClick={() => onModalVisible()}>
                        取消
                    </Button>,
                    <Button key="forward" type="primary" onClick={() => that.onClickNext(step)}>
                        下一步
                    </Button>,
                ]
            }
        }, {
            title(key = '') {
                return (<Steps.Step key={key} title="配置规则属性"/>);
            },
            content() {
                return [
                    <Form.Item key="target" {...that.formLayout} label="监控对象">
                        {form.getFieldDecorator('target', {
                            initialValue: 1,
                        })(
                            <Select style={{width: '100%'}}>
                                <Select.Option value="0">表一</Select.Option>
                                <Select.Option value="1">表二</Select.Option>
                            </Select>
                        )}
                    </Form.Item>,
                ]
            },
            footer() {
                return [
                    <Button key="back" style={{float: 'left'}} onClick={that.backward}>
                        上一步
                    </Button>,
                    <Button key="cancel" onClick={() => onModalVisible()}>
                        取消
                    </Button>,
                    <Button key="forward" type="primary" onClick={() => that.onClickNext(step)}>
                        下一步
                    </Button>,
                ]
            }
        }, {
            title(key = '') {
                return (<Steps.Step key={key} title="设定调度周期"/>);
            },
            content() {
                return [
                    <Form.Item key="target" {...that.formLayout} label="监控对象">
                        {form.getFieldDecorator('target', {
                            initialValue: 1,
                        })(
                            <Select style={{width: '100%'}}>
                                <Select.Option value="0">表一</Select.Option>
                                <Select.Option value="1">表二</Select.Option>
                            </Select>
                        )}
                    </Form.Item>,
                ]
            },
            footer() {
                return [
                    <Button key="back" style={{float: 'left'}} onClick={that.backward}>
                        上一步
                    </Button>,
                    <Button key="cancel" onClick={() => onModalVisible()}>
                        取消
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => that.onClickNext(step)}>
                        完成
                    </Button>,
                ]
            }
        }];
    };

    constructor(props) {
        super(props);
    }

    /**
     * =====================================
     *                  渲染
     * =====================================
     */
    render() {
        const {visible, onModalVisible} = this.props;
        const {step, form} = this.state;
        return (<Modal
            width={640}
            bodyStyle={{padding: '32px 40px 48px'}}
            destroyOnClose
            title="规则配置"
            visible={visible}
            footer={this.steps()[step].footer()}
            onCancel={() => onModalVisible()}
        >
            <Steps style={{marginBottom: 28}} size="small" current={step}>
                {this.steps().map((step, index) => {
                    return step.title(index);
                })}
            </Steps>
            {this.steps()[step].content()}
        </Modal>);
    }

    /**
     * =====================================
     *                  函数
     * =====================================
     */
    /**
     * 后退
     */
    backward = () => {
        const {step} = this.state;
        this.setState({
            step: step - 1,
        });
    };

    /**
     * 前进
     */
    forward() {
        const {step} = this.state;
        this.setState({
            step: step + 1,
        });
    }

    /**
     * @下一页
     */
    onClickNext = (step) => {
        const {form, onDone} = this.props;
        const {formValue: oldValue} = this.state;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const formVals = {...oldValue, ...fieldsValue};
            this.setState(
                {
                    formVals,
                },
                () => {
                    if (step < this.steps().length - 1) {
                        this.forward();
                    } else {
                        onDone(formVals);
                    }
                }
            );
        });
    }
}

/**
 * 更新弹窗
 * - visible 是否可见
 * - value 更新时携带的原值
 * - onModalVisible 取消时触发
 * - onDone 完成时触发
 */
@Form.create()
class EditModal extends PureComponent {
    state = {
        // 当前步骤
        step: 0,
        // 待提交的值
        formValue: {}
    };
    formLayout = {
        labelCol: {span: 7},
        wrapperCol: {span: 13},
    };
    /**
     * 步骤渲染
     */
    steps = () => {
        const {step, formValue} = this.state;
        const {form, onModalVisible} = this.props;
        const that = this;

        return [{
            title(key = '') {
                return (<Steps.Step key={key} title="基本信息"/>);
            },
            content() {
                return [
                    <Form.Item key="target" {...that.formLayout} label="监控对象">
                        {form.getFieldDecorator('target', {
                            initialValue: 1,
                        })(
                            <Select style={{width: '100%'}}>
                                <Select.Option value="0">表一</Select.Option>
                                <Select.Option value="1">表二</Select.Option>
                            </Select>
                        )}
                    </Form.Item>
                ]
            },
            footer() {
                return [
                    <Button key="cancel" onClick={() => onModalVisible()}>
                        取消
                    </Button>,
                    <Button key="forward" type="primary" onClick={() => that.onClickNext(step)}>
                        下一步
                    </Button>,
                ]
            }
        }, {
            title(key = '') {
                return (<Steps.Step key={key} title="配置规则属性"/>);
            },
            content() {
                return [
                    <Form.Item key="target" {...that.formLayout} label="监控对象">
                        {form.getFieldDecorator('target', {
                            initialValue: 1,
                        })(
                            <Select style={{width: '100%'}}>
                                <Select.Option value="0">表一</Select.Option>
                                <Select.Option value="1">表二</Select.Option>
                            </Select>
                        )}
                    </Form.Item>,
                ]
            },
            footer() {
                return [
                    <Button key="back" style={{float: 'left'}} onClick={that.backward}>
                        上一步
                    </Button>,
                    <Button key="cancel" onClick={() => onModalVisible()}>
                        取消
                    </Button>,
                    <Button key="forward" type="primary" onClick={() => that.onClickNext(step)}>
                        下一步
                    </Button>,
                ]
            }
        }, {
            title(key = '') {
                return (<Steps.Step key={key} title="设定调度周期"/>);
            },
            content() {
                return [
                    <Form.Item key="target" {...that.formLayout} label="监控对象">
                        {form.getFieldDecorator('target', {
                            initialValue: 1,
                        })(
                            <Select style={{width: '100%'}}>
                                <Select.Option value="0">表一</Select.Option>
                                <Select.Option value="1">表二</Select.Option>
                            </Select>
                        )}
                    </Form.Item>,
                ]
            },
            footer() {
                return [
                    <Button key="back" style={{float: 'left'}} onClick={that.backward}>
                        上一步
                    </Button>,
                    <Button key="cancel" onClick={() => onModalVisible()}>
                        取消
                    </Button>,
                    <Button key="submit" type="primary" onClick={() => that.onClickNext(step)}>
                        完成
                    </Button>,
                ]
            }
        }];
    };

    constructor(props) {
        super(props);
    }

    /**
     * =====================================
     *                  渲染
     * =====================================
     */
    render() {
        const {visible, onModalVisible} = this.props;
        const {step, form} = this.state;
        return (<Modal
            width={640}
            bodyStyle={{padding: '32px 40px 48px'}}
            destroyOnClose
            title="规则配置"
            visible={visible}
            footer={this.steps()[step].footer()}
            onCancel={() => onModalVisible()}
        >
            <Steps style={{marginBottom: 28}} size="small" current={step}>
                {this.steps().map((step, index) => {
                    return step.title(index);
                })}
            </Steps>
            {this.steps()[step].content()}
        </Modal>);
    }

    /**
     * =====================================
     *                  函数
     * =====================================
     */
    /**
     * 后退
     */
    backward = () => {
        const {step} = this.state;
        this.setState({
            step: step - 1,
        });
    };

    /**
     * 前进
     */
    forward() {
        const {step} = this.state;
        this.setState({
            step: step + 1,
        });
    }

    /**
     * @下一页
     */
    onClickNext = (step) => {
        const {form, onDone} = this.props;
        const {formValue: oldValue} = this.state;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const formVals = {...oldValue, ...fieldsValue};
            this.setState(
                {
                    formVals,
                },
                () => {
                    if (step < this.steps().length - 1) {
                        this.forward();
                    } else {
                        onDone(formVals);
                    }
                }
            );
        });
    }
}

const Expand = {
    // 标题
    title() {
        return '角色管理';
    },
    // 取数据
    mapStateToProps(states) {
        const {role, loading} = states;
        return {
            result: role,
            // data 数据的加载状态
            loading: loading.models.role,
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
class Index extends PureComponent {
    state = {
        modalVisible: false,
        updateModalVisible: false,
        expandForm: false,
        selectedRows: [],
        formValues: {},
        // 新建临时保存的值
        stepFormValues: {},
    };

    // 字段
    columns = [
        {
            title: '角色名',
            dataIndex: 'name',
        },
        {
            title: '角色标识',
            dataIndex: 'role',
        },
        {
            title: '描述',
            dataIndex: 'desc',
        },
        {
            title: '状态',
            dataIndex: 'status',
            filters: [
                {
                    text: Expand.status()[0].text,
                    value: 0,
                },
                {
                    text: Expand.status()[1].text,
                    value: 1,
                }
            ],
            render(val) {
                let {status, text} = Expand.status()[val];
                return <Badge status={status} text={text}/>;
            },
        }, {
            title: '创建时间',
            dataIndex: 'createdAt',
            sorter: true,
            render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        }, {
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

    /**
     * @组件挂载后
     */
    componentDidMount() {
        this.props.query();
    }

    /**
     * 处理标题条件变更, 如[排序, 过滤]
     * @param pagination
     * @param filtersArg
     * @param sorter
     */
    handleStandardTableChange = (pagination, filtersArg, sorter) => {
        const {formValues} = this.state;

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

        this.props.query();
    };

    /**
     * 处理搜索条件重置
     */
    handleFormReset = () => {
        const {form} = this.props;
        form.resetFields();
        this.setState({
            formValues: {},
        });
        this.props.query({});
    };

    /**
     * 处理展开/收起
     */
    toggleForm = () => {
        const {expandForm} = this.state;
        this.setState({
            expandForm: !expandForm,
        });
    };

    /**
     * 处理菜单按钮点击 [...删除]
     */
    handleMenuClick = e => {
        const {selectedRows} = this.state;

        if (!selectedRows) return;
        switch (e.key) {
            case 'remove':
                this.props.remove(
                    selectedRows.map(row => row.key),
                    () => {
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

        const {form} = this.props;

        form.validateFields((err, fieldsValue) => {
            if (err) return;

            const values = {
                ...fieldsValue,
                updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
            };

            this.setState({
                formValues: values,
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
            stepFormValues: record || {},
        });
    };


    methods() {
        const that = this;
        return {
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
            }
        };
    }

    /**
     * 渲染搜索框收起状态
     */
    renderSimpleForm() {
        const {
            form: {getFieldDecorator},
        } = this.props;
        return (
            <Form onSubmit={this.onClickSearchButton} layout="inline">
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
                                            return (<Select.Option key={status} value={status}>{text}</Select.Option>);
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
    }

    /**
     * 渲染搜索框展开状态
     */
    renderAdvancedForm() {
        const {
            form: {getFieldDecorator},
        } = this.props;
        return (
            <Form onSubmit={this.onClickSearchButton} layout="inline">
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
                                            return (<Select.Option key={status} value={status}>{text}</Select.Option>);
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
                        <Button style={{marginLeft: 8}} onClick={this.handleFormReset}>
                            重置
                        </Button>
                        <a style={{marginLeft: 8}} onClick={this.toggleForm}>
                            收起 <Icon type="up"/>
                        </a>
                    </div>
                </div>
            </Form>
        );
    }

    /**
     * 根据情况渲染搜索框
     */
    renderForm() {
        const {expandForm} = this.state;
        return expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
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
                            <Button icon="plus" type="primary" onClick={() => this.onClickCreateButton(true)}>
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
                            onSelectRow={this.onSelectRows}
                            onChange={this.handleStandardTableChange}
                        />
                    </div>
                </Card>
                {/*新增弹窗*/}
                <CreateModal visible={modalVisible}
                             onModalVisible={this.onClickCreateButton}
                             onDone={this.methods().handleAdd}/>
                {/*更新弹窗*/}
                {/*{stepFormValues && Object.keys(stepFormValues).length ? (*/}
                {/*<EditModal visible={modalVisible}*/}
                {/*onModalVisible={this.handleModalVisible}*/}
                {/*onDone={this.handleAdd}/>*/}
                {/*) : null}{(*/}
                <EditModal visible={updateModalVisible}
                           onModalVisible={this.onClickDetailButton}
                           onDone={this.methods().handleUpdate}
                           values={stepFormValues}/>
            </PageHeaderWrapper>
        );
    }
}

export default Index;
