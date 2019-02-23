import {stringify} from "qs";

export default {
    title: '后台管理系统',
    description: '后台管理系统, 👷‍👷‍施工中',
    // 文件上传地址
    getFileStorageUrl() {
        return `${this.host()}/files/upload`
    },
    getImageUrl({id, ...query}) {
        return `${this.host()}/files/image/${id}?${stringify(query)}`;
    }
    ,
    host() {
        if (this.isDev()) {
            return `http://localhost:8000/api/v1`;
        }
        return `http://localhost:8080/api/v1`;
    },
    isDev() {
        return false;
    },
};
