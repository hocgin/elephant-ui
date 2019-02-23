import {success} from './util/result';
import {allResource, resource} from './resource';

/**
 * 账号相关 API
 */
export default {
    /**
     * 获取当前账号信息
     */
    'GET /api/v1/account': (req, res) => {
        return res.json(
            success({
                account: 'a8524965',
                nickname: 'NICKNAME',
                username: 'USERNAME',
                avatar: '',
                gender: 1,
                nonExpired: true,
                nonLocked: true,
                enabled: true,
            })
        );
    },

    /**
     * 账号登录
     */
    'POST /api/v1/account/login': (req, res) => {
        return res.json(
            success({
                token: 'ACCOUNT_TOKEN',
            })
        );
    },

    /**
     * 获取菜单列表
     */
    'GET /api/v1/account/menus': (req, res) => {
        return res.json(
            success(allResource())
        );
    },

    /**
     * 更新个人信息
     */
    'PUT /api/v1/account/:id': (req, res) => {
        return res.json(success({}));
    },
};
