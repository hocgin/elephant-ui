import router from "umi/router";

const goto = ({payload, pathname, isPush}) => {
    const args = {
        pathname,
        query: {
            ...payload
        }
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
        * gotoExampleEdit({payload: {id}, isPush = true}, {call, put}) {
            goto({
                pathname: '/example/$Template/表单页面/edit',
                payload: {id},
                isPush
            });
        },
        * gotoExampleDetail({payload: {id}, isPush = true}, {call, put}) {
            goto({
                pathname: '/example/$Template/表单页面/detail',
                payload: {id},
                isPush
            });
        },
        * gotoExampleAdd({payload = {}, isPush = true}, {call, put}) {
            goto({
                pathname: '/example/$Template/表单页面/add',
                payload,
                isPush
            });
        },
    },

    reducers: {
        example2(state, {payload}) {
        },
    },
    subscriptions: {}
};