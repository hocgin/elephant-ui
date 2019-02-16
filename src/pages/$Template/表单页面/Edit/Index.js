import React from 'react';
import {connect} from 'dva';
import {Form, Modal} from 'antd';

@connect(
    ({example, loading}) => ({
    }),
    dispatch => ({
    })
)
@Form.create()
export default class Index extends React.Component {
    state = {};

    render() {
        return (<div>edit</div>);
    }
}
