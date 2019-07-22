import axios, { AxiosPromise } from 'axios';
export const NOTIFICATIONS_API_ROOT = '/api/xavier';

class BackendAPIClient {
    public static request<T>(
        path: string,
        body: any = null,
        method: 'get' | 'post' | 'put' | 'delete' | 'options' | 'patch' | undefined = 'get',
        config = {}
    ): AxiosPromise<T> {
        return axios.request<T>(Object.assign({}, {
            url: NOTIFICATIONS_API_ROOT.concat(path),
            method,
            data: body
        }, config));
    }

    public static post<T>(
        path: string,
        body: any,
        config = {}
    ): AxiosPromise<T> {
        return this.request<T>(path, body, 'post', config);
    }

    public static put<T>(
        path: string,
        body: any,
        config = {}
    ): AxiosPromise<T> {
        return this.request<T>(path, body, 'put', config);
    }

    public static get<T>(
        path: string
    ): AxiosPromise<T> {
        return this.request<T>(path);
    }

    public static delete(path: string, config = {}) {
        return this.request(path, null, 'delete', config);
    }
}

export default BackendAPIClient;
