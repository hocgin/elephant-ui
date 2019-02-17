import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Button, Form, Select } from 'antd';
import styles from './style.less';

const formItemLayout = {
    labelCol: {
        span: 5,
    },
    wrapperCol: {
        span: 19,
    },
};

@connect(
    ({ example, loading }) => ({
        data: example.addValue,
        loading: loading.effects['example/$insert'],
    }),
    dispatch => ({
        $gotoPrePage: (args = {}) => dispatch({ type: 'router/gotoExampleAdd', ...args }),
        $gotoDonePage: (args = {}) => dispatch({ type: 'router/gotoExampleAdd_Done', ...args }),
        $submit: (args = {}) => dispatch({ type: 'example/$insert', ...args }),
    })
)
@Form.create()
export default class Index extends React.PureComponent {
    render() {
        const {
            form: { getFieldDecorator },
            loading,
        } = this.props;
        return (
            <Fragment>
                <Form layout="horizontal" className={styles.stepForm} hideRequiredMark>
                    <Form.Item {...formItemLayout} label="付款账户">
                        {getFieldDecorator('payAccount', {
                            initialValue: '',
                            rules: [{ required: true, message: '请选择付款账户' }],
                        })(
                            <Select placeholder="test@example.com">
                                <Option value="ant-design@alipay.com">ant-design@alipay.com</Option>
                            </Select>
                        )}
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{
                            xs: { span: 24, offset: 0 },
                            sm: {
                                span: formItemLayout.wrapperCol.span,
                                offset: formItemLayout.labelCol.span,
                            },
                        }}
                    >
                        <Button
                            htmlType="button"
                            type="primary"
                            loading={loading}
                            onClick={this.onClickValidate}
                        >
                            提交
                        </Button>
                        <Button
                            htmlType="button"
                            style={{ marginLeft: 8 }}
                            onClick={this.gotoPrePage}
                        >
                            上一步
                        </Button>
                    </Form.Item>
                </Form>
            </Fragment>
        );
    }

    onClickValidate = e => {
        e.preventDefault();
        const {
            form: { validateFields },
            data,
            $submit,
            $gotoDonePage,
        } = this.props;
        validateFields((err, values) => {
            if (!err) {
                $submit({
                    payload: {
                        ...data,
                        ...values,
                    },
                    callback: $gotoDonePage,
                });
            }
        });
    };

    gotoPrePage = () => {
        const { $gotoPrePage } = this.props;
        $gotoPrePage();
    };
}
