import { page } from '@/services/api';
import { message } from 'antd';
import { ResultCode } from '../../../../utils/Constant';

export default {
    namespace: 'role',
    state: {
        records: [],
        total: 0,
        size: 0,
        current: 1,
        pages: 1,
        searchCount: true,
    },
    effects: {
        /**
         * 分页查询
         */ *page({ payload }, { call, put }) {
            console.log(result);
            let { code, message: msg, data } = yield call(page, payload);
            if (code === ResultCode.SUCCESS) {
                yield put({
                    type: 'updateRole',
                    payload: data,
                });
            } else {
                message.error(msg);
            }
        },
    },
    reducers: {
        updateRole(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    },
    subscriptions: {},
};
