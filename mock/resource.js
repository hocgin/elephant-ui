import { success } from './util/result';
import { createdAt, deletedAt, updatedAt } from './util/mock';

let i = 0;
let create = (name, type, method, path, enabled, children) => {
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
        ...createdAt(),
        ...updatedAt(),
        ...deletedAt(),
    };
};
/**
 * 资源相关 API
 */
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
        return res.json(success(create('角色管理', 0, 'GET', '/access/role', true, [])));
    },
    /**
     * 查询节点
     */
    'GET /resource': (req, res) => {
        return res.json(
            success(
                create('根节点', 0, 'GET', '/', true, [
                    create('访问控制', 0, 'GET', '/access', true, [
                        create('角色管理', 0, 'GET', '/access/role', true, []),
                        create('资源管理', 0, 'GET', '/access/resource', true, []),
                    ]),
                    create('系统配置', 0, 'GET', '/system', true, [
                        create('数据字典', 0, 'GET', '/system/dictionary', true, []),
                    ]),
                ])
            )
        );
    },
};
