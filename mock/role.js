import { success } from './utils/result';

/**
 * 角色相关 API
 */
export default {
    'POST /roles': (req, res) => {
        return res.json(success());
    },
    'GET /roles': (req, res) => {
        return res.json(success([{}]));
    },
};
