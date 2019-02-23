import {} from "antd";
import { uploadBase64s } from '@/services/common';
import {ResultCode} from "../utils/Constant";
import { message as Message } from 'antd';

export default {
    namespace: 'common',
    state: {
        // no-data
    },

    effects: {
        // 上传
        * uploadBase64s({payload, callback}, {call, put}) {
            const {code, data, message} = yield call(uploadBase64s, payload);
            if (ResultCode.SUCCESS === code) {
                if (callback) {
                    callback(data);
                }
            } else {
                Message.error(message);
            }
        },
    },

    reducers: {
        example2(state, {payload}) {
        },
    },
    subscriptions: {}
};