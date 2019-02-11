import React, { PureComponent } from 'react';
import { Form, Select, Button, Modal, Steps } from 'antd';

/**
 * 更新弹窗
 * - visible 是否可见
 * - value 更新时携带的原值
 * - onCancel 取消时触发
 * - onDone 完成时触发
 */
@Form.create()
export default class UpdateModal extends PureComponent {
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
    steps = () => {
        const { step } = this.state;
        const { form, onModalVisible } = this.props;
        const that = this;

        return [
            {
                title(key = '') {
                    return <Steps.Step key={key} title="基本信息" />;
                },
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
                    return [
                        <Button key="cancel" onClick={() => onModalVisible()}>
                            取消
                        </Button>,
                        <Button key="forward" type="primary" onClick={() => that.onClickNext(step)}>
                            下一步
                        </Button>,
                    ];
                },
            },
            {
                title(key = '') {
                    return <Steps.Step key={key} title="配置规则属性" />;
                },
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
                    return [
                        <Button key="back" style={{ float: 'left' }} onClick={that.backward}>
                            上一步
                        </Button>,
                        <Button key="cancel" onClick={() => onModalVisible()}>
                            取消
                        </Button>,
                        <Button key="forward" type="primary" onClick={() => that.onClickNext(step)}>
                            下一步
                        </Button>,
                    ];
                },
            },
            {
                title(key = '') {
                    return <Steps.Step key={key} title="设定调度周期" />;
                },
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
                    return [
                        <Button key="back" style={{ float: 'left' }} onClick={that.backward}>
                            上一步
                        </Button>,
                        <Button key="cancel" onClick={() => onModalVisible()}>
                            取消
                        </Button>,
                        <Button key="submit" type="primary" onClick={() => that.onClickNext(step)}>
                            完成
                        </Button>,
                    ];
                },
            },
        ];
    };

    constructor(props) {
        super(props);
        const { onClickNext } = this.method();
        this.onClickNext = onClickNext;

        const { backward, forward } = this.listener();
        this.forward = forward;
        this.backward = backward;

        const { renderContent } = this.rendering();
        this.renderContent = renderContent;
    }

    /**
     * =====================================
     *                  渲染
     * =====================================
     */
    render() {
        const { visible, onCancel } = this.props;
        const { step } = this.state;
        return (
            <Modal
                width={640}
                bodyStyle={{ padding: '32px 40px 48px' }}
                destroyOnClose
                title="规则配置"
                visible={visible}
                footer={this.steps()[step].footer()}
                onCancel={onCancel}
            >
                {this.renderContent()}
            </Modal>
        );
    }

    /**
     * 自定义函数
     */
    method = () => {
        const that = this;
        return {
            /**
             * @下一页
             */
            onClickNext(step) {
                const { form, onDone } = that.props;
                const { formValue: oldValue } = that.state;
                form.validateFields((err, fieldsValue) => {
                    if (err) return;
                    const formVals = { ...oldValue, ...fieldsValue };
                    that.setState(
                        {
                            formVals,
                        },
                        () => {
                            if (step < that.steps().length - 1) {
                                that.forward();
                            } else {
                                onDone(formVals);
                            }
                        }
                    );
                });
            },
        };
    };

    /**
     * 渲染函数
     */
    rendering = () => {
        const that = this;
        return {
            renderContent() {
                const { values } = that.props;
                const { step } = this.state;
                return [
                    <Steps key={1} style={{ marginBottom: 28 }} size="small" current={step}>
                        {that.steps().map((step, index) => {
                            return step.title(index);
                        })}
                    </Steps>,
                    that.steps()[step].content(),
                ];
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
             * 后退
             */
            backward() {
                const { step } = that.state;
                that.setState({
                    step: step - 1,
                });
            },
            /**
             * 前进
             */
            forward() {
                const { step } = that.state;
                that.setState({
                    step: step + 1,
                });
            },
        };
    };
}
