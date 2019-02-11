/**********************************
 *          [基础工具]
 ********************************/

import React from 'react';
import moment from 'moment';

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
 * 树形格式化为 Ant 树型格式
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

/**
 * 构建树
 * 原理: 根据 lft、rgt 和 depth
 * @param root
 * @param children
 */
export function buildTree(root, children) {
    children
        .filter(child => {
            return root.depth === child.depth - 1 && root.rgt > child.rgt && root.lft < child.lft;
        })
        .forEach(child => {
            if (!root.children) {
                root.children = [];
            }
            if (root.children.some(item => item.id === child.id)) {
                return;
            }
            root.children.push(buildTree(child, children));
        });
    return root;
}

/**
 * 构建树
 * @param nodes
 * @returns {*}
 */
export function buildTree2(nodes) {
    const tree = buildTree(nodes[0], nodes);
    console.log('tree', tree);
    return tree;
}

/**
 * 对象转化为 Ant List 数据源格式
 * @param object
 */
export function toAntListDataSource(object) {
    return Object.keys(object).map(item => {
        return {
            key: item,
            value: object[item],
        };
    });
}

/**
 * 时间戳 => YYYY-MM-DD HH:mm:ss
 *
 * @param timestamp
 * @returns {string}
 */
export function toUTC(timestamp) {
    return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
}
