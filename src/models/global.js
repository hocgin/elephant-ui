import {queryNotices, queryResource} from '@/services/api';

export default {
    namespace: 'global',

    state: {
        collapsed: false,
        notices: [],
        resources: [],
    },

    effects: {
        * fetchResource({payload}, {call, put}) {
            let data = yield call(queryResource, payload);
            yield put({
                type: 'changeResource',
                payload: data.result,
            });
            console.log('fetchResource', data)
        },
        * fetchNotices(_, {call, put}) {
            const data = yield call(queryNotices);
            yield put({
                type: 'saveNotices',
                payload: data,
            });
            yield put({
                type: 'user/changeNotifyCount',
                payload: data.length,
            });
        },
        * clearNotices({payload}, {put, select}) {
            yield put({
                type: 'saveClearedNotices',
                payload,
            });
            const count = yield select(state => state.global.notices.length);
            yield put({
                type: 'user/changeNotifyCount',
                payload: count,
            });
        },
    },

    reducers: {
        /**
         * 更改菜单资源
         */
        changeResource(state, {payload}) {
            console.log('reducers');
            return {
                ...state,
                resources: payload,
            };
        },
        changeLayoutCollapsed(state, {payload}) {
            return {
                ...state,
                collapsed: payload,
            };
        },
        saveNotices(state, {payload}) {
            return {
                ...state,
                notices: payload,
            };
        },
        saveClearedNotices(state, {payload}) {
            return {
                ...state,
                notices: state.notices.filter(item => item.type !== payload),
            };
        },
    },

    subscriptions: {
        setup({history}) {
            // Subscribe history(url) change, trigger `load` action if pathname is `/`
            return history.listen(({pathname, search}) => {
                if (typeof window.ga !== 'undefined') {
                    window.ga('send', 'pageview', pathname + search);
                }
            });
        },
    },
};
