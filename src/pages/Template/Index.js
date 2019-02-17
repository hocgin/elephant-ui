import React from 'react';
import { connect } from 'dva';
import { Form } from 'antd';

@connect(
    ({ loading }) => ({}),
    dispatch => ({})
)
@Form.create()
export default class Index extends React.Component {
    render() {
        return <div />;
    }
}
