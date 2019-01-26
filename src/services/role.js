import request from '@/utils/request';

/**
 * 列出所有角色
 */
export async function page(params) {
    return request('/roles');
}
