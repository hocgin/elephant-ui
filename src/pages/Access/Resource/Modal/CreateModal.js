import { PureComponent } from 'react';

/**
 * 新增弹窗
 * - visible 是否可见
 * - value 更新时携带的原值
 * - onModalVisible 取消时触发
 * - onDone 完成时触发
 */
@Form.create()
class CreateModal extends PureComponent {
  state = {
    // 当前步骤
    step: 0,
    // 待提交的值
    formValue: {},
  };
  formLayout = {
    labelCol: { span: 7 },
    wrapperCol: { span: 13 },
  };

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
    const { visible, onModalVisible } = this.props;
    const { step, form } = this.state;
    return (
      <Modal
        width={640}
        bodyStyle={{ padding: '32px 40px 48px' }}
        destroyOnClose
        title="规则配置"
        visible={visible}
        footer={this.renderSteps()[step].footer()}
        onCancel={() => onModalVisible()}
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

  methods = () => {
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
  };

  rendering = () => {
    const that = this;
    return {
      // 渲染步骤内容
      renderSteps() {
        const { step, formValue } = that.state;
        const { form, onModalVisible } = that.props;

        return [
          {
            title(key = '') {
              return <Steps.Step key={key} title="基本信息" />;
            },
            content() {
              return [
                <Form.Item key="target" {...that.formLayout} label="监控对象">
                  {form.getFieldDecorator('target', {
                    initialValue: 1,
                  })(
                    <Select style={{ width: '100%' }}>
                      <Select.Option value="0">表一</Select.Option>
                      <Select.Option value="1">表二</Select.Option>
                    </Select>
                  )}
                </Form.Item>,
              ];
            },
            footer() {
              return [
                <Button key="cancel" onClick={() => onModalVisible()}>
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
              return <Steps.Step key={key} title="配置规则属性" />;
            },
            content() {
              return [
                <Form.Item key="target" {...that.formLayout} label="监控对象">
                  {form.getFieldDecorator('target', {
                    initialValue: 1,
                  })(
                    <Select style={{ width: '100%' }}>
                      <Select.Option value="0">表一</Select.Option>
                      <Select.Option value="1">表二</Select.Option>
                    </Select>
                  )}
                </Form.Item>,
              ];
            },
            footer() {
              return [
                <Button key="back" style={{ float: 'left' }} onClick={that.backward}>
                  上一步
                </Button>,
                <Button key="cancel" onClick={() => onModalVisible()}>
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
              return <Steps.Step key={key} title="设定调度周期" />;
            },
            content() {
              return [
                <Form.Item key="target" {...that.formLayout} label="监控对象">
                  {form.getFieldDecorator('target', {
                    initialValue: 1,
                  })(
                    <Select style={{ width: '100%' }}>
                      <Select.Option value="0">表一</Select.Option>
                      <Select.Option value="1">表二</Select.Option>
                    </Select>
                  )}
                </Form.Item>,
              ];
            },
            footer() {
              return [
                <Button key="back" style={{ float: 'left' }} onClick={that.backward}>
                  上一步
                </Button>,
                <Button key="cancel" onClick={() => onModalVisible()}>
                  取消
                </Button>,
                <Button key="submit" type="primary" onClick={() => that.onClickNext(step)}>
                  完成
                </Button>,
              ];
            },
          },
        ];
      },
    };
  };

  listener = () => {
    const that = this;
    return {
      // 点击 下一页 触发
      onClickNext(step) {
        const { form, onDone } = that.props;
        const { formValue: oldValue } = that.state;
        form.validateFields((err, fieldsValue) => {
          if (err) return;
          const formVals = { ...oldValue, ...fieldsValue };
          this.setState({ formVals }, () => {
            if (step < that.renderSteps().length - 1) {
              that.forward();
            } else {
              onDone(formVals);
            }
          });
        });
      },
    };
  };
}
