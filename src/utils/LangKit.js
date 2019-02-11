/**********************************
 *          [基础工具]
 ********************************/

import { TreeSelect } from 'antd/lib/tree-select';
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
 * 对象转化为 Ant List 数据源格式
 * @param object
 */
export function toAntListDataSource(object) {
    return Object.keys(object).map(item => {
        console.log(item);
        return {
            key: item,
            value: object[item],
        };
    });
}

export function toUTC(timestamp) {
    return moment(timestamp).format('YYYY-MM-DD HH:mm:ss');
}
