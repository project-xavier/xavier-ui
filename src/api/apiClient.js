import axios from 'axios';
// export const NOTIFICATIONS_API_ROOT = '/api/xavier/camel';
export const NOTIFICATIONS_API_ROOT = '/camel';

class BackendAPIClient {
    static request(path, body, method = 'get', config) {
        return axios.request(Object.assign({}, {
            url: NOTIFICATIONS_API_ROOT.concat(path),
            method,
            data: body
        }, config));
    }

    static post(path, body, config) {
        return this.request(path, body, 'post', config);
    }

    static put(path, body, config) {
        return this.request(path, body, 'put', config);
    }

    static get(path) {
        return this.request(path);
    }

    static delete(path, config) {
        return this.request(path, null, 'delete', config);
    }
}

export default BackendAPIClient;
