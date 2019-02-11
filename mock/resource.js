import { success } from './util/result';
import { createdAt, deletedAt, updatedAt } from './util/mock';

// 填充 lft rgt depth
let fillLftRgtAndDepth = (nodes, lft, depth) => {
    (nodes || []).forEach(node => {
        node.lft = lft + 1;
        node.rgt = node.lft + treeToArray(node.children).length * 2 + 1;
        node.depth = depth;
        fillLftRgtAndDepth(node.children, node.lft, depth + 1);
    });
};

// 树型 => 数组型
let treeToArray = nodes => {
    let arr = [];
    (nodes || []).forEach(node => {
        if (node.children && node.children.length > 0) {
            arr = [...arr, ...treeToArray(node.children)];
        }
        arr = [node, ...arr];
    });
    return arr;
};

let i = 0;
// 构建单个节点
let resource = (name, type, method, path, enabled, children) => {
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

// 构建
export let allResource = () => {
    i = 0;
    const tree = resource('根节点', 0, 'GET', '', true, [
        resource('仪表盘', 0, 'GET', '/dashboard', true, [
            resource('分析页', 0, 'GET', '/dashboard/analysis', true, []),
            resource('监控页', 0, 'GET', '/dashboard/monitor', true, []),
            resource('工作台', 0, 'GET', '/dashboard/workplace', true, []),
        ]),
        resource('访问控制', 0, 'GET', '/access', true, [
            resource('角色管理', 0, 'GET', '/access/role', true, []),
            resource('资源管理', 0, 'GET', '/access/resource', true, []),
        ]),
        resource('系统配置', 0, 'GET', '/system', true, [
            resource('数据字典', 0, 'GET', '/system/dictionary', true, []),
        ]),
    ]);
    const nodes = [tree];
    fillLftRgtAndDepth(nodes, 0, 0);
    return treeToArray(nodes);
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
