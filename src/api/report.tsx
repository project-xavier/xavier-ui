import { AxiosPromise } from 'axios';
import ApiClient from './apiClient';
import {
    Report,
    ReportWorkloadMigrationSummary as ReportWorkloadSummary,
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

export function getReportWokloadMigrationSummary(id: number): AxiosPromise<ReportWorkloadSummary> {
    return ApiClient.get<ReportWorkloadSummary>(`/report/${id}/workload-summary`);
}

export function getReportInitialSavingestimation(id: number): AxiosPromise<ReportInitialSavingEstimation> {
    return ApiClient.get<ReportInitialSavingEstimation>(`/report/${id}/initial-saving-estimation`);
}

export function getReportWorkloadInventory(
    id: number,
    page: number,
    perPage: number,
    orderBy: string,
    orderDirection: 'asc' | 'desc' | undefined
): AxiosPromise<SearchResult<ReportWorkloadInventory>> {
    // Using page-1 because the backend considers page 0 as the first one
    const params = {
        page: page - 1,
        size: perPage,
        orderBy,
        orderAsc: orderDirection ? orderDirection === 'asc' : undefined
    };
    const query: string[] = [];

    Object.keys(params).map(key => {
        const value = params[key];
        if (value !== undefined) {
            query.push(`${key}=${value}`);
        }
    });

    const url = `/report/${id}/workload-inventory?${query.join('&')}`;
    return ApiClient.get<SearchResult<ReportWorkloadInventory>>(url);
}

export function getReportWorkloadInventoryCSV(id: number): AxiosPromise<any> {
    const url = `/report/${id}/workload-inventory/csv`;
    return ApiClient.request<any>(url, null, 'get', {
        responseType: 'blob'
    });
}
