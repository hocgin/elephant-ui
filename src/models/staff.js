import queryString from 'query-string';
import { deletes, fetch, insert, paging, update } from '@/services/staff';
import { message as Message } from 'antd';
import { ResultCode } from '../utils/Constant';

export default {
    namespace: 'staff',
    state: {
        page: {},
        detail: {},
    },

    effects: {
        *paging({ payload, callback }, { call, put }) {
            const { code, message, data } = yield call(paging, payload);
            if (code === ResultCode.SUCCESS) {
                yield put({
                    type: 'fillPage',
                    payload: data,
                });
                if (callback) {
                    callback();
                }
            } else {
                Message.error(message);
            }
        },
        *fetch({ payload, callback }, { call, put }) {
            const { code, message, data } = yield call(fetch, payload);
            if (code === ResultCode.SUCCESS) {
                yield put({
                    type: 'fillDetail',
                    payload: data,
                });
                if (callback) {
                    callback();
                }
            } else {
                Message.error(message);
            }
        },
        *deletes({ payload, callback }, { call, put }) {
            const { code, message, data } = yield call(deletes, payload);
            if (code === ResultCode.SUCCESS) {
                if (callback) {
                    callback();
                }
            } else {
                Message.error(message);
            }
        },
        *insert({ payload, callback }, { call, put }) {
            const { code, message, data } = yield call(insert, payload);
            if (code === ResultCode.SUCCESS) {
                if (callback) {
                    callback();
                }
            } else {
                Message.error(message);
            }
        },
        *update({ payload, callback }, { call, put }) {
            const { code, message, data } = yield call(update, payload);
            if (code === ResultCode.SUCCESS) {
                if (callback) {
                    callback();
                }
            } else {
                Message.error(message);
            }
        },
    },

    reducers: {
        fillPage(state, { payload }) {
            return {
                ...state,
                page: payload,
            };
        },
        fillDetail(state, { payload }) {
            return {
                ...state,
                detail: payload,
            };
        },
        fillAddValue(state, { payload }) {
            return {
                ...state,
                addValue: payload,
            };
        },
    },
    subscriptions: {
        setup({ dispatch, history }, done) {
            // 监听路由的变化，请求页面数据
            return history.listen(({ pathname, search }) => {
                const query = queryString.parse(search);
                console.log('pathname', pathname);
                switch (pathname) {
                    // 员工管理
                    case '/account/staff': {
                        dispatch({ type: 'staff/paging', payload: {} });
                        dispatch({ type: 'role/findAll', payload: {} });
                        break;
                    }
                    case '/account/staff/detail': {
                        const { id } = query;
                        dispatch({ type: 'staff/fetch', payload: { id } });
                        break;
                    }
                    case '/account/staff/add': {
                        break;
                    }
                    case '/account/staff/edit': {
                        const { id } = query;
                        dispatch({ type: 'staff/fetch', payload: { id } });
                        break;
                    }
                }
            });
        },
    },
};
