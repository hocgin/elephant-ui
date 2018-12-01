export default {
    // model 的唯一标识
    namespace: 'test',
    //  model 管理的数据
    state: {},
    effects: { // 异步操作(不可以修改 state)
        * query({type, payload}, {call, put}) {
            console.log('query');
            // 同步调用, 等同于 fn(payload)
            let data = yield call(fn, payload);
            // 等同于 dispatch
            yield put({
                type: 'test/save',
                payload: data
            });
        }
    },
    // 同步操作(可以修改 state)
    reducers: {
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