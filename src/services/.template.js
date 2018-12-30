import { stringify } from 'qs';
import request from '@/utils/request';

export async function operatingGET(params) {
    return request(`/operating?${stringify(params)}`);
}
export async function operatingPOST(params) {
    return request(`/operating`, {
        method: 'DELETE',
        body: {
            ...params
        },
    });
}