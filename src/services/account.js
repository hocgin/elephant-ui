import {stringify} from 'qs';
import request from '@/utils/request';

export async function login(params) {
    const {username, password} = params;
    return request(`/account/login`, {
        method: 'POST',
        body: {
            username,
            password
        },
    });
}

