import { login } from '@/services/account';

export default {
  namespace: 'account',
  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const result = yield call(login, payload);
    },
  },

  reducers: {
    example2(state, { payload }) {},
  },
  subscriptions: {},
};
