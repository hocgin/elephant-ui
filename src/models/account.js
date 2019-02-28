import {getCurrentAccount, getMenus, login, update} from '@/services/account';
import {message as Message, message} from 'antd';
import * as LangKit from "../utils/LangKit";
import { getPageQuery } from '@/utils/utils';
import queryString from "query-string";
import {LocalStorage, ResultCode} from "../utils/Constant";
import * as routerRedux from "react-router-redux";
import router from "umi/router";
import {stringify} from "qs";

export default {
    namespace: 'account',
    state: {
        status: false,
        currentUser: {},
        menus: [],
        type: 'account'
    },

    effects: {
        // 更新账号信息
        * update({ payload, callback }, { call, put }) {
            const { code, data, message } = yield call(update, payload);
            if (code === ResultCode.SUCCESS) {
                if (callback) {
                    callback();
                }
            } else {
                Message.error(message);
            }

        },
        // 登陆
        *login({ payload }, { call, put }) {
            const { code, data, message } = yield call(login, payload);
            if (code === ResultCode.SUCCESS) {
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
        // 查询当前账号信息
        * getCurrentAccount({payload}, {call, put}) {
            const result = yield call(getCurrentAccount, payload);
            if (result.code === 200) {
                yield put({
                    type: 'fillCurrentUser',
                    payload: result.data,
                });
            } else {
                message.error(result.message);
            }
        },
        // 获取当前账号具备的菜单
        * getMenus({payload}, {call, put}) {
            const result = yield call(getMenus, payload);
            if (result.code === 200) {
                const menus = result.data.length ? LangKit.buildTree2(result.data).children : [];
                yield put({
                    type: 'fillMenus',
                    payload: menus,
                });
            } else {
                message.error(result.message);
            }
        },
        // 注销登陆
        *logout(_, { put , select}) {
            const type = yield select(({account}) => account.type);
            yield put({
                type: 'changeLoginStatus',
                payload: false,
            });
            router.push({
                pathname: '/user/login',
                search: stringify({
                    redirect: window.location.href,
                }),
            })
        },
        // 获取验证码
        *getCaptcha({ payload }, { call }) {
            throw 'TODO: 获取验证码';
            // yield call(getFakeCaptcha, payload);
        },
    },

    reducers: {
        // 保存用户信息
        fillCurrentUser(state, {payload}) {
            return {
                ...state,
                currentUser: payload,
            };
        },
        // 更新菜单列表
        fillMenus(state, {payload}) {
            return {
                ...state,
                menus: payload,
            };
        },
        // 更改登陆状态
        changeLoginStatus(state, { payload }) {
            return {
                ...state,
                status: payload,
            };
        },
    },
    subscriptions: {
        setup({dispatch, history}, done) {
            // 监听路由的变化，请求页面数据
            return history.listen(({pathname, search}) => {
                const query = queryString.parse(search);
                switch (pathname) {
                    case '/account/center':{
                        dispatch({ type: 'account/getCurrentAccount', payload: {} });
                        break;
                    }
                }
            });
        }
    },
};
