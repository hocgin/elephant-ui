import React from 'react';
import { connect } from 'dva';
import { Form } from 'antd';

@connect(
    ({ loading }) => ({
        example: 'ok',
    }),
    dispatch => ({
        $example: () => dispatch({ type: 'example' }),
    })
)
@Form.create()
export default class Index extends React.Component {
    render() {
        console.log(this.props);
        return (
            <div>
                <SearchBar onClick={this.onClickSearch} />
            </div>
        );
    }

    onClickSearch = () => {
        console.log('搜索');
    };

    SearchBar = ({ onClickSearch }) => {
        return <div onClick={onClickSearch}>SearchBar</div>;
    };
}
