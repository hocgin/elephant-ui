import { stringify } from 'qs';
import request from '@/utils/request';

export async function query(query) {
  const search = stringify(query);
  let uri = '/resource';
  if (search.length) {
    uri += `?${search}`;
  }
  return request(`${uri}${stringify(query)}`);
}

export async function insert(body) {
  return request(`/resource`, {
    method: 'POST',
    body: {
      ...body,
    },
  });
}
