import { selectAll, insert, deletes, selectOne, updateOne } from '@/services/resource';
import { ResultCode } from '../utils/Constant';

export default {
    namespace: 'resource',
    state: {
        // 资源
        all: [],
    },

    effects: {
        // 获取所有资源
        *selectAll({ payload, callback }, { call, put }) {
            const { code, message, data } = yield call(selectAll, payload);
            if (code === ResultCode.SUCCESS) {
                yield put({
                    type: 'fillAll',
                    payload: data,
                });
            } else {
                message.error(message);
            }
        },
        // 查询单条
        *selectOne({ payload, callback }, { call, put }) {
            const { code, message, data } = yield call(selectOne, payload);
            if (code === ResultCode.SUCCESS) {
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
            if (code === ResultCode.SUCCESS) {
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
            if (code === ResultCode.SUCCESS) {
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
            if (code === ResultCode.SUCCESS) {
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
        // 填充数据
        fillAll(state, { payload }) {
            return {
                ...state,
                all: payload,
            };
        },
    },
    subscriptions: {},
};
