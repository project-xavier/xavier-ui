import ApiClient from './apiClient';

export function uploadFile(customerId, formData, config = {}) {
    return ApiClient.post(`/upload/${customerId}`, formData, config);
}
