import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Button, Card, Form, Icon, Input, Menu, message, Modal, Select, Tree,} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import CreateModal from './Modal/CreateModal';
import UpdateModal from './Modal/UpdateModal';
import {Status, Types} from './constant/constant';
import * as LangKit from '../../../utils/LangKit';
import * as RenderKit from '../../../utils/RenderKit';
import SearchBar from "../../../components/ext/SearchBar";
import Toolbar from "../../../components/ext/Toolbar";

const Constant = {
    CREATE_MODAL_VISIBLE: 'createModalVisible',
    UPDATE_MODAL_VISIBLE: 'updateModalVisible',
};

/* eslint react/no-multi-comp:0 */
@connect(({resource, loading}) => ({
    allResource: resource.all,
}), dispatch => ({
    $findAll: (args = {}) => dispatch({type: 'resource/selectAll', ...args}),
    $insert: (args = {}) => dispatch({type: 'resource/save', ...args}),
    $update: (args = {}) => dispatch({type: 'resource/updateOne', ...args}),
    $delete: (args = {}) => {
        const content = ['该操作将会删除该节点及其子节点, 请谨慎操作。', '该操作将会删除该节点并将其子节点提升到该节点级别, 请谨慎操作。'][args.payload.mode * 1];
        console.log(args);
        Modal.confirm({
            title: '警告',
            content: content,
            onOk() {
                dispatch({
                    type: 'resource/delete',
                    ...args
                });
            },
        });
    },
}))
@Form.create()
export default class Index extends PureComponent {
    state = {
        expandForm: false,
        // 选中行的ID
        selectedRows: [],
        // 展开的节点
        expandedKeys: [],
        autoExpandParent: false,
        // 右键位置
        rightEvent: null,
        rightNode: null,
        // 新建时默认节点
        createDefaultParent: null,
        createStep: null,
        operateRow: null,
        searchValues: {},
    };

    /**
     * @组件挂载后
     */
    componentDidMount() {
        const {$findAll} = this.props;
        $findAll();
    }

    render() {
        const {
            route: {name},
            allResource,
        } = this.props;
        const {
            selectedRows,
            expandedKeys,
            autoExpandParent,
            operateRow,
            createDefaultParent,
            [Constant.CREATE_MODAL_VISIBLE]: createModalVisible,
            [Constant.UPDATE_MODAL_VISIBLE]: updateModalVisible,
        } = this.state;
        const BatchMenus = ({onClick}) => (
            <Menu onClick={onClick}>
                <Menu.Item key="delete">批量删除</Menu.Item>
            </Menu>
        );

        // 右键菜单
        const RightPanel = () => {
            const {rightEvent, rightNode} = this.state;
            if (!rightEvent) {
                return null;
            }
            let {pageX, pageY} = rightEvent;
            const tmpStyle = {
                position: 'absolute',
                left: `${pageX - 10}px`,
                top: `${pageY - 5}px`,
            };
            const onMouseLeave = () => {
                this.setState({rightEvent: null, rightNode: null});
            };
            return (
                <Menu
                    style={tmpStyle}
                    onMouseLeave={onMouseLeave}
                    onClick={this.onClickRightMenu}
                >
                    <Menu.Item key={rightNode.props.disabled ? 'enable' : 'disable'}>
                        <Icon type="edit"/>
                        {rightNode.props.disabled ? '启用' : '禁用'}
                    </Menu.Item>
                    <Menu.Item key="edit">
                        <Icon type="edit"/>
                        {'修改'}
                    </Menu.Item>
                    <Menu.Item key="appendNode">
                        <Icon type="plus-circle"/>
                        {'加同级'}
                    </Menu.Item>
                    <Menu.Item key="addChild">
                        <Icon type="plus-circle-o"/>
                        {'加下级'}
                    </Menu.Item>
                    <Menu.Item key="deleteGroup">
                        <Icon type="minus-circle-o"/>
                        {'删除目录'}
                    </Menu.Item>
                    <Menu.Item key="deleteOne">
                        <Icon type="minus-circle-o"/>
                        {'仅移除该节点'}
                    </Menu.Item>
                </Menu>
            );
        };
        return (
            allResource.length > 0 && (
                <PageHeaderWrapper title={name}>
                    <Card bordered={false}>
                        <SearchBar onSubmit={this.onClickSearch}>
                            {form => [
                                <Form.Item label="资源名称">
                                    {form.getFieldDecorator('name')(<Input placeholder="请输入"/>)}
                                </Form.Item>,
                                <Form.Item label="启用状态">
                                    {form.getFieldDecorator('enabled')(
                                        <Select placeholder="请选择" style={{width: '100%'}}>
                                            {Status.map(({value, text}) => {
                                                return (
                                                    <Select.Option key={value} value={value}>
                                                        {text}
                                                    </Select.Option>
                                                );
                                            })}
                                        </Select>
                                    )}
                                </Form.Item>,
                                <Form.Item label="资源类型">
                                    {form.getFieldDecorator('type')(
                                        <Select placeholder="请选择" style={{width: '100%'}}>
                                            {Types.map(({value, text}) => {
                                                return (
                                                    <Select.Option key={value} value={value}>
                                                        {text}
                                                    </Select.Option>
                                                );
                                            })}
                                        </Select>
                                    )}
                                </Form.Item>,
                            ]}
                        </SearchBar>
                        <Toolbar menu={<BatchMenus onClick={this.onClickBatchMenu}/>}
                                 selectedRows={selectedRows}>
                            <Button htmlType="button"
                                    icon="plus"
                                    type="primary"
                                    onClick={this.onShow.bind(this, Constant.CREATE_MODAL_VISIBLE)}
                            >
                                新建
                            </Button>
                        </Toolbar>
                        <div>
                            <Tree
                                showIcon
                                multiple
                                defaultExpandAll={true}
                                onExpand={this.onExpand}
                                expandedKeys={expandedKeys}
                                autoExpandParent={autoExpandParent}
                                onSelect={this.onSelectRows}
                                onRightClick={this.onRightClickNode}
                            >
                                {RenderKit.renderResourceTreeNode(null, [
                                    LangKit.buildTree2(allResource),
                                ])}
                            </Tree>
                        </div>
                    </Card>
                    {createModalVisible && <CreateModal
                        visible={createModalVisible}
                        defaultParent={createDefaultParent}
                        onCancel={this.onClose.bind(this, Constant.CREATE_MODAL_VISIBLE)}
                        onDone={this.onSubmitAdd}
                    />}
                    {operateRow &&
                    updateModalVisible && (
                        <UpdateModal
                            visible={updateModalVisible}
                            nodes={allResource}
                            onCancel={this.onClose.bind(this, Constant.UPDATE_MODAL_VISIBLE)}
                            onDone={this.onSubmitUpdate}
                            id={operateRow}
                        />
                    )}
                    <RightPanel/>
                </PageHeaderWrapper>
            )
        );
    }

    // 提交添加
    onSubmitAdd = (formVals) => {
        const {$insert} = this.props;
        $insert({
            payload: formVals,
            callback: () => {
                this.onClose(Constant.CREATE_MODAL_VISIBLE);
                message.success('新增成功');
            },
        });
    };

    // 提交更新
    onSubmitUpdate = (id, formVals) => {
        const {$update} = this.props;
        $update({
            payload: {
                id,
                body: formVals,
            },
            callback: () => {
                this.onClose(Constant.UPDATE_MODAL_VISIBLE);
                message.success('更新成功');
            },
        });
    };

    // 点击批量操作菜单
    onClickBatchMenu = e => {
        const {selectedRows, searchValues} = this.state;
        if (!selectedRows) return;
        const {$delete, $paging} = this.props;
        switch (e.key) {
            case 'delete': {
                $delete({
                    payload: {
                        id: selectedRows.map(row => row.id),
                        mode: 0,
                    },
                    callback: () => {
                        message.success('删除成功');
                    },
                });
                break;
            }
            default:
                return;
        }
    };

    // 右键菜单的点击
    onClickRightMenu = ({item, key, keyPath}) => {
        const {$delete, $update} = this.props;
        switch (key) {
            case 'enable': {
                const {rightNode: {props: {eventKey}}} = this.state;
                $update({
                    payload: {
                        id: eventKey,
                        body: {
                            enabled: true,
                        },
                    },
                    callback: () => {
                        message.success('更新成功');
                    },
                });
                break;
            }
            case 'disable': {
                const {rightNode: {props: {eventKey}}} = this.state;
                $update({
                    payload: {
                        id: eventKey,
                        body: {
                            enabled: false,
                        },
                    },
                    callback: () => {
                        message.success('更新成功');
                    },
                });
                break;
            }
            case 'edit': {
                const {rightNode: {props: {eventKey}}} = this.state;
                this.setState({
                    operateRow: eventKey,
                }, this.onShow.bind(this, Constant.UPDATE_MODAL_VISIBLE));
                break;
            }
            case 'appendNode': {
                // 新建同级节点
                const {rightNode: {props: {eventKey}}} = this.state;
                this.setState({
                    createDefaultParent: eventKey,
                    createDefaultStep: 1,
                }, this.onShow.bind(this, Constant.CREATE_MODAL_VISIBLE));
                break;
            }
            case 'addChild': {
                // 新建子节点
                const {rightNode: {props: {eventKey}}} = this.state;
                this.setState({
                    createDefaultParent: eventKey,
                    createDefaultStep: 1,
                }, this.onShow.bind(this, Constant.CREATE_MODAL_VISIBLE));
                break;
            }
            case 'deleteGroup': {
                const {rightNode: {props: {eventKey}}} = this.state;
                $delete({
                    payload: {
                        id: [eventKey],
                        mode: 0,
                    },
                    callback: () => {
                        message.success('删除成功');
                    },
                });
                break;
            }
            case 'deleteOne': {
                const {rightNode: {props: {eventKey}}} = this.state;
                $delete({
                    payload: {
                        id: [eventKey],
                        mode: 1,
                    },
                    callback: () => {
                        message.success('删除成功');
                    },
                });
                break;
            }
            default:
                console.log('[ERROR]未定义Key', key);
        }
    };

    /**
     * 点击搜索按钮
     * @param values
     */
    onClickSearch = ({name, enabled, type}) => {
        const {allResource} = this.props;
        let expandedKeys = [];
        this.iteration(allResource[0], allResource[0].children, (parent, item) => {
            if (
                (name === undefined || item.name.indexOf(name) > -1) &&
                (enabled === undefined || `${item.enabled}` === enabled) &&
                (type === undefined || item.type === type)
            ) {
                expandedKeys.push(parent.id);
            }
        });

        this.setState({
            expandedKeys,
            autoExpandParent: true,
        });
    };

    // 选择树节点
    onSelectRows = (rows) => {
        this.setState({
            selectedRows: rows,
        });
    };

    // 右键点击节点
    onRightClickNode = ({event, node}) => {
        const {pageX, pageY} = event;
        this.setState({
            rightNode: node,
            rightEvent: {
                pageX,
                pageY,
            },
        });
    };

    // 点击展开
    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };

    iteration = (parent, children, handle) => {
        (children || []).forEach((item, index, self) => {
            if (handle) {
                handle(parent, item);
            }
            this.iteration(item, item.children, handle);
        });
    };

    onShow = (key) => {
        this.setState({
            [key]: true,
        });
    };

    onClose = (key) => {
        this.setState({
            [key]: false,
        });
    };

}
