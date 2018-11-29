export default {
    namespace: 'test', // model 的唯一标识
    state: [], //  model 管理的数据
    effects: { // 异步操作(不可以修改 state)
        async query({type, payload}, {call, put}) {
            console.log('query');
            let data = await call(fn, param1, param2); // 同步调用, 等同于 fn(param1, param2)
            await put({ // 等同于 dispatch
                type: 'test/save',
                payload: data
            });
        }
    },
    reducers: {// 同步操作(可以修改 state)
        save(state, {payload}) {
            console.log('save');
            return 'ok';
        }
    }
};

/**
 *@connect((state)=>{
 *     const data = state[namespace];
 *     return {data};
 *});
 *
 * dispatch({
 *     type: '/test/save', // url,用来触发`effects`或`reducers`
 *     payload: param // 参数
 * })
 *
 **/