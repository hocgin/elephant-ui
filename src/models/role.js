import { insertOne, page, selectOne, updateOne } from '@/services/role';
import { message } from 'antd';
import { ResultCode } from '../utils/Constant';

export default {
    namespace: 'role',
    state: {
        page: {
            records: [],
            total: 0,
            size: 0,
            current: 1,
            pages: 1,
            searchCount: true,
        },
        detail: null,
    },
    effects: {
        // 分页查询
        *paging({ payload }, { call, put }) {
            let result = yield call(page, payload);
            if (result.code === ResultCode.SUCCESS) {
                yield put({
                    type: 'fillPage',
                    payload: result.data,
                });
            } else {
                message.error(result.message);
            }
        },
        // 创建角色
        *insertOne({ payload, callback }, { call, put }) {
            let result = yield call(insertOne, payload);
            if (result.code === ResultCode.SUCCESS) {
                yield put({
                    type: 'page',
                });
                if (callback) {
                    callback();
                }
            } else {
                message.error(result.message);
            }
        },
        // 查询单个
        *detail({ payload, callback }, { call, put }) {
            let result = yield call(selectOne, payload);
            if (result.code === ResultCode.SUCCESS) {
                yield put({
                    type: 'fillDetail',
                    payload: result.data,
                });
            } else {
                message.error(result.message);
            }
        },
        // 更新单个
        *updateOne({ payload, callback }, { call, put }) {
            let result = yield call(updateOne, payload);
            if (result.code === ResultCode.SUCCESS) {
                yield put({
                    type: 'page',
                });
                if (callback) {
                    callback();
                }
            } else {
                message.error(result.message);
            }
        },
    },
    reducers: {
        // 更新分页
        fillPage(state, { payload }) {
            return {
                ...state,
                page: payload,
            };
        },
        // 更新单个
        fillDetail(state, { payload }) {
            return {
                ...state,
                detail: payload,
            };
        },
    },
    subscriptions: {},
};
