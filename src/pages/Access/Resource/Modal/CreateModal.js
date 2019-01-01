import React, { PureComponent } from 'react';
import { Form, Select, Button, Modal, Steps, TreeSelect, Switch, Icon, Input } from 'antd';
import { connect } from 'dva';
import getIcons from '@/services/data';

const type = () => {
  return [
    {
      value: 0,
      text: '菜单',
    },
    {
      value: 1,
      text: '按钮',
    },
  ];
};
/**
 * 新增弹窗
 */
@connect(({ resource, loading }) => ({
  // data 数据的加载状态
  submitting: loading.effects['resource/save'],
}))
@Form.create()
export default class CreateModal extends PureComponent {
  state = {
    // 当前步骤
    step: 0,
    // 待提交的值
    formVals: {},
  };
  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

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
  componentDidMount() {}

  render() {
    const { visible } = this.props;
    const { step } = this.state;
    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="新增资源"
        visible={visible}
        footer={this.renderSteps()[step].footer()}
      >
        <Steps style={{ marginBottom: 28 }} size="small" current={step}>
          {this.renderSteps().map((step, index) => {
            return step.title(index);
          })}
        </Steps>
        {this.renderSteps()[step].content()}
      </Modal>
    );
  }

  methods() {
    const that = this;
    return {
      // 分步面板, 下一步 ->
      forward() {
        const { step } = that.state;
        that.goStep(step + 1);
      },
      // 分步面板, 上一步 <-
      backward() {
        const { step } = that.state;
        that.goStep(step - 1);
      },
      // 分步面板, 到指定位置
      goStep(step) {
        that.setState({ step });
      },
    };
  }

  rendering() {
    const that = this;
    return {
      // 渲染步骤内容
      renderSteps() {
        const { step } = that.state;
        const { form, onCancel, nodes, submitting } = that.props;
        return [
          {
            title(key = '') {
              return <Steps.Step key={key} title="选择父节点" />;
            },
            content() {
              return [
                <Form.Item key="parent" {...that.formLayout} label="父节点">
                  {form.getFieldDecorator('parent', {
                    initialValue: nodes.length ? nodes[0].id : null,
                  })(
                    <TreeSelect style={{ width: '100%' }}>{that.renderTreeNode(nodes)}</TreeSelect>
                  )}
                </Form.Item>,
              ];
            },
            footer() {
              return [
                <Button key="cancel" onClick={() => onCancel()}>
                  取消
                </Button>,
                <Button key="forward" type="primary" onClick={() => that.onClickNext(step)}>
                  下一步
                </Button>,
              ];
            },
          },
          {
            title(key = '') {
              return <Steps.Step key={key} title="基本信息" />;
            },
            content() {
              return [
                <Form.Item key="1" {...that.formLayout} label="名称" hasFeedback>
                  {form.getFieldDecorator('name', {
                    rules: [{ required: true, message: '请输入资源名称' }],
                  })(<Input style={{ width: '100%' }} />)}
                </Form.Item>,
                <Form.Item key="2" {...that.formLayout} label="类型">
                  {form.getFieldDecorator('type', {
                    rules: [{ required: true, message: '请选择资源类型' }],
                    initialValue: 0,
                  })(
                    <Select style={{ width: '100%' }}>
                      {type().map((item, index) => {
                        return (
                          <Select.Option key={index} value={item.value}>
                            {item.text}
                          </Select.Option>
                        );
                      })}
                    </Select>
                  )}
                </Form.Item>,
                <Form.Item key="4" {...that.formLayout} label="请求" hasFeedback>
                  {form.getFieldDecorator('path', {
                    rules: [{ required: true, message: '请输入链接' }],
                  })(
                    <Input
                      style={{ width: '100%' }}
                      addonBefore={form.getFieldDecorator('method', {
                        rules: [{ required: true, message: '请选择请求类型' }],
                        initialValue: 'GET',
                      })(
                        <Select>
                          {['GET', 'POST', 'DELETE', 'PUT'].map((method, index) => {
                            return (
                              <Select.Option key={index} value={method}>
                                {method}
                              </Select.Option>
                            );
                          })}
                        </Select>
                      )}
                    />
                  )}
                </Form.Item>,
                <Form.Item key="5" {...that.formLayout} label="图标">
                  {form.getFieldDecorator('icon', {
                    rules: [{ required: true, message: '请选择图标' }],
                    initialValue: 'down',
                  })(
                    <Select
                      style={{ width: '100%' }}
                      showSearch
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      placeholder="选择图标"
                    >
                      {that.renderIconOptions()}
                    </Select>
                  )}
                </Form.Item>,
                <Form.Item key="6" {...that.formLayout} label="状态">
                  {form.getFieldDecorator('enabled', {
                    initialValue: true,
                    valuePropName: 'checked',
                  })(<Switch checkedChildren="开" unCheckedChildren="关" />)}
                </Form.Item>,
                <Form.Item key="7" {...that.formLayout} label="描述">
                  {form.getFieldDecorator('description', {})(
                    <Input.TextArea
                      style={{ width: '100%' }}
                      autosize={{ minRows: 3, maxRows: 6 }}
                    />
                  )}
                </Form.Item>,
              ];
            },
            footer() {
              return [
                <Button key="back" style={{ float: 'left' }} onClick={that.backward}>
                  上一步
                </Button>,
                <Button key="cancel" onClick={() => onCancel()}>
                  取消
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  loading={submitting}
                  onClick={() => that.onClickNext(step)}
                >
                  完成
                </Button>,
              ];
            },
          },
        ];
      },
      /**
       * 渲染树级节点
       * @param nodes
       * @returns {any[]}
       */
      renderTreeNode(nodes) {
        return (nodes || []).map(node => {
          return (
            <TreeSelect.TreeNode title={node.name} key={node.id} value={node.id}>
              {node.children && node.children.length ? that.renderTreeNode(node.children) : null}
            </TreeSelect.TreeNode>
          );
        });
      },

      /**
       * 渲染待选择图标
       */
      renderIconOptions() {
        return (getIcons() || []).map((icon, index) => {
          return (
            <Select.Option key={index} value={icon}>
              <Icon type={icon} /> {icon}
            </Select.Option>
          );
        });
      },
    };
  }

  listener() {
    const that = this;
    return {
      // 点击 下一页 触发
      onClickNext(step) {
        const { form, onDone } = that.props;
        const { formVals: oldValue } = that.state;
        form.validateFields((err, fieldsValue) => {
          if (err) return;
          const formVals = { ...oldValue, ...fieldsValue };
          this.setState({ formVals }, () => {
            if (step < that.renderSteps().length - 1) {
              that.forward();
            } else {
              // 保存
              onDone(formVals);
            }
          });
        });
      },
    };
  }
}
