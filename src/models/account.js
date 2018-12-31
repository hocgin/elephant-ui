import { login, getCurrentUserInfo, getMenus } from '@/services/account';
import { message } from 'antd';
import * as routerRedux from 'react-router-redux';
import { getPageQuery } from '../utils/utils';
import { LOCAL_STORAGE_TOKEN } from '../utils/custom';

export default {
  namespace: 'account',
  state: {
    status: undefined,
    currentUser: {},
    menus: [],
  },

  effects: {
    // 登陆
    *login({ payload }, { call, put }) {
      const result = yield call(login, payload);
      if (result.code === 200) {
        const { token } = result.data;
        // 存储token
        localStorage.setItem(LOCAL_STORAGE_TOKEN, token);
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        // 如果含有跳转URL则进行跳转。例如,?redirect=[url]
        if (redirect) {
          const redirectUrlParams = new URL(redirect);
          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);
            if (redirect.startsWith('/#')) {
              redirect = redirect.substr(2);
            }
          } else {
            window.location.href = redirect;
            return;
          }
        }
        yield put(routerRedux.replace(redirect || '/'));
      } else {
        message.error(result.message);
      }
    },
    // 查询当前账号信息
    *getCurrentUserInfo({ payload }, { call, put }) {
      const result = yield call(getCurrentUserInfo, payload);
      if (result.code === 200) {
        yield put({
          type: 'saveCurrentUserInfo',
          payload: result.data,
        });
      } else {
        message.error(result.message);
      }
    },
    // 获取当前账号具备的菜单
    *getMenus({ payload }, { call, put }) {
      const result = yield call(getMenus, payload);
      if (result.code === 200) {
        yield put({
          type: 'updateMenus',
          payload: result.data,
        });
      } else {
        message.error(result.message);
      }
    },
  },

  reducers: {
    example2(state, { payload }) {},
    // 保存用户信息
    saveCurrentUserInfo(state, { payload }) {
      return {
        ...state,
        currentUser: payload || {},
      };
    },
    // 更新菜单列表
    updateMenus(state, { payload }) {
      return {
        ...state,
        menus: payload || [],
      };
    },
  },
  subscriptions: {},
};
