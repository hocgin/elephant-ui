import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {} from 'antd';

import styles from './Index.less';

import Sup from '@/utils/supplement';

const Expand = {
  // 取数据
  mapStateToProps(states) {
    return {};
  },
  // 发起请求
  mapDispatchToProps(dispatch) {
    return {
      $example() {},
    };
  },
};

let xxStatus = ['开启', '关闭'];

/* eslint react/no-multi-comp:0 */
@connect(
  Expand.mapStateToProps,
  Expand.mapDispatchToProps
)
@Form.create()
export default class Index extends PureComponent {
  state = {};

  constructor(props) {
    super(props);
    /**
     * 挂载函数
     * - methods() =>
     * - rendering() => renderXX
     * - listener() => onXX
     */
    [this.methods(), this.rendering(), this.listener()]
      .map(item => {
        return Object.keys(item).map(key => {
          return item[key];
        });
      })
      .reduce((func1, func2) => {
        return [...func1, ...func2];
      })
      .forEach(func => {
        this[func.name] = func;
      });
  }

  render() {
    return <div>ok</div>;
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
    return {
      onShow(key) {
        that.setState({
          [key]: true,
        });
      },
      onHidden(key) {
        that.setState({
          [key]: false,
        });
      },
    };
  };
}
