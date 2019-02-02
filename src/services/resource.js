import { stringify } from 'qs';
import fetch from 'dva/fetch';
import request from '@/utils/request';
import { toString } from '@/utils/utils';

/**
 * 查询节点信息
 * @param query
 */
export async function selectBy(query) {
    const search = stringify(query);
    let uri = '/resource';
    if (search.length) {
        uri += `?${search}`;
    }
    return request(`${uri}${stringify(query)}`);
}

/**
 * 增加节点
 * @param body
 */
export async function insert(body) {
    return request(`/resource`, {
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
    return request(`/resource?id=${IDs}&mode=${mode || 0}`, {
        method: 'DELETE',
    });
}

export async function selectOne({ id }) {
    return request(`/resource/${id}`, {
        method: 'GET',
    });
}

export async function updateOne({ id, body }) {
    return request(`/resource/${id}`, {
        method: 'PUT',
        body: {
            ...body,
        },
    });
}
