import {
    query,
    remove,
    fetch,
} from '@/services/dictionary';
import {message} from "antd";

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
            const result = yield call(query, payload);
            console.log('result', result);
            yield put({
                type: 'update',
                payload: result.data,
            });
        },
        *remove({payload, callback}, {call, put}) {
            const result = yield call(remove, payload);
            if (result.code !== 200) {
                message.error(result.message);
                return;
            }
            if (callback) {
                callback();
            }
        },
        *fetch({payload, callback}, {call, put}) {
            const result = yield call(fetch, payload);
            console.log(result);
            if (result.code !== 200) {
                message.error(result.message);
                return;
            }
            if (callback) {
                callback(result.data);
            }
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