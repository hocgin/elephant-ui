import React from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Button, Card, Form, Input, message, Select, Switch } from 'antd';
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
        staff,
        loading,
        routing: {
            location: { query },
        },
    }) => ({
        data: staff.detail,
        id: query.id,
        loading: loading.effects['staff/update'],
    }),
    dispatch => ({
        $fetch: (args = {}) => dispatch({ type: 'staff/fetch', ...args }),
        $submit: (args = {}) => dispatch({ type: 'staff/update', ...args }),
    })
)
@Form.create()
export default class Index extends React.Component {
    state = {};

    render() {
        const {
            route: { name },
            form: { getFieldDecorator },
            data,
            loading,
        } = this.props;
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
                        <Form.Item {...formItemLayout} label="性别">
                            {getFieldDecorator('gender', {
                                initialValue: data.gender,
                            })(
                                <Select>
                                    <Select.Option value={0}>女</Select.Option>
                                    <Select.Option value={1}>男</Select.Option>
                                </Select>
                            )}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="未过期">
                            {getFieldDecorator('nonExpired', {
                                initialValue: data.nonExpired,
                                valuePropName: 'checked',
                            })(<Switch />)}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="未锁定">
                            {getFieldDecorator('nonLocked', {
                                initialValue: data.nonLocked,
                                valuePropName: 'checked',
                            })(<Switch />)}
                        </Form.Item>
                        <Form.Item {...formItemLayout} label="启用">
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
                    callback: () => {
                        message.success('更新成功');
                    },
                });
            }
        });
    };
}
