import {
    queryRole
} from '@/services/api';

export default {
    namespace: 'role',
    state: {
        data: {
            list: [],
            pagination: {}
        }
    },
    effects: {
        *query({type, payload}, {call, put}) {
            let data = yield call(queryRole, payload);
            yield put({
                type: 'updateRole',
                payload: data.result
            });
        }
    },
    reducers: {
        updateRole(state, {payload}) {
            return {
                ...state,
                data: payload,
            };
        }
    }
};