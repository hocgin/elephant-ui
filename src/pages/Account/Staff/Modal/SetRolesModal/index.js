import React, { Component } from 'react';
import { Form, message as Message, Modal, Select } from 'antd';
import { connect } from 'dva';
import PropTypes from 'prop-types';

@Form.create()
@connect(
    ({ staff }) => ({
        data: staff.detail || {},
    }),
    dispatch => ({
        $setRoles: (args = {}) => dispatch({ type: 'staff/update', ...args }),
        $fetch: (args = {}) => dispatch({ type: 'staff/fetch', ...args }),
    })
)
export default class SetRolesModal extends Component {
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
        onTabChange: () => {},
        onCancel: () => {},
    };

    componentDidMount() {
        const { $fetch, id } = this.props;
        $fetch({ payload: { id } });
    }

    render() {
        const {
            onCancel,
            visible,
            roles,
            data,
            form: { getFieldDecorator },
        } = this.props;
        let selected = (data.roles || []).map(({ id }) => id);
        return (
            <Modal
                destroyOnClose
                title="分配角色"
                visible={visible}
                onCancel={onCancel}
                onOk={this.onSubmit}
            >
                <Form.Item labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="角色列表">
                    {getFieldDecorator('roles', {
                        initialValue: selected,
                    })(
                        <Select mode="multiple" style={{ width: '100%' }} placeholder="请选择角色">
                            {roles.map(({ id, name }) => (
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
        const { id } = this.props;
        const {
            form: { validateFields, resetFields },
            onCancel,
            $setRoles,
        } = this.props;
        validateFields((err, fieldsValue) => {
            if (err) return;
            $setRoles({
                payload: {
                    id,
                    ...fieldsValue,
                },
                callback: () => {
                    Message.success('分配角色成功');
                    onCancel();
                },
            });
        });
    };
}
