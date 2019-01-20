import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import { Checkbox, Alert, Icon } from 'antd';
import Login from 'ant-design-pro/lib/Login';
import styles from './Login.less';

const { Tab, UserName, Password, Mobile, Captcha, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['account/login'],
}))
export default class LoginPage extends Component {
  state = {
    type: 'account',
    autoLogin: true,
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
    console.log('绑定函数', this, document.referrer, opener && opener.location.href);
    console.log('更新时间', new Date(), this.state.type);
  }

  render() {
    const { login, submitting } = this.props;
    const { type, autoLogin } = this.state;
    return (
      <div className={styles.main}>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.onSubmitLogin}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Tab key="account" tab={formatMessage({ id: 'app.login.tab-login-credentials' })}>
            {login.status === 'error' &&
              type === 'account' &&
              !submitting &&
              this.renderMessage(formatMessage({ id: 'app.login.message-invalid-credentials' }))}
            <UserName
              name="username"
              placeholder="用户名"
              rules={[
                {
                  required: true,
                  message: '请输入用户名!',
                },
              ]}
            />
            <Password
              name="password"
              placeholder="密码"
              onPressEnter={() => this.loginForm.validateFields(this.onSubmitLogin)}
              rules={[
                {
                  required: true,
                  message: '请输入密码!',
                },
              ]}
            />
          </Tab>
          <Tab key="mobile" tab={formatMessage({ id: 'app.login.tab-login-mobile' })}>
            {login.status === 'error' &&
              type === 'mobile' &&
              !submitting &&
              this.renderMessage(
                formatMessage({ id: 'app.login.message-invalid-verification-code' })
              )}
            <Mobile name="mobile" placeholder="手机号" />
            <Captcha
              name="captcha"
              placeholder="验证码"
              countDown={120}
              onGetCaptcha={this.onGetCaptcha}
            />
          </Tab>
          {/*自动登陆 & 忘记密码*/}
          <div>
            <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
              <FormattedMessage id="app.login.remember-me" />
            </Checkbox>
            <a style={{ float: 'right' }} href="">
              <FormattedMessage id="app.login.forgot-password" />
            </a>
          </div>
          <Submit loading={submitting} style={{ width: '100%' }}>
            <FormattedMessage id="app.login.login" />
          </Submit>
          {/*其他方式*/}
          <div className={styles.other}>
            <FormattedMessage id="app.login.sign-in-with" />
            <Icon type="alipay-circle" className={styles.icon} theme="outlined" />
            <Icon type="taobao-circle" className={styles.icon} theme="outlined" />
            <Icon type="weibo-circle" className={styles.icon} theme="outlined" />
            <Link className={styles.register} to="/User/Register">
              <FormattedMessage id="app.login.signup" />
            </Link>
          </div>
        </Login>
      </div>
    );
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
    return {
      renderMessage(content) {
        return <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />;
      },
    };
  };

  /**
   * 事件监听函数
   */
  listener = () => {
    const that = this;
    return {
      changeAutoLogin(e) {
        return that.setState({
          autoLogin: e.target.checked,
        });
      },
      onTabChange(type) {
        console.log(type);
        return that.setState({ type });
      },

      onGetCaptcha() {
        new Promise((resolve, reject) => {
          that.loginForm.validateFields(['mobile'], {}, (err, values) => {
            if (err) {
              reject(err);
            } else {
              const { dispatch } = that.props;
              dispatch({
                type: 'login/getCaptcha',
                payload: values.mobile,
              })
                .then(resolve)
                .catch(reject);
            }
          });
        });
      },

      /**
       * 提交登陆
       * @param err
       * @param values
       */
      onSubmitLogin(err, values) {
        if (!err) {
          const { type } = that.state;
          const { dispatch } = that.props;
          dispatch({
            type: 'login/login',
            payload: {
              ...values,
              type,
            },
          });
        }
      },
    };
  };
}
