import React, { PureComponent } from 'react';
import { List, Modal } from 'antd';
import { connect } from 'dva';
import * as LangKit from '../../../../utils/LangKit';

let renderRow = {
    id: data => `<b>编号:</b> ${data.id}`,
    name: data => `<b>角色名称:</b> ${data.name}`,
    mark: data => `<b>角色标识:</b> ${data.mark}`,
    description: data => `<b>描述:</b> ${data.mark}`,
    createdAt: data =>
        `<b>创建时间:</b> ${data.createdAt ? LangKit.toUTC(data.createdAt) : '暂无'}`,
    updatedAt: data =>
        `<b>更新时间:</b> ${data.updatedAt ? LangKit.toUTC(data.updatedAt) : '暂无'}`,
    deletedAt: data =>
        `<b>删除时间:</b> ${data.deletedAt ? LangKit.toUTC(data.deletedAt) : '暂无'}`,
};

/**
 * 详情弹窗
 * - visible 是否可见
 * - onCancel 取消事件
 */
@connect(({ role, loading }) => {
    console.log(role);
    return {
        // data 数据的加载状态
        result: role.result,
    };
})
export default class DetailModal extends PureComponent {
    state = {
        formVals: null,
    };

    constructor(props) {
        super(props);
    }

    /**
     * @组件挂载后
     */
    componentDidMount() {
        const { dispatch } = this.props;
        dispatch({
            type: 'role/selectOne',
            payload: {
                id: this.props.id,
            },
            callback: data => this.setState({ formVals: data }),
        });
    }

    render() {
        const { visible, onCancel } = this.props;
        const { formVals } = this.state;
        return (
            formVals && (
                <Modal
                    destroyOnClose
                    width={640}
                    bodyStyle={{ padding: '32px 40px 48px' }}
                    title="查看详情"
                    onCancel={onCancel}
                    onOk={onCancel}
                    visible={visible}
                >
                    <List bordered itemLayout="horizontal" size="small">
                        {Object.keys(formVals).map((key, index) => {
                            if (!Object.keys(renderRow).includes(key)) {
                                return null;
                            }
                            return (
                                <List.Item key={index} column={1}>
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: renderRow[key](formVals),
                                        }}
                                    />
                                </List.Item>
                            );
                        })}
                    </List>
                </Modal>
            )
        );
    }
}
