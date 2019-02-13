import { paging } from '@/services/$example';
import { message as Message } from 'antd';
import { ResultCode } from '../utils/Constant';

export default {
    namespace: 'example',
    state: {
        page: {},
    },

    effects: {
        *$paging({ payload }, { call, put }) {
            const { code, message, data } = yield call(paging, payload);
            if (code === ResultCode.SUCCESS) {
                yield put({
                    type: 'fillPage',
                    payload: data,
                });
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
