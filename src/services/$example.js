import { stringify } from 'qs';
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

// 删除
export async function deletes(payload) {
    return request(`/${classify}`, {
        method: 'DELETE',
        body: {
            ...payload,
        },
    });
}

export async function pagingx(query) {
    const search = stringify(query);
    let uri = '/operating';
    if (search.length) {
        uri += `?${search}`;
    }
    return request(`${uri}${stringify(query)}`);
}
