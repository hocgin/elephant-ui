export default {
    host() {
        console.log(this);
        if (this.isDev()) {
            return `http://localhost:8000`;
        }
        return `http://localhost:8080`;
    },
    isDev() {
        return true;
    },
};
