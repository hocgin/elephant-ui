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
    Switch,
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
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './Index.less';

const FormItem = Form.Item;
const {Step} = Steps;
const {TextArea} = Input;
const {Option} = Select;
const RadioGroup = Radio.Group;
const getValue = obj =>
    Object.keys(obj)
        .map(key => obj[key])
        .join(',');

/**
 * 新建弹窗
 */
const CreateForm = Form.create()(props => {
    const {modalVisible, form, handleAdd, handleModalVisible} = props;
    const okHandle = () => {
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            form.resetFields();
            handleAdd(fieldsValue);
        });
    };
    return (
        <Modal
            destroyOnClose
            title="新增角色"
            visible={modalVisible}
            onOk={okHandle}
            onCancel={() => handleModalVisible()}
        >
            <Form.Item labelCol={{span: 5}} wrapperCol={{span: 15}} label="角色名">
                {form.getFieldDecorator('name', {
                    rules: [{
                        whitespace: true,
                        required: true,
                        message: '请输入至少三个字符的角色名！',
                        min: 3
                    }],
                })(<Input placeholder="请输入"/>)}
            </Form.Item>
            <Form.Item labelCol={{span: 5}} wrapperCol={{span: 15}} label="角色标识">
                {form.getFieldDecorator('role', {
                    rules: [{required: true, message: '请输入至少三个字符的角色标识！', min: 3}],
                })(<Input placeholder="请输入"/>)}
            </Form.Item>
            <Form.Item labelCol={{span: 5}} wrapperCol={{span: 15}} label="描述">
                {form.getFieldDecorator('desc', {
                    rules: [{required: true, message: '请输入至少五个字符的规则描述！', min: 5}],
                })(<Input placeholder="请输入"/>)}
            </Form.Item>
            <Form.Item labelCol={{span: 5}} wrapperCol={{span: 15}} label="状态">
                {form.getFieldDecorator('status', {
                    rules: [],
                })(<Switch checkedChildren="启用"
                           unCheckedChildren="禁用"
                           defaultChecked />)}
            </Form.Item>
        </Modal>
    );
});

/**
 * 配置(更新)弹窗
 */
@Form.create()
class UpdateForm extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            formVals: {
                name: props.values.name,
                desc: props.values.desc,
                key: props.values.key,
                target: '0',
                template: '0',
                type: '1',
                time: '',
                frequency: 'month',
            },
            currentStep: 0,
        };

        this.formLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 13},
        };
    }

    handleNext = currentStep => {
        const {form, handleUpdate} = this.props;
        const {formVals: oldValue} = this.state;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const formVals = {...oldValue, ...fieldsValue};
            this.setState(
                {
                    formVals,
                },
                () => {
                    if (currentStep < 2) {
                        this.forward();
                    } else {
                        handleUpdate(formVals);
                    }
                }
            );
        });
    };

    backward = () => {
        const {currentStep} = this.state;
        this.setState({
            currentStep: currentStep - 1,
        });
    };

    forward = () => {
        const {currentStep} = this.state;
        this.setState({
            currentStep: currentStep + 1,
        });
    };

    renderContent = (currentStep, formVals) => {
        const {form} = this.props;
        if (currentStep === 1) {
            return [
                <FormItem key="target" {...this.formLayout} label="监控对象">
                    {form.getFieldDecorator('target', {
                        initialValue: formVals.target,
                    })(
                        <Select style={{width: '100%'}}>
                            <Option value="0">表一</Option>
                            <Option value="1">表二</Option>
                        </Select>
                    )}
                </FormItem>,
                <FormItem key="template" {...this.formLayout} label="规则模板">
                    {form.getFieldDecorator('template', {
                        initialValue: formVals.template,
                    })(
                        <Select style={{width: '100%'}}>
                            <Option value="0">规则模板一</Option>
                            <Option value="1">规则模板二</Option>
                        </Select>
                    )}
                </FormItem>,
                <FormItem key="type" {...this.formLayout} label="规则类型">
                    {form.getFieldDecorator('type', {
                        initialValue: formVals.type,
                    })(
                        <RadioGroup>
                            <Radio value="0">强</Radio>
                            <Radio value="1">弱</Radio>
                        </RadioGroup>
                    )}
                </FormItem>,
            ];
        }
        if (currentStep === 2) {
            return [
                <FormItem key="time" {...this.formLayout} label="开始时间">
                    {form.getFieldDecorator('time', {
                        rules: [{required: true, message: '请选择开始时间！'}],
                    })(
                        <DatePicker
                            style={{width: '100%'}}
                            showTime
                            format="YYYY-MM-DD HH:mm:ss"
                            placeholder="选择开始时间"
                        />
                    )}
                </FormItem>,
                <FormItem key="frequency" {...this.formLayout} label="调度周期">
                    {form.getFieldDecorator('frequency', {
                        initialValue: formVals.frequency,
                    })(
                        <Select style={{width: '100%'}}>
                            <Option value="month">月</Option>
                            <Option value="week">周</Option>
                        </Select>
                    )}
                </FormItem>,
            ];
        }
        return [
            <FormItem key="name" {...this.formLayout} label="规则名称">
                {form.getFieldDecorator('name', {
                    rules: [{required: true, message: '请输入规则名称！'}],
                    initialValue: formVals.name,
                })(<Input placeholder="请输入"/>)}
            </FormItem>,
            <FormItem key="desc" {...this.formLayout} label="规则描述">
                {form.getFieldDecorator('desc', {
                    rules: [{required: true, message: '请输入至少五个字符的规则描述！', min: 5}],
                    initialValue: formVals.desc,
                })(<TextArea rows={4} placeholder="请输入至少五个字符"/>)}
            </FormItem>,
        ];
    };

    renderFooter = currentStep => {
        const {handleUpdateModalVisible} = this.props;
        if (currentStep === 1) {
            return [
                <Button key="back" style={{float: 'left'}} onClick={this.backward}>
                    上一步
                </Button>,
                <Button key="cancel" onClick={() => handleUpdateModalVisible()}>
                    取消
                </Button>,
                <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
                    下一步
                </Button>,
            ];
        }
        if (currentStep === 2) {
            return [
                <Button key="back" style={{float: 'left'}} onClick={this.backward}>
                    上一步
                </Button>,
                <Button key="cancel" onClick={() => handleUpdateModalVisible()}>
                    取消
                </Button>,
                <Button key="submit" type="primary" onClick={() => this.handleNext(currentStep)}>
                    完成
                </Button>,
            ];
        }
        return [
            <Button key="cancel" onClick={() => handleUpdateModalVisible()}>
                取消
            </Button>,
            <Button key="forward" type="primary" onClick={() => this.handleNext(currentStep)}>
                下一步
            </Button>,
        ];
    };

    render() {
        const {updateModalVisible, handleUpdateModalVisible} = this.props;
        const {currentStep, formVals} = this.state;

        return (
            <Modal
                width={640}
                bodyStyle={{padding: '32px 40px 48px'}}
                destroyOnClose
                title="规则配置"
                visible={updateModalVisible}
                footer={this.renderFooter(currentStep)}
                onCancel={() => handleUpdateModalVisible()}
            >
                <Steps style={{marginBottom: 28}} size="small" current={currentStep}>
                    <Step title="基本信息"/>
                    <Step title="配置规则属性"/>
                    <Step title="设定调度周期"/>
                </Steps>
                {this.renderContent(currentStep, formVals)}
            </Modal>
        );
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
            add({desc}) {
                dispatch({
                    type: 'rule/add',
                    payload: {
                        desc: desc,
                    },
                });
            },
            update({name, desc, key}) {
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

    /**
     * 处理新增请求
     * @param fields
     */
    handleAdd = fields => {
        this.props.add(fields.desc);

        message.success('添加成功');
        this.handleModalVisible();
    };

    /**
     * 处理更改请求
     * @param fields
     */
    handleUpdate = fields => {
        this.props.update({
            name: fields.name,
            desc: fields.desc,
            key: fields.key,
        });

        message.success('配置成功');
        this.handleUpdateModalVisible();
    };

    /**
     * 渲染搜索框收起状态
     */
    renderSimpleForm() {
        const {
            form: {getFieldDecorator},
        } = this.props;
        return (
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                    <Col md={8} sm={24}>
                        <FormItem label="角色名称">
                            {getFieldDecorator('name')(<Input placeholder="请输入"/>)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="使用状态">
                            {getFieldDecorator('status')(
                                <Select placeholder="请选择" style={{width: '100%'}}>
                                    {
                                        Expand.status().map((({status, text}) => {
                                            return (<Option key={status} value={status}>{text}</Option>);
                                        }))
                                    }
                                </Select>
                            )}
                        </FormItem>
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
            <Form onSubmit={this.handleSearch} layout="inline">
                <Row gutter={{md: 8, lg: 24, xl: 48}}>
                    <Col md={8} sm={24}>
                        <FormItem label="角色名称">
                            {getFieldDecorator('name')(<Input placeholder="请输入"/>)}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="使用状态">
                            {getFieldDecorator('status')(
                                <Select placeholder="请选择" style={{width: '100%'}}>
                                    {
                                        Expand.status().map((({status, text}) => {
                                            return (<Option value={status}>{text}</Option>);
                                        }))
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col md={8} sm={24}>
                        <FormItem label="创建日期">
                            {getFieldDecorator('createdAt')(
                                <DatePicker style={{width: '100%'}} placeholder="请输入更新日期"/>
                            )}
                        </FormItem>
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

        const parentMethods = {
            handleAdd: this.handleAdd,
            handleModalVisible: this.handleModalVisible,
        };
        const updateMethods = {
            handleUpdateModalVisible: this.handleUpdateModalVisible,
            handleUpdate: this.handleUpdate,
        };
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
                <CreateForm {...parentMethods} modalVisible={modalVisible}/>
                {/*更新弹窗*/}
                {stepFormValues && Object.keys(stepFormValues).length ? (
                    <UpdateForm
                        {...updateMethods}
                        updateModalVisible={updateModalVisible}
                        values={stepFormValues}
                    />
                ) : null}
            </PageHeaderWrapper>
        );
    }
}

export default Index;
