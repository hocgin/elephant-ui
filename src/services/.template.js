import { stringify } from 'qs';
import request from '@/utils/request';

export async function operatingGET(query) {
  const search = stringify(query);
  let uri = '/operating';
  if (search.length) {
    uri += `?${search}`;
  }
  return request(`${uri}${stringify(query)}`);
}
export async function operatingPOST(params) {
  return request(`/operating`, {
    method: 'DELETE',
    body: {
      ...params,
    },
  });
}
