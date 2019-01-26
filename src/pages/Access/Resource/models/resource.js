import {} from 'antd';
import { selectBy, insert, deletes, selectOne, updateOne } from '@/services/resource';
import { message } from 'antd';

export default {
    namespace: 'resource',
    state: {
        // 资源(树结构)
        result: [],
    },

    effects: {
        // 获取所有资源(树结构)
        *query({ payload, callback }, { call, put }) {
            const { code, message, data } = yield call(selectBy, payload);
            if (code === 200) {
                yield put({
                    type: 'updateResources',
                    payload: data,
                });
            } else {
                message.error(message);
            }
        },
        // 查询单条
        *selectOne({ payload, callback }, { call, put }) {
            const { code, message, data } = yield call(selectOne, payload);
            if (code === 200) {
                if (callback) {
                    callback(data);
                }
            } else {
                message.error(message);
            }
        },
        // 新增资源
        *save({ payload, callback }, { call, put }) {
            const { code, message, data } = yield call(insert, payload);
            if (code === 200) {
                // 发送刷新请求
                yield put({
                    type: 'query',
                });
                if (callback) {
                    callback();
                }
            } else {
                message.error(message);
            }
        },
        // 批量删除
        *deletes({ payload, callback }, { call, put }) {
            const { code, message, data } = yield call(deletes, payload);
            if (code === 200) {
                // 发送刷新请求
                yield put({
                    type: 'query',
                });
                if (callback) {
                    callback();
                }
            } else {
                message.error(message);
            }
        },
        // 更新
        *updateOne({ payload, callback }, { call, put }) {
            const { code, message, data } = yield call(updateOne, payload);
            if (code === 200) {
                // 发送刷新请求
                yield put({
                    type: 'query',
                });
                if (callback) {
                    callback();
                }
            } else {
                message.error(message);
            }
        },
    },

    reducers: {
        // 更新数据
        updateResources(state, { payload }) {
            return {
                ...state,
                result: [payload],
            };
        },
    },
    subscriptions: {},
};
