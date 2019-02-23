import React, { Component } from 'react';
import { Icon, Upload } from 'antd';
import { connect } from 'dva';
import PropTypes from 'prop-types';
import { LocalStorage } from '../../../utils/Constant';
import config from '@/app.config';

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

@connect(
    () => ({}),
    dispatch => ({
        $uploadBase64s: (args = {}) => dispatch({ type: 'common/uploadBase64s', ...args }),
    })
)
export class AvatarUpload extends Component {
    static propTypes = {
        defaultAvatar: PropTypes.string,
        // 上传文件之前的钩子, 校验格式和文件大小
        onBeforeUpload: PropTypes.func,
        // 上传后触发
        onDone: PropTypes.func,
    };

    static defaultProps = {
        defaultAvatar: '',
        onBeforeUpload: file => true,
        onDone: id => {},
    };
    state = {
        imageUrl: this.props.defaultAvatar,
        loading: false,
    };

    render() {
        const { imageUrl, loading } = this.state;
        const { onBeforeUpload } = this.props;
        const uploadButton = (
            <div>
                <Icon type={loading ? 'loading' : 'plus'} />
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        return (
            <Upload
                name="file"
                multiple
                listType="picture-card"
                className="avatar-uploader"
                headers={{
                    Authorization: `Bearer ${localStorage.getItem(LocalStorage.TOKEN)}`,
                }}
                action={config.getFileStorageUrl()}
                showUploadList={false}
                beforeUpload={onBeforeUpload}
                onChange={this.onChange}
            >
                {imageUrl ? (
                    <img src={imageUrl} style={{ height: 100, width: 100 }} alt="avatar" />
                ) : (
                    uploadButton
                )}
            </Upload>
        );
    }

    // 上传文件改变时的状态
    onChange = ({ file: { status, originFileObj }, fileList }) => {
        console.log('originFileObj', originFileObj);
        if (status === 'uploading') {
            this.setState({ loading: true });
            return;
        }
        if (status === 'done') {
            const { onDone } = this.props;
            const {
                response: { data },
            } = fileList[0];
            // Get this url from response in real world.
            getBase64(originFileObj, base64 => {
                this.setState({
                    imageUrl: base64,
                    loading: false,
                });
            });
            onDone(data);
        }
    };
}
