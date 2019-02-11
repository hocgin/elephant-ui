import { success } from './util/result';
import { createdAt, deletedAt, updatedAt } from './util/mock';

let i = 0;
export let resource = (name, type, method, path, enabled, children) => {
    return {
        id: `uuid_resource_${i++}`,
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

let _createResource = ({
    name,
    type = 0,
    method = 'GET',
    path,
    enabled = true,
    lft,
    rgt,
    depth,
}) => {
    return {
        id: `uuid_resource_${i++}`,
        name,
        description: '描述',
        type,
        method,
        path,
        icon: 'warning',
        enabled,
        lft,
        rgt,
        depth,
        ...createdAt(),
        ...updatedAt(),
        ...deletedAt(),
    };
};

export let allResource = () => {
    i = 0;
    return [
        _createResource({
            name: '根',
            type: 0,
            method: 'GET',
            path: '/',
            lft: 1,
            rgt: 12,
            depth: 0,
        }),
        _createResource({
            name: '访问控制',
            type: 0,
            method: 'GET',
            path: '/access',
            lft: 2,
            rgt: 7,
            depth: 1,
        }),
        _createResource({
            name: '资源管理',
            type: 0,
            method: 'GET',
            path: '/access/resource',
            lft: 3,
            rgt: 4,
            depth: 2,
        }),
        _createResource({
            name: '角色管理',
            type: 0,
            method: 'GET',
            path: '/access/role',
            lft: 5,
            rgt: 6,
            depth: 2,
        }),
        _createResource({
            name: '系统配置',
            type: 0,
            method: 'GET',
            path: '/system',
            lft: 8,
            rgt: 11,
            depth: 1,
        }),
        _createResource({
            name: '数据字典',
            type: 0,
            method: 'GET',
            path: '/system/dictionary',
            lft: 9,
            rgt: 10,
            depth: 2,
        }),
    ];
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
        return res.json(success(allResource()[0]));
    },
    /**
     * 查询节点
     */
    'GET /resource': (req, res) => {
        return res.json(success(allResource()));
    },
};
