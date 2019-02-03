/**********************************
 *          [基础工具]
 ********************************/

/**
 * MyBatis Plus 分页格式 ==> Ant Pro 分页格式
 *
 * @param mybatisPlusPage
 * @returns {{list: Array, pagination: {total: *, pageSize: *, current: *}}}
 */
export function toAntProPage(mybatisPlusPage) {
    return {
        list: mybatisPlusPage.records,
        pagination: {
            total: mybatisPlusPage.total,
            pageSize: mybatisPlusPage.size,
            current: mybatisPlusPage.current,
        },
    };
}
