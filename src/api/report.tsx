import ApiClient from './apiClient';

export function getAllReports() {
    return ApiClient.get('/report');
}

export function getReportById(id: number) {
    return ApiClient.get(`/report/${id}`);
}
