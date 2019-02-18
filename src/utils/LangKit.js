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
    return buildTree(nodes[0], nodes);
}

/**
 * 构建树, 仅使用 lft rgt
 * @param nodes
 */
export function buildTree3(nodes) {
    const list = nodes
        .sort((node1, node2) => {
            return node1.lft - node2.lft;
        })
        .reverse();
    list.forEach((n, index) => {
        for (let i in list) {
            let n2 = list[i];
            if (n.lft > n2.lft && n.rgt < n2.rgt) {
                if (!n2.children) {
                    n2.children = [];
                }
                n2.children.push(n);
                delete list[index];
                break;
            }
        }
    });
    return list[list.length - 1];
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

/**
 * null or [] return true
 */
export function isEmpty(array) {
    return !array || array.length === 0;
}

/**
 * 切割数据
 * - 情况1
 * slice([1,2,3,4], 2)
 * [1,2]
 * - 情况2
 * slice([1], 2)
 * [1]
 * @param array
 * @param max
 * @returns {*}
 */
export function slice(array, max) {
    if (array.length < max) {
        max = array.length;
    }
    return array.slice(0, max);
}


/**
 * 拆分数组
 * chunk([1,2,3,4,5], 2) => [[1,2], [3, 4], [5]]
 * @param array
 * @param length
 * @returns {Array}
 */
export function chunk(array, length) {
    let index = 0;
    let newArray = [];

    while (index < array.length) {
        newArray.push(array.slice(index, index += length));
    }
    console.log(array, newArray);
    return newArray;
}
