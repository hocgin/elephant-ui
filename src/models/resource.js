import {} from 'antd';
import { query } from '@/services/resource';
import { message } from 'antd';

export default {
  namespace: 'resource',
  state: {
    // 资源(树结构)
    result: [],
  },

  effects: {
    // 获取所有资源(树结构)
    *query({ payload }, { call, put }) {
      const { code, message, data } = yield call(query, payload);
      if (code === 200) {
        yield put({
          type: 'updateResources',
          payload: data,
        });
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
