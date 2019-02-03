import React, { PureComponent } from 'react';
import { Button, Form, Input, message, Modal, Steps, TreeSelect } from 'antd';
import { connect } from 'dva';
import { toAntTreeData } from '../../../../utils/LangKit';

/**
 * 新增弹窗
 * - visible 是否可见
 * - onCancel 取消时触发
 * - onDone 完成时触发
 */
@connect(({ resource, loading }) => {
    console.log(resource);
    return {
        // data 数据的加载状态
        result: resource.result,
    };
})
@Form.create()
export default class CreateModal extends PureComponent {
    state = {
        // 当前步骤
        step: 0,
        // 待提交的值
        formVals: {},
    };
    formLayout = {
        labelCol: { span: 7 },
        wrapperCol: { span: 13 },
    };

    /**
     * 步骤渲染
     */
    renderSteps = () => {
        const { step, formVals } = this.state;
        const { form } = this.props;
        const that = this;

        // 上一页
        const onPrevious = () => {
                that.setState({
                    step: step - 1,
                });
            },
            // 下一页 & 完成
            onNextAndDone = () => {
                const { dispatch, form } = that.props;
                form.validateFields((err, fieldsValue) => {
                    if (err) return;
                    const formVals = { ...that.state.formVals, ...fieldsValue };
                    that.setState({ formVals }, () => {
                        if (step + 1 < that.renderSteps().length) {
                            that.setState({
                                step: step + 1,
                            });
                        } else {
                            dispatch({
                                type: 'role/insertOne',
                                payload: formVals,
                                callback: () => {
                                    message.success('提交成功');
                                    form.resetFields();
                                    that.props.onDone();
                                },
                            });
                        }
                    });
                });
            },
            // 取消
            onCancel = () => {
                that.props.onCancel();
            };
        const previousBtn = (
                <Button
                    key="previous"
                    htmlType="button"
                    style={{ float: 'left' }}
                    onClick={onPrevious}
                >
                    上一步
                </Button>
            ),
            nextBtn = (
                <Button key="next" type="primary" htmlType="button" onClick={onNextAndDone}>
                    下一步
                </Button>
            ),
            cancelBtn = (
                <Button key="cancel" htmlType="button" onClick={onCancel}>
                    取消
                </Button>
            ),
            doneBtn = (
                <Button key="submit" htmlType="button" type="primary" onClick={onNextAndDone}>
                    完成
                </Button>
            );

        return [
            {
                content() {
                    return [
                        <Form.Item key={0} {...that.formLayout} label="角色名称" hasFeedback>
                            {form.getFieldDecorator('name', {
                                initialValue: formVals.name,
                                rules: [{ required: true, message: '请输入角色名称' }],
                            })(<Input style={{ width: '100%' }} />)}
                        </Form.Item>,
                        <Form.Item
                            key={1}
                            {...that.formLayout}
                            label="角色标识"
                            hasFeedback
                            extra={'请使用"ROLE_"开头的大写字符'}
                        >
                            {form.getFieldDecorator('mark', {
                                initialValue: formVals.mark,
                                rules: [{ required: true, message: '请输入角色唯一标识' }],
                            })(<Input style={{ width: '100%' }} />)}
                        </Form.Item>,
                        <Form.Item key={2} {...that.formLayout} label="角色描述" hasFeedback>
                            {form.getFieldDecorator('description', {
                                initialValue: formVals.description,
                            })(
                                <Input.TextArea
                                    autosize={{ minRows: 3, maxRows: 6 }}
                                    style={{ width: '100%' }}
                                />
                            )}
                        </Form.Item>,
                    ];
                },
                footer() {
                    return [cancelBtn, nextBtn];
                },
            },
            {
                content() {
                    const { result } = that.props;
                    return [
                        <Form.Item key={0} {...that.formLayout} label="分配资源">
                            {form.getFieldDecorator('resources', {
                                initialValue: formVals.resources,
                            })(
                                <TreeSelect
                                    treeCheckable
                                    treeData={toAntTreeData(result)}
                                    searchPlaceholder="请选择赋予角色资源权限"
                                    style={{ width: '100%' }}
                                />
                            )}
                        </Form.Item>,
                    ];
                },
                footer() {
                    return [previousBtn, cancelBtn, doneBtn];
                },
            },
        ];
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
        const { dispatch } = this.props;
        dispatch({
            type: 'resource/query',
        });
    }

    /**
     * =====================================
     *                  渲染
     * =====================================
     */
    render() {
        const { visible } = this.props;
        const { step } = this.state;
        const Step = this.renderSteps()[step];
        console.log(step, Step);
        return (
            <Modal
                width={640}
                bodyStyle={{ padding: '32px 40px 48px' }}
                title="创建角色"
                visible={visible}
                footer={Step.footer()}
            >
                <Steps size="small" current={step} style={{ marginBottom: 28 }}>
                    <Steps.Step title="基本信息" />
                    <Steps.Step title="分配资源" />
                </Steps>
                {Step.content()}
            </Modal>
        );
    }

    rendering() {
        return {};
    }

    methods() {
        return {};
    }

    listener() {
        return {};
    }
}
