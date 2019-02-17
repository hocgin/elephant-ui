import { pageWrapper, success } from './util/result';
import { createdAt, deletedAt, updatedAt } from './util/mock';

let i = 0,
    create = object =>
        Object.assign(
            {
                id: `id_example_${i++}`,
                name: 'example_name',
                type: 4,
                ...createdAt(),
                ...updatedAt(),
                ...deletedAt(),
            },
            object
        ),
    all = () => [
        create({
            name: 'example_name_1',
        }),
        create({
            name: 'example_name_2',
        }),
        create({
            name: 'example_name_3',
        }),
    ];

/**
 * API 相关描述
 */
export default {
    /**
     * 增加
     */
    'POST /staff': (req, res) => {
        return res.json(success());
    },
    /**
     * 删除
     */
    'DELETE /staff': (req, res) => {
        return res.json(success());
    },
    /**
     * 分页获取
     */
    'GET /staff': (req, res) => {
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
    'POST /staff/_paging': (req, res) => {
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
    'GET /staff/:uuid': (req, res) => {
        return res.json(success(all()[0]));
    },
    /**
     * 更新单个
     */
    'PUT /staff/:uuid': (req, res) => {
        return res.json(success());
    },
};
