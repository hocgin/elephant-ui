import { pageWrapper, success } from './util/result';
import { createdAt, deletedAt, updatedAt } from './util/mock';
import { allRole } from './role';

let i = 0,
    create = object =>
        Object.assign(
            {
                id: `id_staff_${i++}`,
                account: 'account_uuid',
                nickname: 'staff_nickname',
                username: 'staff_username',
                avatar: 'http://iph.href.lu/55x55',
                roles: allRole(),
                gender: 0,
                nonExpired: true,
                nonLocked: true,
                enabled: true,
                type: 4,
                ...createdAt(),
                ...updatedAt(),
                ...deletedAt(),
            },
            object
        ),
    all = () => [
        create({
            nickname: 'staff_name_1',
        }),
        create({
            nickname: 'staff_name_2',
        }),
        create({
            nickname: 'staff_name_3',
        }),
    ];

/**
 * API 相关描述
 */
export default {
    /**
     * 增加
     */
    'POST /api/v1/staff': (req, res) => {
        return res.json(success());
    },
    /**
     * 删除
     */
    'DELETE /api/v1/staff': (req, res) => {
        return res.json(success());
    },
    /**
     * 分页获取
     */
    'GET /api/v1/staff': (req, res) => {
        return res.json(
            success(
                pageWrapper({
                    records: [],
                })
            )
        );
    },
    /**
     * 分页获取
     */
    'POST /api/v1/staff/_paging': (req, res) => {
        return res.json(
            success(
                pageWrapper({
                    records: [...all()],
                })
            )
        );
    },
    /**
     * 获取单个
     */
    'GET /api/v1/staff/:uuid': (req, res) => {
        return res.json(success(all()[0]));
    },
    /**
     * 更新单个
     */
    'PUT /api/v1/staff/:uuid': (req, res) => {
        return res.json(success());
    },
};
