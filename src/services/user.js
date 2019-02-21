import request from '@/utils/request';

const prefix = '/staff';
export async function fetch(payload) {
  return request(`${prefix}`);
}

export async function queryCurrent() {
  return request('/api/currentUser');
}
