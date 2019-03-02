import { message as Message } from 'antd';
import { deletes, detail, insert, paging, update } from '@/services/accessLog';
import { ResultCode } from '../utils/Constant';
import queryString from 'query-string';

export default {
    namespace: 'accessLog',
    state: {
        page: {},
        all: [],
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
            const { code, message, data } = yield call(detail, payload);
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
    },
    subscriptions: {
        setup({ dispatch, history }, done) {
            // 监听路由的变化，请求页面数据
            return history.listen(({ pathname, search }) => {
                const query = queryString.parse(search);
                switch (pathname) {
                    // 员工管理
                    case '/log/access-log': {
                        dispatch({
                            type: 'accessLog/paging',
                            payload: {
                                sort: { createdAt: 'DESC' },
                            },
                        });
                        break;
                    }
                    case '/log/access-log/detail': {
                        const { id } = query;
                        dispatch({ type: 'accessLog/fetch', payload: { id } });
                        break;
                    }
                }
            });
        },
    },
};
