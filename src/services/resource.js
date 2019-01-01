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

// export async function operatingPOST(params) {
//     return request(`/operating`, {
//         method: 'DELETE',
//         body: {
//             ...params
//         },
//     });
// }
