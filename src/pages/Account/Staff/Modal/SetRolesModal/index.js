import React, {PureComponent} from 'react';
import {Form, Modal, Select} from 'antd';
import PropTypes from "prop-types";

@Form.create()
export default class SetRolesModal extends PureComponent {
    static propTypes = {
        id: PropTypes.string,
        roles: PropTypes.array,
        visible: PropTypes.bool,
        selected: PropTypes.array,
        onCancel: PropTypes.func,
        onSubmit: PropTypes.func,
    };

    static defaultProps = {
        id: '',
        roles: [],
        visible: false,
        selected: [],
        onTabChange: () => {
        },
        onCancel: () => {
        },
    };

    render() {
        const {
            onCancel,
            visible,
            roles,
            selected,
            form: {getFieldDecorator},
        } = this.props;
        return (
            <Modal
                destroyOnClose
                title="分配角色"
                visible={visible}
                onCancel={onCancel}
                onOk={this.onSubmit}
            >
                <Form.Item labelCol={{span: 5}} wrapperCol={{span: 15}} label="角色列表">
                    {getFieldDecorator('roles', {
                        initialValue: selected,
                    })(
                        <Select mode="multiple" style={{width: '100%'}} placeholder="请选择角色">
                            {roles.map(({id, name}) => (
                                <Select.Option key={id}>{name}</Select.Option>
                            ))}
                        </Select>
                    )}
                </Form.Item>
            </Modal>
        );
    }

    /**
     * 提交
     */
    onSubmit = () => {
        const {id} = this.props;
        const {
            form: {validateFields, resetFields},
        } = this.props;
        validateFields((err, fieldsValue) => {
            if (err) return;
            resetFields();
            console.log({
                id,
                ...fieldsValue,
            });
        });
    };
}
