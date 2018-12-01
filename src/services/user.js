import request from '@/utils/request';

export async function queryUserMenu(token) {
    return request(`/api/user/menu?token=${token}`);
}
export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}
