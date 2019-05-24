import axios from 'axios';
export const NOTIFICATIONS_API_ROOT = '/api/xavier/camel';
// export const NOTIFICATIONS_API_ROOT = '/camel';

class BackendAPIClient {
    static request(path: string, body: any = null, method = 'get', config = {}) {
        return axios.request(Object.assign({}, {
            url: NOTIFICATIONS_API_ROOT.concat(path),
            method,
            data: body
        }, config));
    }

    static post(path: string, body: any, config = {}) {
        return this.request(path, body, 'post', config);
    }

    static put(path: string, body: any, config = {}) {
        return this.request(path, body, 'put', config);
    }

    static get(path: string) {
        return this.request(path);
    }

    static delete(path: string, config = {}) {
        return this.request(path, null, 'delete', config);
    }
}

export default BackendAPIClient;
