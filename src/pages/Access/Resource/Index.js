import React, {PureComponent} from 'react';
import {connect} from 'dva';
import {Button, Card, Col, Form, Icon, Input, Menu, message, Modal, Row, Select, Tree,} from 'antd';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import CreateModal from './Modal/CreateModal';

import styles from './Index.less';
import UpdateModal from './Modal/UpdateModal';
import {Status, Types} from './constant/constant';
import * as LangKit from '../../../utils/LangKit';
import * as RenderKit from '../../../utils/RenderKit';

const Constant = {
    CREATE_MODAL_VISIBLE: 'createModalVisible',
    UPDATE_MODAL_VISIBLE: 'updateModalVisible',
};

/* eslint react/no-multi-comp:0 */
@connect(({resource, loading}) => ({
    allResource: resource.all,
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
        // 更新
        updateId: null,
    };

    constructor(props) {
        super(props);

        /**
         * 挂载函数
         */
        [this.methods(), this.rendering(), this.listener()]
            .map(item => {
                return Object.keys(item).map(key => {
                    return item[key];
                });
            })
            .reduce((func1, func2) => {
                return [...func1, ...func2];
            })
            .forEach(func => {
                this[func.name] = func;
            });
    }

    /**
     * @组件挂载后
     */
    componentDidMount() {
        const {dispatch} = this.props;
        dispatch({
            type: 'resource/selectAll',
        });
    }

    render() {
        const {
            route: {name},
            allResource,
        } = this.props;
        const {selectedRows, expandedKeys, autoExpandParent} = this.state;
        return (
            allResource.length && (
                <PageHeaderWrapper title={name}>
                    <Card bordered={false}>
                        <div className={styles.tableList}>
                            {/*搜索层*/}
                            <div className={styles.tableListForm}>{this.renderSearchBar()}</div>
                            {/*工具栏(新建/批量操作)层*/}
                            <div className={styles.tableListOperator}>
                                <Button
                                    icon="plus"
                                    type="primary"
                                    onClick={() => {
                                        this.onShow(Constant.CREATE_MODAL_VISIBLE);
                                    }}
                                    htmlType="button"
                                >
                                    新建
                                </Button>
                                {selectedRows.length > 0 && (
                                    <Button onClick={this.onClickBatchDelete} htmlType="button">
                                        批量删除
                                    </Button>
                                )}
                            </div>
                            <Tree
                                showIcon
                                multiple
                                defaultExpandAll={true}
                                onExpand={this.onExpand}
                                expandedKeys={expandedKeys}
                                autoExpandParent={autoExpandParent}
                                onSelect={this.onSelectTreeNodeRow}
                                onRightClick={this.onRightClickNode}
                            >
                                {RenderKit.renderResourceTreeNode(null, [
                                    LangKit.buildTree2(allResource),
                                ])}
                            </Tree>
                        </div>
                    </Card>
                    {this.renderCreateModal()}
                    {this.renderUpdateModal()}
                    {this.renderRightPanel()}
                </PageHeaderWrapper>
            )
        );
    }

    methods() {
        const that = this;
        return {
            iteration: (parent, children, handle) => {
                (children || []).forEach((item, index, self) => {
                    if (handle) {
                        handle(parent, item);
                    }
                    that.iteration(item, item.children, handle);
                });
            },
        };
    }

    rendering() {
        const that = this;
        return {
            /**
             * 根据情况渲染搜索框
             */
            renderSearchBar() {
                const {
                    form: {getFieldDecorator},
                } = that.props;
                const {expandForm} = that.state;

                const items = [
                    <Col key={0} md={8} sm={24}>
                        <Form.Item label="资源名称">
                            {getFieldDecorator('name')(<Input placeholder="请输入"/>)}
                        </Form.Item>
                    </Col>,
                    <Col key={1} md={8} sm={24}>
                        <Form.Item label="启用状态">
                            {getFieldDecorator('enabled')(
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
                        </Form.Item>
                    </Col>,
                    <Col key={2} md={8} sm={24}>
                        <Form.Item label="资源类型">
                            {getFieldDecorator('type')(
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
                        </Form.Item>
                    </Col>,
                ];

                return (
                    <Form onSubmit={that.onClickSearchButton} layout="inline">
                        <Row gutter={{md: 8, lg: 24, xl: 48}}>
                            {!!expandForm ? items : [items[0], items[1]]}
                            {/*收起状态*/}
                            {!expandForm && (
                                <Col md={8} sm={24}>
                                    <span className={styles.submitButtons}>
                                        <Button type="primary" htmlType="submit">
                                            查询
                                        </Button>
                                        <Button
                                            style={{marginLeft: 8}}
                                            onClick={that.onClickResetSearch}
                                        >
                                            重置
                                        </Button>
                                        <a
                                            style={{marginLeft: 8}}
                                            onClick={that.onClickToggleSearchMode}
                                        >
                                            展开 <Icon type="down"/>
                                        </a>
                                    </span>
                                </Col>
                            )}
                        </Row>
                        {/*展开状态*/}
                        {expandForm && (
                            <div style={{overflow: 'hidden'}}>
                                <div style={{float: 'right', marginBottom: 24}}>
                                    <Button type="primary" htmlType="submit">
                                        查询
                                    </Button>
                                    <Button
                                        style={{marginLeft: 8}}
                                        onClick={that.onClickResetSearch}
                                    >
                                        重置
                                    </Button>
                                    <a
                                        style={{marginLeft: 8}}
                                        onClick={that.onClickToggleSearchMode}
                                    >
                                        收起 <Icon type="up"/>
                                    </a>
                                </div>
                            </div>
                        )}
                    </Form>
                );
            },
            /**
             * 渲染树节点右键菜单
             */
            renderRightPanel() {
                const {rightEvent, rightNode} = that.state;
                if (!rightEvent) {
                    return null;
                }
                let {pageX, pageY} = rightEvent;
                const tmpStyle = {
                    position: 'absolute',
                    left: `${pageX - 10}px`,
                    top: `${pageY - 5}px`,
                };
                return (
                    <Menu
                        style={tmpStyle}
                        onMouseLeave={() => {
                            that.setState({rightEvent: null, rightNode: null});
                        }}
                        onClick={this.onClickMenus}
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
            },
            /**
             * 渲染创建弹窗
             */
            renderCreateModal() {
                const {allResource, dispatch} = this.props;
                const {createModalVisible, createDefaultParent} = this.state;
                return (
                    allResource.length && (
                        <CreateModal
                            visible={createModalVisible}
                            defaultParent={createDefaultParent}
                            onCancel={() => {
                                this.onHidden(Constant.CREATE_MODAL_VISIBLE);
                            }}
                            onDone={formVals => {
                                dispatch({
                                    type: 'resource/save',
                                    payload: formVals,
                                    callback: () => {
                                        this.onHidden(Constant.CREATE_MODAL_VISIBLE);
                                        message.success('新增成功');
                                    },
                                });
                            }}
                        />
                    )
                );
            },
            /**
             * 渲染更新弹窗
             */
            renderUpdateModal() {
                const {allResource, dispatch} = that.props;
                const {updateModalVisible, updateId} = that.state;
                return updateId && updateModalVisible ? (
                    <UpdateModal
                        visible={updateModalVisible}
                        nodes={allResource}
                        onCancel={() => {
                            this.onHidden(Constant.UPDATE_MODAL_VISIBLE);
                        }}
                        id={updateId}
                        onDone={(id, formVals) => {
                            dispatch({
                                type: 'resource/updateOne',
                                payload: {
                                    id,
                                    body: formVals,
                                },
                                callback: () => {
                                    this.onHidden(Constant.UPDATE_MODAL_VISIBLE);
                                    message.success('更新成功');
                                },
                            });
                        }}
                    />
                ) : null;
            },
        };
    }

    listener() {
        const that = this;
        return {
            onShow(key) {
                that.setState({
                    [key]: true,
                });
            },
            onHidden(key) {
                that.setState({
                    [key]: false,
                });
            },
            /**
             * 点击展开触发
             * @param expandedKeys
             */
            onExpand(expandedKeys) {
                that.setState({
                    expandedKeys,
                    autoExpandParent: false,
                });
            },
            /**
             * 批量删除
             */
            onClickBatchDelete() {
                const {selectedRows} = that.state;
                const {dispatch} = that.props;
                if (!selectedRows.length) {
                    return;
                }
                Modal.confirm({
                    title: '警告!',
                    content: '该操作将会删除该节点及其子节点, 请谨慎操作。',
                    onOk() {
                        dispatch({
                            type: 'resource/deletes',
                            payload: {
                                id: selectedRows,
                                mode: 0,
                            },
                            callback: () => {
                                message.success('删除成功');
                            },
                        });
                    },
                    onCancel() {
                    },
                });
            },
            /**
             * 菜单点击
             * @param e
             */
            onClickMenus({item, key, keyPath}) {
                const {dispatch} = that.props;
                switch (key) {
                    case 'enable': {
                        const {rightNode} = that.state;
                        dispatch({
                            type: 'resource/updateOne',
                            payload: {
                                id: rightNode.props.eventKey,
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
                        const {rightNode} = that.state;
                        dispatch({
                            type: 'resource/updateOne',
                            payload: {
                                id: rightNode.props.eventKey,
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
                        const {rightNode} = that.state;
                        that.setState({
                            updateId: rightNode.props.eventKey,
                        }, () => {
                            that.onShow(Constant.UPDATE_MODAL_VISIBLE);
                        });
                        break;
                    }
                    case 'appendNode': {
                        // 新建同级节点
                        const {rightNode} = that.state;
                        that.setState({
                            createDefaultParent: rightNode.props.parentKey,
                            createDefaultStep: 1,
                        }, () => {
                            that.onShow(Constant.CREATE_MODAL_VISIBLE);
                        });
                        break;
                    }
                    case 'addChild': {
                        // 新建子节点
                        const {rightNode} = that.state;
                        that.setState({
                            createDefaultParent: rightNode.props.eventKey,
                            createDefaultStep: 1,
                        }, () => {
                            that.onShow(Constant.CREATE_MODAL_VISIBLE);
                        });
                        break;
                    }
                    case 'deleteGroup': {
                        const {rightNode} = that.state;
                        Modal.confirm({
                            title: '警告!',
                            content: '该操作将会删除该节点及其子节点, 请谨慎操作。',
                            onOk() {
                                dispatch({
                                    type: 'resource/deletes',
                                    payload: {
                                        id: [rightNode.props.eventKey],
                                        mode: 0,
                                    },
                                    callback: () => {
                                        message.success('删除成功');
                                    },
                                });
                            },
                            onCancel() {
                            },
                        });
                        break;
                    }
                    case 'deleteOne': {
                        const {rightNode} = that.state;
                        Modal.confirm({
                            title: '警告!',
                            content: '该操作将会删除该节点并将其子节点提升到该节点级别, 请谨慎操作。',
                            onOk() {
                                dispatch({
                                    type: 'resource/deletes',
                                    payload: {
                                        id: [rightNode.props.eventKey],
                                        mode: 1,
                                    },
                                    callback: () => {
                                        message.success('删除成功');
                                    },
                                });
                            },
                            onCancel() {
                            },
                        });
                        break;
                    }
                    default:
                        console.log('[ERROR]未定义Key', key);
                }
            },
            /**
             * 选择树节点
             */
            onSelectTreeNodeRow(selectedKeys, e) {
                that.setState({
                    selectedRows: selectedKeys,
                });
            },
            /**
             * 右键点击节点
             * @param event
             * @param node
             */
            onRightClickNode({event, node}) {
                const {pageX, pageY} = event;
                that.setState({
                    rightNode: node,
                    rightEvent: {
                        pageX,
                        pageY,
                    },
                });
            },
            /**
             * 处理展开/收起
             */
            onClickToggleSearchMode() {
                const {expandForm} = that.state;
                that.setState({
                    expandForm: !expandForm,
                });
            },
            /**
             * 处理搜索条件重置
             */
            onClickResetSearch() {
                const {form} = that.props;
                form.resetFields();
            },
            /**
             * 点击搜索按钮
             * @param e
             */
            onClickSearchButton(e) {
                e.preventDefault();
                const {form, allResource} = that.props;

                form.validateFields((err, fieldsValue) => {
                    if (err) return;
                    const {name, enabled, type} = fieldsValue;
                    let expandedKeys = [];
                    that.iteration(allResource[0], allResource[0].children, (parent, item) => {
                        if (
                            (name === undefined || item.name.indexOf(name) > -1) &&
                            (enabled === undefined || `${item.enabled}` === enabled) &&
                            (type === undefined || item.type === type)
                        ) {
                            expandedKeys.push(parent.id);
                        }
                    });

                    that.setState({
                        expandedKeys,
                        autoExpandParent: true,
                    });
                });
            },
        };
    }
}
