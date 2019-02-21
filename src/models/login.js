import { routerRedux } from 'dva/router';
import { login } from '@/services/account';
import { stringify } from 'qs';
import { fakeAccountLogin, getFakeCaptcha } from '@/services/api';
import { getPageQuery } from '@/utils/utils';
import { LocalStorage } from '../utils/Constant';
import { message as Message } from 'antd';
import router from 'umi/router';

export default {
    namespace: 'login',

    state: {
        status: null,
        type: 'account',
    },

    effects: {
        // 登陆
        *login({ payload }, { call, put }) {
            const { code, data, message } = yield call(login, payload);
            if (code === 200) {
                const { token } = data;
                // 存储token
                localStorage.setItem(LocalStorage.TOKEN, token);
                const urlParams = new URL(window.location.href);
                const params = getPageQuery();
                let { redirect } = params;

                // 如果含有跳转URL则进行跳转。例如,?redirect=[url]
                if (redirect) {
                    const redirectUrlParams = new URL(redirect);
                    if (redirectUrlParams.origin === urlParams.origin) {
                        redirect = redirect.substr(urlParams.origin.length);
                        if (redirect.startsWith('/#')) {
                            redirect = redirect.substr(2);
                        }
                    } else {
                        window.location.href = redirect;
                        return;
                    }
                }
                yield put(routerRedux.replace(redirect || '/'));
            } else {
                Message.error(message);
            }
        },

        *getCaptcha({ payload }, { call }) {
            throw 'TODO: 获取验证码';
            // yield call(getFakeCaptcha, payload);
        },

        *logout(_, { put }) {
            yield put({
                type: 'changeLoginStatus',
                payload: {
                    status: false,
                },
            });
            yield put(
                router.push({
                    pathname: '/user/login',
                    search: stringify({
                        redirect: window.location.href,
                    }),
                })
            );
        },
    },

    reducers: {
        changeLoginStatus(state, { payload }) {
            return {
                ...state,
                status: payload.status,
                type: payload.type,
            };
        },
    },
};
