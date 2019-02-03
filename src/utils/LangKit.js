/**********************************
 *          [基础工具]
 ********************************/

import { TreeSelect } from 'antd/lib/tree-select';
import React from 'react';

/**
 * MyBatis Plus 分页格式 ==> Ant Pro 分页格式
 *
 * @param mybatisPlusPage
 */
export function toAntProPage(mybatisPlusPage) {
    return {
        list: mybatisPlusPage.records,
        pagination: {
            total: mybatisPlusPage.total,
            pageSize: mybatisPlusPage.size,
            current: mybatisPlusPage.current,
        },
    };
}

/**
 * Resource 树形格式化为 Ant 树型格式
 */
export function toAntTreeData(nodes) {
    return (nodes || []).map(node => {
        return {
            title: `${node.name}`,
            value: `${node.id}`,
            key: `${node.id}`,
            children: toAntTreeData(node.children),
        };
    });
}
