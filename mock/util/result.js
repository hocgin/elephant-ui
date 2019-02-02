/**
 * 模拟返回结构
 */
export default function result(code, message, data) {
    return {
        code,
        message,
        data,
    };
}

export function success(data = null) {
    return result(200, 'ok', data);
}

/**
 * 分页结构
 * - total 总数
 * - size 每页显示条数
 * - current 当前页 [1, +)
 * - searchCount 是否进行 count 查询
 * - pages 总页数
 * - records 数据
 * @returns {{}}
 */
export function pageWrapper({ records = [], current = 1, pages = 1, total = 10, size = 10 }) {
    return {
        records,
        total,
        size,
        current,
        pages,
        searchCount: true,
    };
}

export function error(message = 'error', data = null) {
    return result(500, message, data);
}
