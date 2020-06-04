import { AxiosPromise } from 'axios';
import ApiClient from './apiClient';
import {
    Report,
    ReportWorkloadSummary,
    ReportInitialSavingEstimation,
    SearchResult,
    ReportWorkloadInventory,
    WorkloadModel,
    FlagModel,
    WorkloadInventoryReportFiltersModel,
    PaginationResponse
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

export function getReportWokloadSummary(id: number): AxiosPromise<ReportWorkloadSummary> {
    return ApiClient.get<ReportWorkloadSummary>(`/report/${id}/workload-summary`);
}

export function getReportWorkloadsDetected(
    id: number,
    page: number,
    perPage: number,
    orderBy: string | undefined,
    orderDirection: 'asc' | 'desc' | undefined
): AxiosPromise<SearchResult<WorkloadModel>> {
    let sortBy = orderBy ? orderBy : undefined;
    if (sortBy && orderDirection) {
        sortBy = `${sortBy}:${orderDirection === 'asc' ? 'asc' : 'desc'}`
    }

    // Using page-1 because the backend considers page 0 as the first one
    const params = {
        offset: (page - 1) * perPage,
        limit: perPage,
        sort_by: sortBy
    };
    const query: string[] = [];

    Object.keys(params).map(key => {
        const value = params[key];
        if (value !== undefined) {
            query.push(`${key}=${value}`);
        }
    });

    const url = `/report/${id}/workload-summary/workloads?${query.join('&')}`;
    return ApiClient.get<SearchResult<WorkloadModel>>(url);
}

export function getReportFlags(
    id: number,
    page: number,
    perPage: number,
    orderBy: string | undefined,
    orderDirection: 'asc' | 'desc' | undefined
): AxiosPromise<SearchResult<FlagModel>> {
    let sortBy = orderBy ? orderBy : undefined;
    if (sortBy && orderDirection) {
        sortBy = `${sortBy}:${orderDirection === 'asc' ? 'asc' : 'desc'}`
    }

    const params = {
        offset: (page - 1) * perPage,
        limit: perPage,
        sort_by: sortBy
    };
    
    const query: string[] = [];

    Object.keys(params).map(key => {
        const value = params[key];
        if (value !== undefined) {
            query.push(`${key}=${value}`);
        }
    });

    const url = `/report/${id}/workload-summary/flags?${query.join('&')}`;
    return ApiClient.get<SearchResult<FlagModel>>(url);
}

export function getReportInitialSavingestimation(id: number): AxiosPromise<ReportInitialSavingEstimation> {
    return ApiClient.get<ReportInitialSavingEstimation>(`/report/${id}/initial-saving-estimation`);
}

export function getReportWorkloadInventory(
    id: number,
    page: number,
    perPage: number,
    orderBy: string | undefined,
    orderDirection: 'asc' | 'desc' | undefined,
    filters: Map<string, string[]>
): AxiosPromise<PaginationResponse<ReportWorkloadInventory>> {
    let sortBy = orderBy ? orderBy : undefined;
    if (sortBy && orderDirection) {
        sortBy = `${sortBy}:${orderDirection === 'asc' ? 'asc' : 'desc'}`
    }

    const params = {
        offset: (page - 1) * perPage,
        limit: perPage,
        sort_by: sortBy
    };

    const query: string[] = [];

    Object.keys(params).map(key => {
        const value = params[key];
        if (value !== undefined) {
            query.push(`${key}=${value}`);
        }
    });

    filters.forEach((arrayValue: string[], key: string) => {
        if (arrayValue.length > 0) {
            arrayValue.forEach(value => {
                query.push(`${key}=${value}`);
            });
        }
    });

    const url = `/report/${id}/workload-inventory?${query.join('&')}`;
    return ApiClient.get<PaginationResponse<ReportWorkloadInventory>>(url);
}

export function getReportWorkloadInventoryFilteredCSV(
    id: number,
    orderBy: string | undefined,
    orderDirection: 'asc' | 'desc' | undefined,
    filters: Map<string, string[]>
): AxiosPromise<any> {
    let sortBy = orderBy ? orderBy : undefined;
    if (sortBy && orderDirection) {
        sortBy = `${sortBy}:${orderDirection === 'asc' ? 'asc' : 'desc'}`
    }

    const params = {
        sort_by: sortBy
    };

    const query: string[] = [];

    Object.keys(params).map(key => {
        const value = params[key];
        if (value !== undefined) {
            query.push(`${key}=${value}`);
        }
    });

    filters.forEach((arrayValue: string[], key: string) => {
        if (arrayValue.length > 0) {
            arrayValue.forEach(value => {
                query.push(`${key}=${value}`);
            });
        }
    });

    const url = `/report/${id}/workload-inventory/filtered-csv?${query.join('&')}`;
    return ApiClient.request<any>(url, null, 'get', {
        responseType: 'blob'
    });
}

export function getReportWorkloadInventoryAllCSV(id: number): AxiosPromise<any> {
    const url = `/report/${id}/workload-inventory/csv`;
    return ApiClient.request<any>(url, null, 'get', {
        responseType: 'blob'
    });
}

export function getReportWorkloadInventoryAvailableFilters(
    id: number
): AxiosPromise<WorkloadInventoryReportFiltersModel> {
    return ApiClient.get<WorkloadInventoryReportFiltersModel>(`/report/${id}/workload-inventory/available-filters`);
}

export function getReportPayloadDownloadLink(id: number): AxiosPromise<string> {
    const url = `/report/${id}/payload-link`;
    return ApiClient.get<string>(url);
}
