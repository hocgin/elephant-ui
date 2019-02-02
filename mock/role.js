import { pageWrapper, success } from './util/result';
import { createdAt, updatedAt, deletedAt } from './util/mock';

let i = 0;
let create = (name, mark) => {
    return {
        id: `uuid_${new Date().getTime()}_${i++}`,
        name,
        mark,
        description: '描述',
        ...createdAt(),
        ...updatedAt(),
        ...deletedAt(),
    };
};
/**
 * 角色相关 API
 */
export default {
    /**
     * 增加
     */
    'POST /roles': (req, res) => {
        return res.json(success());
    },
    /**
     * 删除
     */
    'DELETE /roles': (req, res) => {
        return res.json(success());
    },
    /**
     * 更新
     */
    'PUT /roles/:uuid': (req, res) => {
        return res.json(success());
    },
    /**
     * 获取
     */
    'GET /roles': (req, res) => {
        return res.json(
            success(
                pageWrapper({
                    records: [create('管理员', 'ROLE_ADMIN')],
                })
            )
        );
    },
};
