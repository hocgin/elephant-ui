import { success } from './util/result';
import { resource } from './resource';

/**
 * 账号相关 API
 */
export default {
    /**
     * 获取当前账号信息
     */
    'GET /account': (req, res) => {
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
    'POST /account/login': (req, res) => {
        return res.json(
            success({
                token: 'ACCOUNT_TOKEN',
            })
        );
    },

    /**
     * 获取菜单列表
     */
    'GET /account/menus': (req, res) => {
        return res.json(
            success(
                resource('根节点', 0, 'GET', '/', true, [
                    resource('访问控制', 0, 'GET', '/access', true, [
                        resource('角色管理', 0, 'GET', '/access/role', true, []),
                        resource('资源管理', 0, 'GET', '/access/resource', true, []),
                    ]),
                    resource('系统配置', 0, 'GET', '/system', true, [
                        resource('数据字典', 0, 'GET', '/system/dictionary', true, []),
                    ]),
                ]).children
            )
        );
    },
};
