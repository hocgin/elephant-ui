import {getCurrentAccount, getMenus, login} from '@/services/account';
import {message} from 'antd';
import * as LangKit from "../utils/LangKit";
import queryString from "query-string";

export default {
    namespace: 'account',
    state: {
        status: null,
        currentUser: {},
        menus: [],
    },

    effects: {
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
