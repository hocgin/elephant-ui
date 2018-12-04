import {
    query
} from '@/services/dictionary';

export default {
    namespace: 'dictionary',

    state: {
        data: {
            list: [],
            pagination: {}
        },
    },

    effects: {
        *query({payload}, {call, put}) {
            let result = yield call(query, payload);
            console.log('result', result);
            yield put({
                type: 'update',
                payload: result.data,
            });
        },
        * fetch(_, {call, put}) {
        },
    },

    reducers: {
        /**
         * 更新
         */
        update(state, {payload}) {
            console.log("update");
            return {
                ...state,
                data: payload,
            };
        },
    },
};