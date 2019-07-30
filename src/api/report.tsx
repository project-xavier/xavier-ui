import { AxiosPromise } from 'axios';
import ApiClient from './apiClient';
import {
    Report,
    ReportWorkloadMigrationSummary,
    ReportInitialSavingEstimation,
    SearchResult,
    ReportWorkloadInventory
} from '../models';

export function getAllReports(page: number, perPage: number, filterText: string): AxiosPromise<SearchResult<Report>> {
    // Using page-1 because the backend considers page 0 as the first one
    const params = { page: page - 1, size: perPage, filterText };
    const query: string[] = [];

    Object.keys(params).map(key => {
        const value = params[key];
        if (value !== undefined) {
            query.push(`${key}=${value}`);
        }
    });

    const url = `/report?${query.join('&')}`;
    return ApiClient.get<SearchResult<Report>>(url);
}

export function getReportById(id: number): AxiosPromise<Report> {
    return ApiClient.get<Report>(`/report/${id}`);
}

export function deleteReport(id: number): AxiosPromise {
    return ApiClient.delete(`/report/${id}`);
}

export function getReportWokloadMigrationSummary(id: number): AxiosPromise<ReportWorkloadMigrationSummary> {
    return ApiClient.get<ReportWorkloadMigrationSummary>(`/report/${id}/workload-migration-summary`);
}

export function getReportInitialSavingestimation(id: number): AxiosPromise<ReportInitialSavingEstimation> {
    return ApiClient.get<ReportInitialSavingEstimation>(`/report/${id}/initial-saving-estimation`);
}

export function getReportWorkloadInventory(
    id: number,
    page: number,
    perPage: number
): AxiosPromise<SearchResult<ReportWorkloadInventory>> {
    // Using page-1 because the backend considers page 0 as the first one
    const params = { page: page - 1, size: perPage };
    const query: string[] = [];

    Object.keys(params).map((key) => {
        const value = params[key];
        if (value !== undefined) {
            query.push(`${key}=${value}`);
        }
    });

    const url = `/report/${id}/workload-inventory?${query.join('&')}`;
    return ApiClient.get<SearchResult<ReportWorkloadInventory>>(url);
}
