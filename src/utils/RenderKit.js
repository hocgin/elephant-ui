/**********************************
 *          [渲染组件相关]
 ********************************/

import { Badge, Icon, Tree } from 'antd';
import React from 'react';

/**
 * 渲染资源组件
 * <pre>
 *     renderResourceTreeNode(null, result)
 * </pre>
 */
export function renderResourceTreeNode(parent, nodes) {
    return (nodes || []).map(node => {
        return (
            <Tree.TreeNode
                key={node.id}
                disabled={!node.enabled}
                title={node.name}
                parentKey={parent}
                icon={<Icon type={node.icon} />}
            >
                {node.children && renderResourceTreeNode(node.id, node.children)}
            </Tree.TreeNode>
        );
    });
}

/**
 * 渲染开关状态
 * <pre>
 *     renderSwitch(true)
 * </pre>
 */
export function renderSwitch(isEnabled) {
    let state = isEnabled
        ? {
              status: 'success',
              text: '启用',
          }
        : {
              status: 'error',
              text: '禁用',
          };
    return <Badge status={state.status} text={state.text} />;
}
