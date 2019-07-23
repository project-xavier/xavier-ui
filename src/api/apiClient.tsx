import axios, { AxiosPromise } from 'axios';

class BackendAPIClient {
    static request<T>(
        path: string,
        body: any = null,
        method = 'get',
        config = {}
    ): AxiosPromise<T> {
        return axios.request<T>(Object.assign({}, {
            url: path,
            method,
            data: body
        }, config));
    }

    static post<T>(
        path: string,
        body: any,
        config = {}
    ): AxiosPromise<T> {
        return this.request<T>(path, body, 'post', config);
    }

    static put<T>(
        path: string,
        body: any,
        config = {}
    ): AxiosPromise<T> {
        return this.request<T>(path, body, 'put', config);
    }

    static get<T>(
        path: string
    ): AxiosPromise<T> {
        return this.request<T>(path);
    }

    static delete(path: string, config = {}) {
        return this.request(path, null, 'delete', config);
    }
}

export default BackendAPIClient;
