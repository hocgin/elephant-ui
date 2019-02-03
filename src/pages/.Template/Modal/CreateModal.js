import React, { PureComponent } from 'react';
import { Button, Form, Input, Modal, Select, Steps } from 'antd';

/**
 * 新增弹窗
 * - visible 是否可见
 * - onCancel 取消时触发
 * - onDone 完成时触发
 */
@Form.create()
export default class CreateModal extends PureComponent {
    state = {
        // 当前步骤
        step: 0,
        // 待提交的值
        formValue: {},
    };
    formLayout = {
        labelCol: { span: 7 },
        wrapperCol: { span: 13 },
    };

    /**
     * 步骤渲染
     */
    renderSteps = () => {
        const { step } = this.state;
        const { form } = this.props;
        const that = this;

        // 上一页
        const onPrevious = () => {
                that.setState({
                    step: step - 1,
                });
            },
            // 下一页
            onNext = () => {
                that.setState({
                    step: step + 1,
                });
            },
            // 取消
            onCancel = () => {
                that.props.onCancel();
            },
            // 完成
            onDone = () => {
                const { form } = that.props;
                const value = form.getFieldsValue();
                console.log(value);
                console.log('Done');
                that.props.onDone();
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
                <Button key="next" type="primary" htmlType="button" onClick={onNext}>
                    下一步
                </Button>
            ),
            cancelBtn = (
                <Button key="cancel" htmlType="button" onClick={onCancel}>
                    取消
                </Button>
            ),
            doneBtn = (
                <Button key="submit" htmlType="button" type="primary" onClick={onDone}>
                    完成
                </Button>
            );

        return [
            {
                content() {
                    return [
                        <Form.Item key="target" {...that.formLayout} label="监控对象">
                            <Form.Item key="1" {...that.formLayout} label="名称" hasFeedback>
                                {form.getFieldDecorator('name', {
                                    rules: [{ required: true, message: '请输入资源名称' }],
                                })(<Input style={{ width: '100%' }} />)}
                            </Form.Item>
                            ,
                        </Form.Item>,
                    ];
                },
                footer() {
                    return [cancelBtn, nextBtn];
                },
            },
            {
                content() {
                    return [
                        <Form.Item key="target" {...that.formLayout} label="监控对象">
                            {form.getFieldDecorator('target', {
                                initialValue: 1,
                            })(
                                <Select style={{ width: '100%' }}>
                                    <Select.Option value="0">表一</Select.Option>
                                    <Select.Option value="1">表二</Select.Option>
                                </Select>
                            )}
                        </Form.Item>,
                    ];
                },
                footer() {
                    return [previousBtn, cancelBtn, nextBtn];
                },
            },
            {
                content() {
                    return [
                        <Form.Item key="target" {...that.formLayout} label="监控对象">
                            {form.getFieldDecorator('target', {
                                initialValue: 1,
                            })(
                                <Select style={{ width: '100%' }}>
                                    <Select.Option value="0">表一</Select.Option>
                                    <Select.Option value="1">表二</Select.Option>
                                </Select>
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
     * =====================================
     *                  渲染
     * =====================================
     */
    render() {
        const { visible, ...rest } = this.props;
        const { step } = this.state;
        const Step = this.renderSteps()[step];
        console.log(step, Step);
        return (
            <Modal
                width={640}
                bodyStyle={{ padding: '32px 40px 48px' }}
                title="规则配置"
                visible={visible}
                footer={Step.footer()}
            >
                <Steps size="small" current={step} style={{ marginBottom: 28 }}>
                    <Steps.Step title="基本信息" />
                    <Steps.Step title="分配权限" />
                    <Steps.Step title="基本信息" />
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
