export default {
    title: '后台管理系统',
    description: '后台管理系统, 👷‍👷‍施工中',
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
