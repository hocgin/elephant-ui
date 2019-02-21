import {stringify} from 'qs';
import request from '@/utils/request';

const prefix = '/account';

/**
 * 登陆
 */
export async function login(payload) {
    return request(`${prefix}/login`, {
        method: 'POST',
        body: {
            ...payload
        },
    });
}

/**
 * 获取当前登陆账号信息
 */
export async function getCurrentAccount(payload) {
    const search = stringify(payload);
    return request(`${prefix}?${search}`);
}

/**
 * 获取当前账号具备的菜单
 */
export async function getMenus(payload) {
    const search = stringify(payload);
    return request(`${prefix}/menus?${search}`);
}
