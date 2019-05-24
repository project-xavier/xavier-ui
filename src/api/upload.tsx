import ApiClient from './apiClient';

export function uploadFile(customerId: string, formData: FormData, config = {}) {
    return ApiClient.post(`/upload/${customerId}`, formData, config);
}
