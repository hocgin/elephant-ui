import {} from 'antd';
import {query, insert} from '@/services/resource';
import {message} from 'antd';

export default {
    namespace: 'resource',
    state: {
        // 资源(树结构)
        result: [],
    },

    effects: {
        // 获取所有资源(树结构)
        * query({payload}, {call, put}) {
            const {code, message, data} = yield call(query, payload);
            if (code === 200) {
                yield put({
                    type: 'updateResources',
                    payload: data,
                });
            } else {
                message.error(message);
            }
        },
        // 新增资源
        * save({payload}, {call, put}) {
            const {code, message, data} = yield call(insert, payload);
            if (code === 200) {
                // 发送刷新请求
                yield put({
                    type: 'query',
                });
                message.success('新增成功');
            } else {
                message.error(message);
            }
        },
    },

    reducers: {
        // 更新数据
        updateResources(state, {payload}) {
            return {
                ...state,
                result: [payload],
            };
        },
    },
    subscriptions: {},
};
