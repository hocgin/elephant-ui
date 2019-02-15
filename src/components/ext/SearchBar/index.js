import React from 'react';
import { Button, Col, Form, Icon, Row } from 'antd';
import * as LangKit from '../../../utils/LangKit';
import styles from '../../../pages/Access/Role/Index.less';

@Form.create()
export default class SearchBar extends React.PureComponent {
  state = {
    isExpand: false,
  };

  render() {
    const { children } = this.props;
    const { form } = this.props;
    let { isExpand } = this.state;
    let ele = children(form);
    return (
      <Form onSubmit={this.onSubmit} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          {(isExpand ? ele : LangKit.slice(ele, 2)).map((item, index) => (
            <Col key={index} md={8} sm={24}>{item}</Col>))}
          {!isExpand && (<Col md={8} sm={24}>
                                    <span className={styles.submitButtons}>
                                        <Button type="primary" htmlType="submit">
                                            查询
                                        </Button>
                                        <Button htmlType="button"
                                                style={{ marginLeft: 8 }}
                                                onClick={this.onReset}>
                                            重置
                                        </Button>
                                        <a style={{ marginLeft: 8 }}
                                           onClick={this.onClickToggleExpand}>
                                            展开 <Icon type="down"/>
                                        </a>
                                    </span>
          </Col>)}
        </Row>
        {isExpand && (
          <div style={{ overflow: 'hidden' }}>
            <div style={{ float: 'right', marginBottom: 24 }}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button
                htmlType="button"
                style={{ marginLeft: 8 }}
                onClick={this.onReset}
              >
                重置
              </Button>
              <a style={{ marginLeft: 8 }}
                 onClick={this.onClickToggleExpand}>
                收起 <Icon type="up"/>
              </a>
            </div>
          </div>
        )}
      </Form>
    );
  }

  renderSearchInput = ({ isExpand = false, children = [] }) => {
    if (isExpand) {
    }
  };

  /**
   * 提交数据
   * - 仅校验通过的会触发上层函数
   * @param e
   */
  onSubmit = e => {
    e.preventDefault();
    const { form, onSubmit } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      onSubmit(fieldsValue);
    });
  };
  /**
   * 重置输入框
   */
  onReset = () => {
    const { form } = this.props;
    form.resetFields();
  };

  onClickToggleExpand = () => {
    this.setState(({ isExpand }) => ({
      isExpand: !isExpand,
    }));
  };
}
