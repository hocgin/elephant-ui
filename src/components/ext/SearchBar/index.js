import * as React from "react";
import {Button, DatePicker, Form} from "antd";

@Form.create()
export default class SearchBar extends React.PureComponent {
    render() {
        const {onSubmit} = this.props;
        const {form} = this.props;
        console.log(onSubmit);
        return <Form onSubmit={onSubmit.bind(this, form)} layout="inline">
            <Form.Item label="创建日期">
                {form.getFieldDecorator('createdAt')(
                    <DatePicker
                        style={{width: '100%'}}
                        placeholder="请输入更新日期"
                    />
                )}
            </Form.Item>
            <Button type="primary" htmlType="submit">
                查询
            </Button>
        </Form>
    }
}