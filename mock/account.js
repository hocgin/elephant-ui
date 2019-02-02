import { success } from './utils/result';

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
        let createMenu = (name, type, method, path, enabled, children) => {
            return {
                id: `uuid_${new Date().getTime()}`,
                name,
                description: '描述',
                type,
                method,
                path,
                icon: 'warning',
                enabled,
                children,
            };
        };

        return res.json(
            success([
                createMenu('访问控制', 0, 'GET', '/access', true, [
                    createMenu('角色管理', 0, 'GET', '/access/role', true, []),
                    createMenu('资源管理', 0, 'GET', '/access/resource', true, []),
                ]),
                createMenu('系统配置', 0, 'GET', '/system', true, [
                    createMenu('数据字典', 0, 'GET', '/system/dictionary', true, []),
                ]),
            ])
        );
    },
};
