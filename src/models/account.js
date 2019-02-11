import {getCurrentUserInfo, getMenus, login} from '@/services/account';
import {message} from 'antd';
import * as LangKit from "../utils/LangKit";

export default {
    namespace: 'account',
    state: {
        status: undefined,
        currentUser: {},
        menus: [],
    },

    effects: {
        // 查询当前账号信息
        * getCurrentUserInfo({payload}, {call, put}) {
            const result = yield call(getCurrentUserInfo, payload);
            if (result.code === 200) {
                yield put({
                    type: 'saveCurrentUserInfo',
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
        example2(state, {payload}) {
        },
        // 保存用户信息
        saveCurrentUserInfo(state, {payload}) {
            return {
                ...state,
                currentUser: payload || {},
            };
        },
        // 更新菜单列表
        fillMenus(state, {payload}) {
            return {
                ...state,
                menus: payload || [],
            };
        },
    },
    subscriptions: {},
};
