import React, {PureComponent, Fragment} from 'react';
import {connect} from 'dva';
import moment from 'moment';
import {
} from 'antd';

import styles from './Index.less';

import Sup from "@/utils/supplement";

const Expand = {
    // 取数据
    mapStateToProps(states) {
        return {};
    },
    // 发起请求
    mapDispatchToProps(dispatch) {
        return {
            $example() {
            },
        };
    }
};

let xxStatus = ['开启', '关闭'];

/* eslint react/no-multi-comp:0 */
@connect(Expand.mapStateToProps, Expand.mapDispatchToProps)
@Form.create()
export default class Index extends PureComponent {
    state = {};

    // 字段
    columns = [
        {
            title: '属性值',
            dataIndex: 'label',
        }, {
            title: '描述',
            dataIndex: 'description',
        }, {
            title: '创建时间',
            dataIndex: 'createdAt',
            sorter: true,
            render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
        }, {
            title: '操作',
            key: 'operation',
            fixed: 'right',
            width: 200,
            render: (text, record) => {
                const menu = (
                    <Menu>
                        <Menu.Item key="remove" onClick={() => this.onClickDeleteButton(record)}>删除</Menu.Item>
                        <Menu.Item key="edit" onClick={() => this.onClickEditButton(true, record)}>修改</Menu.Item>
                        <Menu.Item key="on">启用</Menu.Item>
                        <Menu.Item key="off">禁用</Menu.Item>
                    </Menu>
                );
                return (
                    <Fragment>
                        <a onClick={() => this.onClickDetailButton(true, record)}>查看详情</a>
                        <Divider type="vertical"/>
                        <Dropdown overlay={menu}>
                            <a className="ant-dropdown-link" href="#">
                                更多操作 <Icon type="down"/>
                            </a>
                        </Dropdown>
                    </Fragment>
                );
            },
        },
    ];

    constructor(props) {
        super(props);
        /**
         * 挂载函数
         * - methods() =>
         * - rendering() => renderXX
         * - listener() => onXX
         */
        [this.methods(), this.rendering(), this.listener()].map(item => {
            return Object.keys(item)
                .map(key => {
                    return item[key];
                });
        }).reduce((func1, func2) => {
            return [...func1, ...func2];
        }).forEach(func => {
            this[func.name] = func;
        });


    }

    render() {
        return (<div>
            ok
        </div>);
    }

    /**
     * 自定义函数
     */
    methods = () => {
        const that = this;
        return {};
    };

    /**
     * 渲染函数
     */
    rendering = () => {
        const that = this;
        return {};
    };

    /**
     * 事件监听函数
     */
    listener = () => {
        const that = this;
        return {};
    };
}
