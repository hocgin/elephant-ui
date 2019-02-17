import router from 'umi/router';

const goto = ({ payload, pathname, isPush }) => {
    const args = {
        pathname,
        query: {
            ...payload,
        },
    };
    if (isPush) {
        router.push(args);
    } else {
        router.replace(args);
    }
};

export default {
    namespace: 'router',
    state: {},
    effects: {
        *gotoExampleEdit(
            {
                payload: { id },
                isPush = true,
            },
            { call, put }
        ) {
            goto({
                pathname: '/example/$template/form/edit',
                payload: { id },
                isPush,
            });
        },
        *gotoExampleDetail(
            {
                payload: { id },
                isPush = true,
            },
            { call, put }
        ) {
            goto({
                pathname: '/example/$template/form/detail',
                payload: { id },
                isPush,
            });
        },
        *gotoExampleAdd({ payload = {}, isPush = true }, { call, put }) {
            goto({
                pathname: '/example/$template/form/add',
                payload,
                isPush,
            });
        },
        *gotoExampleAdd_Other({ payload = {}, isPush = true }, { call, put }) {
            goto({
                pathname: '/example/$template/form/add/other',
                payload,
                isPush,
            });
        },
        *gotoExampleAdd_Done({ payload = {}, isPush = true }, { call, put }) {
            goto({
                pathname: '/example/$template/form/add/done',
                payload,
                isPush,
            });
        },
        // 员工管理
        *gotoStaffEdit(
            {
                payload: { id },
                isPush = true,
            },
            { call, put }
        ) {
            goto({
                pathname: '/account/staff/edit',
                payload: { id },
                isPush,
            });
        },
        *gotoStaffDetail(
            {
                payload: { id },
                isPush = true,
            },
            { call, put }
        ) {
            goto({
                pathname: '/account/staff/detail',
                payload: { id },
                isPush,
            });
        },
        *gotoStaffAdd({ payload = {}, isPush = true }, { call, put }) {
            goto({
                pathname: '/account/staff/add',
                payload,
                isPush,
            });
        },
    },
    reducers: {},
    subscriptions: {},
};
