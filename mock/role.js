import { pageWrapper, success } from './util/result';
import { createdAt, deletedAt, updatedAt } from './util/mock';
import { allResource } from './resource';

let i = 0;
let role = (name, mark) => {
    return {
        id: `uuid_role_${i++}`,
        name,
        mark,
        enabled: true,
        description: '描述',
        resources: allResource(),
        ...createdAt(),
        ...updatedAt(),
        ...deletedAt(),
    };
};

export let allRole = () => {
    i = 0;
    return [role('管理员', 'ROLE_ADMIN'), role('超级管理员', 'ROLE_SUPPER_ADMIN')];
};

/**
 * 角色相关 API
 */
export default {
    /**
     * 增加
     */
    'POST /api/v1/roles': (req, res) => {
        return res.json(success());
    },
    /**
     * 删除
     */
    'DELETE /api/v1/roles': (req, res) => {
        return res.json(success());
    },
    /**
     * 更新
     */
    'PUT /api/v1/roles/:uuid': (req, res) => {
        return res.json(success());
    },
    /**
     * 获取所有
     */
    'GET /api/v1/roles': (req, res) => {
        return res.json(success(allRole()));
    },
    /**
     * 分页获取
     */
    'POST /api/v1/roles/_paging': (req, res) => {
        return res.json(
            success(
                pageWrapper({
                    records: allRole(),
                })
            )
        );
    },
    /**
     * 获取单个
     */
    'GET /api/v1/roles/:uuid': (req, res) => {
        return res.json(success(allRole()[0]));
    },
};
