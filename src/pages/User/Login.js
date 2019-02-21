import React, {Component} from 'react';
import {connect} from 'dva';
import {formatMessage, FormattedMessage} from 'umi/locale';
import Link from 'umi/link';
import {Alert, Button, Checkbox, Icon} from 'antd';
import styles from './Login.less';
import Login from '@/components/Login';

const {Tab, UserName, Password, Mobile, Captcha, Submit} = Login;

@connect(({login, loading}) => ({
        login,
        submitting: loading.effects['account/login'],
    }),
    dispatch => ({
        $login: (args = {}) => dispatch({type: 'login/login', ...args}),
        $getCaptcha: (args = {}) => dispatch({type: 'login/getCaptcha', ...args}),
    }))
export default class LoginPage extends Component {
    state = {
        type: 'account',
        autoLogin: true,
    };

    render() {
        const {login, submitting} = this.props;
        const {type, autoLogin} = this.state;
        return (
            <div className={styles.main}>
                <Login defaultActiveKey={type}
                       onTabChange={this.onTabChange}
                       onSubmit={this.onSubmitLogin}
                       ref={form => {
                           this.loginForm = form;
                       }}
                >
                    <Tab
                        key="account"
                        tab={formatMessage({id: 'app.login.tab-login-credentials'})}
                    >
                        {login.status === 'error' &&
                        type === 'account' &&
                        !submitting &&
                        this.renderMessage(
                            formatMessage({id: 'app.login.message-invalid-credentials'})
                        )}
                        <UserName
                            name="username"
                            placeholder="用户名"
                        />
                        <Password
                            name="password"
                            placeholder="密码"
                            onPressEnter={(e) => {
                                e.preventDefault();
                                this.loginForm.validateFields(this.onSubmitLogin);
                            }}
                        />
                    </Tab>
                    <Tab key="mobile" tab={formatMessage({id: 'app.login.tab-login-mobile'})}>
                        {login.status === 'error' &&
                        type === 'mobile' &&
                        !submitting &&
                        this.renderMessage(
                            formatMessage({id: 'app.login.message-invalid-verification-code'})
                        )}
                        <Mobile name="mobile" placeholder="手机号"/>
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
                            <FormattedMessage id="app.login.remember-me"/>
                        </Checkbox>
                        <a style={{float: 'right'}}>
                            <FormattedMessage id="app.login.forgot-password"/>
                        </a>
                    </div>
                    <Submit loading={submitting}>
                        登陆
                    </Submit>
                    {/*其他方式*/}
                    <div className={styles.other}>
                        <FormattedMessage id="app.login.sign-in-with"/>
                        <Icon type="alipay-circle" className={styles.icon} theme="outlined"/>
                        <Icon type="taobao-circle" className={styles.icon} theme="outlined"/>
                        <Icon type="weibo-circle" className={styles.icon} theme="outlined"/>
                        <Link className={styles.register} to="/User/Register">
                            <FormattedMessage id="app.login.signup"/>
                        </Link>
                    </div>
                </Login>
            </div>
        );
    }

    /**
     * 渲染消息
     */
    renderMessage = (content) => {
        return (
            <Alert style={{marginBottom: 24}} message={content} type="error" showIcon/>
        );
    };

    // 自动登陆
    changeAutoLogin = (e) => {
        this.setState({
            autoLogin: e.target.checked,
        });
    };

    // 登陆方式切换
    onTabChange = (type) => {
        console.log(type);
        this.setState({type});
    };

    // 验证码
    onGetCaptcha = () => {
        new Promise((resolve, reject) => {
            this.loginForm.validateFields(['mobile'], {}, (err, values) => {
                if (err) {
                    reject(err);
                } else {
                    const {$getCaptcha} = this.props;
                    $getCaptcha({
                        payload: values.mobile,
                    })
                        .then(resolve)
                        .catch(reject);
                }
            });
        });
    };

    /**
     * 提交登陆
     * @param err
     * @param values
     */
    onSubmitLogin = (err, values) => {
        if (err) {
            return;
        }
        const {type} = this.state;
        const {$login} = this.props;
        $login({
            payload: {
                ...values,
                type: type,
            },
        });
    }
}
