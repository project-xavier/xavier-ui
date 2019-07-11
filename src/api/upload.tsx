import ApiClient from './apiClient';
import { AxiosPromise } from 'axios';

export function uploadFile(
    formData: FormData,
    config = {}
): AxiosPromise {
    return ApiClient.post('/upload', formData, config);
}
