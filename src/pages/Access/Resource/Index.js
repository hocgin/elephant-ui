import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  Row,
  Col,
  Card,
  Form,
  Input,
  Select,
  Icon,
  Button,
  Dropdown,
  Menu,
  InputNumber,
  DatePicker,
  Modal,
  message,
  Badge,
  Divider,
  Steps,
  Radio,
  Switch,
  Tree,
} from 'antd';
import StandardTable from '@/components/StandardTable';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import styles from './Index.less';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const status = () => {
  return [
    {
      status: 'error',
      text: '禁用',
    },
    {
      status: 'success',
      text: '启用',
    },
  ];
};

/* eslint react/no-multi-comp:0 */
@connect(({ resource, loading }) => ({
  result: resource.result,
  // data 数据的加载状态
  loading: loading.models.result,
}))
@Form.create()
export default class Index extends PureComponent {
  state = {
    expandForm: false,
    selectedRows: [],
  };

  // 字段
  columns = [
    {
      title: '角色名',
      dataIndex: 'name',
    },
    {
      title: '角色标识',
      dataIndex: 'role',
    },
    {
      title: '描述',
      dataIndex: 'desc',
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: [
        {
          text: status()[0].text,
          value: 0,
        },
        {
          text: status()[1].text,
          value: 1,
        },
      ],
      render(val) {
        let { status, text } = status()[val];
        return <Badge status={status} text={text} />;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '操作',
      key: 'operation',
      render: (text, record) => {
        const menu = (
          <Menu onClick={this.onClickMenus} selectedKeys={[]}>
            <Menu.Item key="edit">修改</Menu.Item>
            <Menu.Item key="on">启用</Menu.Item>
            <Menu.Item key="off">禁用</Menu.Item>
          </Menu>
        );
        return (
          <Fragment>
            <a onClick={() => this.onClickDetailButton(true, record)}>查看详情</a>
            <Divider type="vertical" />
            <Dropdown overlay={menu}>
              <a className="ant-dropdown-link" href="#">
                更多操作 <Icon type="down" />
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

  /**
   * @组件挂载后
   */
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'resource/query',
    });
  }

  render() {
    const { result, loading } = this.props;
    const { selectedRows } = this.state;
    const menu = (
      <Menu onClick={this.onClickMenus} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    return (
      <PageHeaderWrapper title="资源管理">
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/*搜索层*/}
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            {/*工具栏(新建/批量操作)层*/}
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.onClickCreateButton(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button>删除</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
            </div>
            <Tree
              multiple
              defaultExpandAll
              onSelect={this.onSelectTreeNodeRow}
              onRightClick={({ event, node }) => {
                console.log(arguments);
              }}
            >
              {this.renderTreeNode(result)}
            </Tree>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }

  methods = () => {
    const that = this;
    return {};
  };

  rendering = () => {
    const that = this;
    return {
      /**
       * 渲染节点
       * 节点数据格式:
       * children: (2) [{…}, {…}]
       * depth: 0
       * description: "描述信息"
       * enabled: true
       * icon: "warning"
       * id: "root"
       * lft: 1
       * method: "GET"
       * name: "根"
       * path: "/"
       * rgt: 12
       * type: 0
       * @param nodes
       */
      renderTreeNode(nodes) {
        return (nodes || []).map(node => {
          return (
            <Tree.TreeNode title={node.name} key={node.id}>
              {node.children && node.children.length ? that.renderTreeNode(node.children) : null}
            </Tree.TreeNode>
          );
        });
      },
      /**
       * 根据情况渲染搜索框
       */
      renderForm() {
        const { expandForm } = that.state;
        return expandForm ? that.renderAdvancedForm() : that.renderSimpleForm();
      },
      /**
       * 渲染搜索框展开状态
       */
      renderAdvancedForm() {
        const {
          form: { getFieldDecorator },
        } = this.props;
        return (
          <Form onSubmit={that.onClickSearchButton} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <Form.Item label="角色名称">
                  {getFieldDecorator('name')(<Input placeholder="请输入" />)}
                </Form.Item>
              </Col>
              <Col md={8} sm={24}>
                <Form.Item label="使用状态">
                  {getFieldDecorator('status')(
                    <Select placeholder="请选择" style={{ width: '100%' }}>
                      {status().map(({ status, text }) => {
                        return (
                          <Select.Option key={status} value={status}>
                            {text}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col md={8} sm={24}>
                <Form.Item label="创建日期">
                  {getFieldDecorator('createdAt')(
                    <DatePicker style={{ width: '100%' }} placeholder="请输入更新日期" />
                  )}
                </Form.Item>
              </Col>
            </Row>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ float: 'right', marginBottom: 24 }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={that.handleFormReset}>
                  重置
                </Button>
                <a style={{ marginLeft: 8 }} onClick={that.onClickToggleSearchMode}>
                  收起 <Icon type="up" />
                </a>
              </div>
            </div>
          </Form>
        );
      },
      /**
       * 渲染搜索框收起状态
       */
      renderSimpleForm() {
        const {
          form: { getFieldDecorator },
        } = this.props;
        return (
          <Form onSubmit={that.onClickSearchButton} layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <Form.Item label="角色名称">
                  {getFieldDecorator('name')(<Input placeholder="请输入" />)}
                </Form.Item>
              </Col>
              <Col md={8} sm={24}>
                <Form.Item label="使用状态">
                  {getFieldDecorator('status')(
                    <Select placeholder="请选择" style={{ width: '100%' }}>
                      {status().map(({ status, text }) => {
                        return (
                          <Select.Option key={status} value={status}>
                            {text}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>
              </Col>
              <Col md={8} sm={24}>
                <span className={styles.submitButtons}>
                  <Button type="primary" htmlType="submit">
                    查询
                  </Button>
                  <Button style={{ marginLeft: 8 }} onClick={that.onClickResetSearch}>
                    重置
                  </Button>
                  <a style={{ marginLeft: 8 }} onClick={that.onClickToggleSearchMode}>
                    展开 <Icon type="down" />
                  </a>
                </span>
              </Col>
            </Row>
          </Form>
        );
      },
    };
  };

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
      /**
       * 菜单点击
       * @param e
       */
      onClickMenus(e) {
        console.log(e.key);
      },
      /**
       * 选择树节点
       */
      onSelectTreeNodeRow(selectedKeys, e) {
        that.setState({
          selectedRows: selectedKeys,
        });
      },
      /**
       * 处理展开/收起
       */
      onClickToggleSearchMode() {
        const { expandForm } = that.state;
        that.setState({
          expandForm: !expandForm,
        });
      },
      // 处理搜索条件重置
      onClickResetSearch() {
        const { form } = that.props;
        form.resetFields();
      },
    };
  };
}
