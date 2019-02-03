import request from '@/utils/request';

/**
 * 列出所有角色
 */
export async function page(query) {
    return request('/roles');
}

/**
 * 创建一个角色
 * @param body
 */
export async function insertOne(body) {
    return request('/roles', {
        method: 'POST',
        body: {
            ...body,
        },
    });
}

/**
 * 删除
 * @param id
 */
export async function deletes({ id }) {
    const IDs = toString([...id]);
    return request(`/roles?id=${IDs}`, {
        method: 'DELETE',
    });
}

/**
 * 查询详情
 * @param id
 */
export async function selectOne({ id }) {
    return request(`/roles/${id}`, {
        method: 'GET',
    });
}

/**
 * 更新
 * @param id
 * @param body
 */
export async function updateOne({ id, body }) {
    return request(`/roles/${id}`, {
        method: 'PUT',
        body: {
            ...body,
        },
    });
}
