import { deletes, paging, fetch, insert } from '@/services/$example';
import { message as Message } from 'antd';
import { ResultCode } from '../utils/Constant';

export default {
    namespace: 'example',
    state: {
        page: {},
        detail: {},
        addValue: {},
    },

    effects: {
        *$paging({ payload, callback }, { call, put }) {
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
        *$fetch({ payload, callback }, { call, put }) {
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
        *$deletes({ payload, callback }, { call, put }) {
            const { code, message, data } = yield call(deletes, payload);
            if (code === ResultCode.SUCCESS) {
                if (callback) {
                    callback();
                }
            } else {
                Message.error(message);
            }
        },
        *$insert({ payload, callback }, { call, put }) {
            const { code, message, data } = yield call(insert, payload);
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
    subscriptions: {},
};
