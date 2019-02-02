import React, { PureComponent } from 'react';
import { Button, Modal, Steps, Form, Select } from 'antd';

/**
 * 新增弹窗
 * - visible 是否可见
 * - value 更新时携带的原值
 * - onModalVisible 取消时触发
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
    steps = () => {
        const { step, formValue } = this.state;
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
    }

    /**
     * =====================================
     *                  渲染
     * =====================================
     */
    render() {
        const { visible, onModalVisible } = this.props;
        const { step, form } = this.state;
        return (
            <Modal
                width={640}
                bodyStyle={{ padding: '32px 40px 48px' }}
                destroyOnClose
                title="规则配置"
                visible={visible}
                footer={this.steps()[step].footer()}
                onCancel={() => onModalVisible()}
            >
                <Steps style={{ marginBottom: 28 }} size="small" current={step}>
                    {this.steps().map((step, index) => {
                        return step.title(index);
                    })}
                </Steps>
                {this.steps()[step].content()}
            </Modal>
        );
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
        const { step } = this.state;
        this.setState({
            step: step - 1,
        });
    };

    /**
     * 前进
     */
    forward() {
        const { step } = this.state;
        this.setState({
            step: step + 1,
        });
    }

    /**
     * @下一页
     */
    onClickNext = step => {
        const { form, onDone } = this.props;
        const { formValue: oldValue } = this.state;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            const formVals = { ...oldValue, ...fieldsValue };
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
    };
}
