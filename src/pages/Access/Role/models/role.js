import { page } from '@/services/role';
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
            let result = yield call(page, payload);
            console.log(result);
            if (result.code === ResultCode.SUCCESS) {
                yield put({
                    type: 'updateRole',
                    payload: result.data,
                });
            } else {
                message.error(result.message);
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
