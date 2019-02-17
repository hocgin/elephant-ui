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
    ({ example }) => ({
        data: example.addValue,
    }),
    dispatch => ({
        $gotoNextPage: (args = {}) => dispatch({ type: 'router/gotoExampleAdd_Other', ...args }),
        $fill: (args = {}) => dispatch({ type: 'example/fillAddValue', ...args }),
    })
)
@Form.create()
export default class Index extends React.PureComponent {
    render() {
        const {
            form: { getFieldDecorator },
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
                        <Button type="primary" htmlType="button" onClick={this.onClickValidate}>
                            下一步
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
            $fill,
            $gotoNextPage,
        } = this.props;
        validateFields((err, values) => {
            if (!err) {
                $fill({
                    payload: values,
                });
                $gotoNextPage();
            }
        });
    };
}
