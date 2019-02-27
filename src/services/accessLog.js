import request from '@/utils/request';

const prefix = '/access-log';

// 分页查询
export async function paging(payload) {
    return request(`${prefix}/_paging`, {
        method: 'POST',
        body: {
            ...payload,
        },
    });
}

// 查询详情
export async function detail({id}) {
    return request(`${prefix}/${id}`, {
        method: 'GET',
    });
}

// 删除
export async function deletes(payload) {
    return request(`${prefix}`, {
        method: 'DELETE',
        body: {
            ...payload,
        },
    });
}

// 更新
export async function update(payload) {
    return request(`${prefix}/${payload.id}`, {
        method: 'PUT',
        body: {
            ...payload,
        },
    });
}

// 新增
export async function insert(payload) {
    return request(`${prefix}`, {
        method: 'POST',
        body: {
            ...payload,
        },
    });
}
