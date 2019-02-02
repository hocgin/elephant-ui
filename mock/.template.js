import { success } from './utils/result';

/**
 * API 相关描述
 */
export default {
    /**
     * 增加
     */
    'POST /example': (req, res) => {
        return res.json(success());
    },
    /**
     * 删除
     */
    'DELETE /example': (req, res) => {
        return res.json(success());
    },
    /**
     * 更新
     */
    'PUT /example/:uuid': (req, res) => {
        return res.json(success());
    },
    /**
     * 获取
     */
    'GET /example': (req, res) => {
        return res.json(success([{}]));
    },
};
