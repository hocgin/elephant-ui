import { routerRedux } from 'dva/router';
import { login } from '@/services/account';
import { stringify } from 'qs';
import { fakeAccountLogin, getFakeCaptcha } from '@/services/api';
import { getPageQuery } from '@/utils/utils';
import { LOCAL_STORAGE_TOKEN } from '../utils/custom';
import router from 'umi/router';
import { message } from 'antd';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    // 登陆
    *login({ payload }, { call, put }) {
      const result = yield call(login, payload);
      console.log('[登陆]', result);
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
        yield put(router.replace(redirect || '/system/dictionary'));
      } else {
        message.error(result.message);
      }
    },

    *getCaptcha({ payload }, { call }) {
      console.log('TODO: 获取验证码');
      // yield call(getFakeCaptcha, payload);
    },

    *logout(_, { put }) {
      // yield put({
      //     type: 'changeLoginStatus',
      //     payload: {
      //         status: false,
      //     },
      // });
      yield put(
        router.push({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        })
      );
    },
  },

  reducers: {},
};
