import {success} from './util/result';

/**
 * API 相关描述
 */
export default {
    /**
     * 获取
     */
    'GET /api/v1/test': (req, res) => {
        return res.json(success({
            sd: 12,
            sdd: 'as'
        }));
    },
    /**
     * 上传文件
     */
    'POST /api/v1/files/upload': (req, res) => {
        return res.json(success('file_upload_id'));
    },
    /**
     * 获取图片地址
     */
    'GET /api/v1/files/image/:id': (req, res) => {
        return res.json(success('file_upload_id'));
    },
};
