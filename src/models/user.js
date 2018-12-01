import {
    query as queryUsers,
    queryCurrent,
    queryUserMenu
} from '@/services/user';

export default {
    namespace: 'user',

    state: {
        list: [],
        currentUser: {},
        menuData: [],
    },

    effects: {
        * queryUserMenu({payload}, {call, put}) {
            let data = yield call(queryUserMenu, payload);
            yield put({
                type: 'changeUserMenu',
                payload: data.result,
            });
        },
        * fetch(_, {call, put}) {
            const response = yield call(queryUsers);
            yield put({
                type: 'save',
                payload: response,
            });
        },
        * fetchCurrent(_, {call, put}) {
            const response = yield call(queryCurrent);
            yield put({
                type: 'saveCurrentUser',
                payload: response,
            });
        },
    },

    reducers: {
        /**
         * 更改菜单资源
         */
        changeUserMenu(state, {payload}) {
            return {
                ...state,
                menuData: payload,
            };
        },
        save(state, action) {
            return {
                ...state,
                list: action.payload,
            };
        },
        saveCurrentUser(state, action) {
            return {
                ...state,
                currentUser: action.payload || {},
            };
        },
        changeNotifyCount(state, action) {
            return {
                ...state,
                currentUser: {
                    ...state.currentUser,
                    notifyCount: action.payload,
                },
            };
        },
    },
};
