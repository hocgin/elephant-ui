import { paging } from '@/services/.example';
import { message as Message } from 'antd';
import { ResultCode } from '../utils/Constant';

export default {
    namespace: 'example',
    state: {
        list: [],
    },

    effects: {
        *$paging({ payload }, { call, put }) {
            const { code, message, data } = yield call(paging, payload);
            if (code === ResultCode.SUCCESS) {
                yield put({
                    type: 'fillList',
                    payload: Array.isArray(data) ? data : [],
                });
            } else {
                Message.error(message);
            }
        },
    },

    reducers: {
        fillList(state, { payload }) {
            return {
                ...state,
                list: payload,
            };
        },
    },
    subscriptions: {},
};
