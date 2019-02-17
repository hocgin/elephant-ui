import request from '@/utils/request';

const classify = 'example';

// 分页查询
export async function paging(payload) {
    return request(`/${classify}/_paging`, {
        method: 'POST',
        body: {
            ...payload,
        },
    });
}

// 查询详情
export async function fetch({ id }) {
    return request(`/${classify}/${id}`, {
        method: 'GET',
    });
}

// 删除
export async function deletes(payload) {
    return request(`/${classify}`, {
        method: 'DELETE',
        body: {
            ...payload,
        },
    });
}

// 更新
export async function update(payload) {
    return request(`/${classify}/${payload.id}`, {
        method: 'PUT',
        body: {
            ...payload,
        },
    });
}

// 新增
export async function insert(payload) {
    return request(`/${classify}`, {
        method: 'POST',
        body: {
            ...payload,
        },
    });
}
