import ApiClient from './apiClient';
import { AxiosPromise } from 'axios';

export function uploadFile(
    customerId: string,
    formData: FormData,
    config = {}
): AxiosPromise {
    return ApiClient.post(`/upload/${customerId}`, formData, config);
}
