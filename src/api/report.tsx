import { AxiosPromise } from 'axios';
import ApiClient from './apiClient';
import {
    Report,
    ReportWorkloadMigrationSummary,
    ReportInitialSavingEstimation,
    SearchReportResult
} from '../models';

export function getAllReports(page: number, perPage: number, filterText: string): AxiosPromise<SearchReportResult> {
    const params = { page, size: perPage, filterText };
    let query: string[] = [];

    Object.keys(params).map(function(key) {
        const value = params[key];
        if (value !== undefined) {
            query.push(`${ key }=${ value }`);
        }
    });

    const url = `/report?${ query.join('&') }`;
    return ApiClient.get<SearchReportResult>(url);
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
