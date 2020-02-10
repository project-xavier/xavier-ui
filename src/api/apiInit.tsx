import axios, { AxiosRequestConfig, AxiosError } from 'axios';
import getBaseName from '../Utilities/getBaseName';

export const API_BASE_URL = '/api/xavier';
declare var insights: any;

export const authInterceptor = (reqConfig: AxiosRequestConfig): AxiosRequestConfig => {
    return insights.chrome.auth.getUser().then(() => {
        return Promise.resolve(reqConfig);
    });
};

export const initApi = () => {
    axios.defaults.baseURL = `${API_BASE_URL}`;
    axios.interceptors.request.use(authInterceptor);

    axios.interceptors.response.use(undefined, (error: AxiosError) => {
        if (error && error.response && (error.response.status === 403)) {
            window.location.href = getBaseName(window.location.pathname) + '/error403';
        }
        return Promise.reject(error);
    });
};
