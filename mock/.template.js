import {success} from "./utils/result";

/**
 * API 相关描述
 */
export default {

    'POST /module/operating': (req, res) => {
        return res.json(success());
    }
}