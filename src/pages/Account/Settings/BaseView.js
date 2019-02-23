import React, {Component} from 'react';
import {formatMessage, FormattedMessage} from 'umi/locale';
import {Button, Form, Input, Select} from 'antd';
import {connect} from 'dva';
import config from '@/app.config';
import styles from './BaseView.less';
import {AvatarUpload} from "../../../components/ext/AvatarUpload";
// import { getTimeDistance } from '@/utils/utils';

const FormItem = Form.Item;
const {Option} = Select;

@connect(({account}) => ({
    currentUser: account.currentUser,
}), dispatch => ({
    $update: (args = {}) => dispatch({type: 'account/update', ...args}),
    $getCurrentAccount: (args = {}) => dispatch({type: 'account/getCurrentAccount', ...args}),
}))
@Form.create()
class BaseView extends Component {

    state = {
        avatar: this.props.currentUser.avatar,
    };

    componentDidMount() {
        this.setBaseInfo();
    }

    setBaseInfo = () => {
        const {currentUser, form} = this.props;
        Object.keys(form.getFieldsValue()).forEach(key => {
            const obj = {};
            obj[key] = currentUser[key] || null;
            form.setFieldsValue(obj);
        });
    };

    getAvatarURL() {
        const {currentUser} = this.props;
        return config.getImageUrl({
            id: currentUser.avatar,
        });
    }

    getViewDom = ref => {
        this.view = ref;
    };

    render() {
        const {
            form: {getFieldDecorator},
        } = this.props;
        return (
            <div className={styles.baseView} ref={this.getViewDom}>
                <div className={styles.left}>
                    <Form layout="vertical" onSubmit={this.onSubmit} hideRequiredMark>
                        <FormItem label={formatMessage({id: 'app.settings.basic.nickname'})}>
                            {getFieldDecorator('nickname', {
                                rules: [
                                    {
                                        required: true,
                                        message: formatMessage({id: 'app.settings.basic.nickname-message'}, {}),
                                    },
                                ],
                            })(<Input/>)}
                        </FormItem>
                        <FormItem label={formatMessage({id: 'app.settings.basic.country'})}>
                            {getFieldDecorator('gender', {
                                rules: [
                                    {
                                        required: true,
                                        message: formatMessage({id: 'app.settings.basic.country-message'}, {}),
                                    },
                                ],
                            })(
                                <Select style={{maxWidth: 220}}>
                                    <Option value={0}>女</Option>
                                    <Option value={1}>男</Option>
                                </Select>
                            )}
                        </FormItem>
                        <Button type="primary" onClick={this.onSubmit}>
                            <FormattedMessage
                                id="app.settings.basic.update"
                                defaultMessage="Update Information"
                            />
                        </Button>
                    </Form>
                </div>
                <div className={styles.right}>
                    <AvatarUpload defaultAvatar={this.getAvatarURL()}
                                  onDone={this.onUploadAvatarDone}/>
                </div>
            </div>
        );
    }

    // 图片上传完成
    onUploadAvatarDone = (id) => {
        this.setState({avatar: id});
    };

    // 提交
    onSubmit = () => {
        const {form: {validateFields}, $update, $getCurrentAccount} = this.props;
        validateFields((err, fieldsValue) => {
            if (err) {
                return;
            }
            $update({
                payload: {
                    ...fieldsValue,
                    avatar: this.state.avatar
                },
                callback: $getCurrentAccount
            })
        });
    };
}

export default BaseView;
