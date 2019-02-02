import { success } from './utils/result';

/**
 * 资源相关 API
 */
let i = 0;
let createMenu = (name, type, method, path, enabled, children) => {
    return {
        id: `uuid_${new Date().getTime()}_${i++}`,
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
export default {
    /**
     * 增加节点
     */
    'POST /resource': (req, res) => {
        return res.json(success());
    },
    /**
     * 更新节点
     */
    'PUT /resource/:uuid': (req, res) => {
        return res.json(success());
    },
    /**
     * 删除节点
     */
    'DELETE /resource': (req, res) => {
        return res.json(success());
    },
    /**
     * 查询节点
     */
    'GET /resource/:uuid': (req, res) => {
        return res.json(success(createMenu('角色管理', 0, 'GET', '/access/role', true, [])));
    },
    /**
     * 查询节点
     */
    'GET /resource': (req, res) => {
        return res.json(
            success(
                createMenu('根节点', 0, 'GET', '/', true, [
                    createMenu('访问控制', 0, 'GET', '/access', true, [
                        createMenu('角色管理', 0, 'GET', '/access/role', true, []),
                        createMenu('资源管理', 0, 'GET', '/access/resource', true, []),
                    ]),
                    createMenu('系统配置', 0, 'GET', '/system', true, [
                        createMenu('数据字典', 0, 'GET', '/system/dictionary', true, []),
                    ]),
                ])
            )
        );
    },
};
