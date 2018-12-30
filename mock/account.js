import { success } from './utils/result';

/**
 * 账号相关
 */
export default {
  'POST /account/login': (req, res) => {
    return res.json(success());
  },
};
