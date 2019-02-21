import { stringify } from 'qs';
import request from '@/utils/request';
import { toString } from '@/utils/utils';

const prefix = '/resources';

/**
 * 查询节点信息
 * @param query
 */
export async function selectAll(query) {
    return request(`${prefix}?${stringify(query)}`);
}

/**
 * 增加节点
 * @param body
 */
export async function insert(body) {
    return request(`${prefix}`, {
        method: 'POST',
        body: {
            ...body,
        },
    });
}

/**
 * 删除选中节点及其子节点
 * 1. mode=1
 *  |- Node1
 *       |-Node2
 *       |-Node3
 *  移除Node1后, Node2, Node3则移动到其所在层级
 * 2. model=0
 *  |- Node1
 *       |-Node2
 *       |-Node3
 *  移除Node1后, Node2, Node3也会被移除
 *
 * @param body
 * @returns {Promise<void>}
 */
export async function deletes({ id, mode }) {
    const IDs = toString([...id]);
    return request(`${prefix}?id=${IDs}&mode=${mode || 0}`, {
        method: 'DELETE',
    });
}

export async function selectOne({ id }) {
    return request(`${prefix}/${id}`, {
        method: 'GET',
    });
}

export async function updateOne({ id, body }) {
    return request(`${prefix}/${id}`, {
        method: 'PUT',
        body: {
            ...body,
        },
    });
}
