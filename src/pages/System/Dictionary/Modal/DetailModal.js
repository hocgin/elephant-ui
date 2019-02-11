import React, { PureComponent } from 'react';
import { Form, Select, Button, Modal, Steps } from 'antd';

/**
 * 更新弹窗
 * - visible 是否可见
 * - value 更新时携带的原值
 * - onCancel 取消时触发
 * - onDone 完成时触发
 */
@Form.create()
export default class DetailModal extends PureComponent {
    state = {};

    constructor(props) {
        super(props);

        const { renderContent } = this.rendering();
        this.renderContent = renderContent;
    }

    /**
     * =====================================
     *                  渲染
     * =====================================
     */
    render() {
        const { visible, onCancel } = this.props;
        return (
            <Modal
                width={640}
                bodyStyle={{ padding: '32px 40px 48px' }}
                destroyOnClose
                title="查看详情"
                visible={visible}
                onCancel={onCancel}
            >
                {this.renderContent()}
            </Modal>
        );
    }

    /**
     * 自定义函数
     */
    method = () => {
        const that = this;
        return {};
    };

    /**
     * 渲染函数
     */
    rendering = () => {
        const that = this;
        return {
            renderContent() {
                const values = that.props.values;
                console.log(values);
                return <p>内容: {values}</p>;
            },
        };
    };

    /**
     * 事件监听函数
     */
    listener = () => {
        const that = this;
        return {};
    };
}
