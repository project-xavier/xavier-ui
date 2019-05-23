import ApiClient from './apiClient';

export function getAllReports() {
    return ApiClient.get('/report');
}

export function getReportById(id) {
    return ApiClient.get(`/report/${id}`);
}
