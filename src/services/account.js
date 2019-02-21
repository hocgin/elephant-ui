import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 登陆
 * @param username
 * @param password
 */
export async function login({ username, password }) {
    return request(`/api/v1/account/login`, {
        method: 'POST',
        body: {
            username,
            password,
        },
    });
}

/**
 * 获取当前登陆账号信息
 * @param query
 */
export async function getCurrentUserInfo(query) {
    const search = stringify(query);
    let uri = '/api/v1/account';
    if (search.length) {
        uri += `?${search}`;
    }
    return request(uri);
}

/**
 * 获取当前账号具备的菜单
 * @param query
 */
export async function getMenus(query) {
    const search = stringify(query);
    let uri = '/api/v1/account/menus';
    if (search.length) {
        uri += `?${search}`;
    }
    return request(uri);
}
