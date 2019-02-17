import React from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Button, Card, Form, Input, Switch } from 'antd';
import router from 'umi/router';

const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
    },
};

const submitFormLayout = {
    wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
    },
};

@connect(
    ({
        example,
        loading,
        routing: {
            location: { query },
        },
    }) => ({
        loading: loading.effects['staff/$insert'],
    }),
    dispatch => ({
        $submit: (args = {}) => dispatch({ type: 'staff/$insert', ...args }),
    })
)
@Form.create()
export default class Index extends React.Component {
    state = {
        data: {
            nonExpired: false,
            nonLocked: false,
            enabled: true,
        },
    };

    render() {
        const {
            route: { name },
            form: { getFieldDecorator },
            loading,
        } = this.props;
        const { data } = this.state;
        return (
            <PageHeaderWrapper title={name}>
                <Card bordered={false}>
                    <Form onSubmit={this.onSubmit} style={{ marginTop: 8 }}>
                        <Form.Item {...formItemLayout} label="用户名">
                            {getFieldDecorator('username', {
                                initialValue: data.username,
                                rules: [
                                    {
                                        required: true,
                                        message: '必填',
                                    },
                                ],
                            })(<Input type="text" placeholder="请填写用户名" />)}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="昵称">
                            {getFieldDecorator('nickname', {
                                initialValue: data.nickname,
                                rules: [
                                    {
                                        required: true,
                                        message: '必填',
                                    },
                                ],
                            })(<Input type="text" placeholder="请填写昵称" />)}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="密码">
                            {getFieldDecorator('password', {
                                initialValue: data.username,
                                rules: [
                                    {
                                        required: true,
                                        message: '必填',
                                    },
                                ],
                            })(<Input type="password" placeholder="请填写密码" />)}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="过期状态">
                            {getFieldDecorator('nonExpired', {
                                initialValue: data.nonExpired,
                                valuePropName: 'checked',
                            })(<Switch />)}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="锁定状态">
                            {getFieldDecorator('nonLocked', {
                                initialValue: data.nonLocked,
                                valuePropName: 'checked',
                            })(<Switch />)}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="启用状态">
                            {getFieldDecorator('enabled', {
                                initialValue: data.enabled,
                                valuePropName: 'checked',
                            })(<Switch />)}
                        </Form.Item>
                        <Form.Item {...submitFormLayout} style={{ marginTop: 32 }}>
                            <Button
                                type="primary"
                                onClick={this.onSubmit}
                                loading={loading}
                                htmlType="submit"
                            >
                                提交
                            </Button>
                            <Button
                                style={{ marginLeft: 8 }}
                                htmlType={'button'}
                                onClick={router.goBack}
                            >
                                返回
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </PageHeaderWrapper>
        );
    }

    /**
     * 提交
     * @param e
     */
    onSubmit = e => {
        e.preventDefault();
        const {
            form: { validateFieldsAndScroll },
            $submit,
            id,
        } = this.props;
        validateFieldsAndScroll((err, values) => {
            if (!err) {
                $submit({
                    payload: {
                        id,
                        ...values,
                    },
                });
            }
        });
    };
}
