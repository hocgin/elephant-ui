import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 分页查询
 */
export async function paging(query) {
    return request(`/example/_paging`, {
        method: 'POST',
        body: {
            ...query,
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
