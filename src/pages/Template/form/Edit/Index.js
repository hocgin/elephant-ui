import React from 'react';
import { connect } from 'dva';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import { Button, Card, Form, Input } from 'antd';

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
        data: example.detail,
        id: query.id,
        loading: loading.effects['example/$update'],
    }),
    dispatch => ({
        $fetch: (args = {}) => dispatch({ type: 'example/$fetch', ...args }),
        $submit: (args = {}) => dispatch({ type: 'example/$update', ...args }),
    })
)
@Form.create()
export default class Index extends React.Component {
    state = {};

    componentDidMount() {
        const { $fetch, id } = this.props;
        $fetch({
            payload: {
                id,
            },
        });
    }

    render() {
        const {
            route: { name },
            form: { getFieldDecorator },
            data,
            loading,
        } = this.props;
        return (
            <PageHeaderWrapper title={name} content={'更新内容'}>
                <Card bordered={false}>
                    <Form onSubmit={this.onSubmit} hideRequiredMark style={{ marginTop: 8 }}>
                        <Form.Item {...formItemLayout} label="名称">
                            {getFieldDecorator('name', {
                                initialValue: data.name,
                                rules: [
                                    {
                                        required: true,
                                        message: '必填',
                                    },
                                ],
                            })(<Input type="text" placeholder="请填写信息" />)}
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
                            <Button style={{ marginLeft: 8 }} htmlType={'button'}>
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
