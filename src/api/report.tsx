import { AxiosPromise } from 'axios';
import ApiClient from './apiClient';
import { Report } from '../models';

export function getAllReports(): AxiosPromise<Report[]> {
    return ApiClient.get<Report[]>('/report');
}

export function getReportById(id: number): AxiosPromise<Report> {
    return ApiClient.get<Report>(`/report/${id}`);
}
