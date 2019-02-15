import { deletes, paging } from '@/services/$example';
import { message as Message } from 'antd';
import { ResultCode } from '../utils/Constant';

export default {
    namespace: 'example',
    state: {
        page: {},
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
    },

    reducers: {
        fillPage(state, { payload }) {
            return {
                ...state,
                page: payload,
            };
        },
    },
    subscriptions: {},
};
