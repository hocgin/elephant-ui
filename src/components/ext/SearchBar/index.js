import * as React from 'react';
import { Button, Form } from 'antd';

@Form.create()
export default class SearchBar extends React.Component {
    state = {
        expand: false,
    };

    render() {
        const { children } = this.props;
        const { form } = this.props;
        return (
            <Form onSubmit={this.onSubmit} layout="inline">
                {children(form)}
                <Button type="primary" htmlType="submit">
                    查询
                </Button>
                <Button htmlType="button" style={{ marginLeft: 8 }} onClick={this.onReset}>
                    重置
                </Button>
            </Form>
        );
    }

    renderSearchInput = ({ isExpand = false, children = [] }) => {
        if (isExpand) {
        }
    };

    /**
     * 提交数据
     * - 仅校验通过的会触发上层函数
     * @param e
     */
    onSubmit = e => {
        e.preventDefault();
        const { form, onSubmit } = this.props;
        form.validateFields((err, fieldsValue) => {
            if (err) return;
            onSubmit(fieldsValue);
        });
    };
    /**
     * 重置输入框
     */
    onReset = () => {
        const { form } = this.props;
        form.resetFields();
    };
}
