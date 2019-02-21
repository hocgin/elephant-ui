import request from '@/utils/request';

const prefix = '/roles';

/**
 * 查询所有
 */
export async function findAll(query) {
    return request(`${prefix}`);
}

/**
 * 分页查询
 */
export async function _paging(query) {
    return request(`${prefix}/_paging`, {
        method: 'POST',
        body: {
            ...query,
        },
    });
}

/**
 * 创建一个角色
 * @param body
 */
export async function insertOne(body) {
    return request(`${prefix}`, {
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
export async function deletes({id}) {
    return request(`${prefix}`, {
        method: 'DELETE',
        body: {
            id,
        },
    });
}

/**
 * 查询详情
 * @param id
 */
export async function selectOne({id}) {
    return request(`${prefix}/${id}`, {
        method: 'GET',
    });
}

/**
 * 更新
 * @param id
 * @param body
 */
export async function updateOne({id, body}) {
    return request(`${prefix}/${id}`, {
        method: 'PUT',
        body,
    });
}
