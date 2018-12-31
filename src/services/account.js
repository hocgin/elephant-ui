import { stringify } from 'qs';
import request from '@/utils/request';

/**
 * 登陆
 * @param username
 * @param password
 * @returns {Promise<void>}
 */
export async function login({ username, password }) {
  return request(`/account/login`, {
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
 * @returns {Promise<void>}
 */
export async function getCurrentUserInfo(query) {
  const search = stringify(query);
  let uri = '/account';
  if (search.length) {
    uri += `?${search}`;
  }
  return request(uri);
}

/**
 * 获取当前账号具备的菜单
 * @param query
 * @returns {Promise<void>}
 */
export async function getMenus(query) {
  const search = stringify(query);
  let uri = '/account/menus';
  if (search.length) {
    uri += `?${search}`;
  }
  return request(uri);
}
