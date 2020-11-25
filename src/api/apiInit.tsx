import axios, { AxiosRequestConfig } from 'axios';

export const API_BASE_URL = '/api/xavier/v1.0';
declare let insights: any;

export const authInterceptor = (reqConfig: AxiosRequestConfig): AxiosRequestConfig => {
  return insights.chrome.auth.getUser().then(() => {
    return Promise.resolve(reqConfig);
  });
};

export const initApi = () => {
  axios.defaults.baseURL = `${API_BASE_URL}`;
  axios.interceptors.request.use(authInterceptor);
};
