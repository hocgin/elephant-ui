import { stringify } from 'qs';
import request from '@/utils/request';

export async function uploadBase64s(payload) {
    return request(`/files/upload/base64`, {
        method: 'POST',
        body: {
            ...payload,
        },
    });
}