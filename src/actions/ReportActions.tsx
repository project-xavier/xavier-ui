import {
    getAllReports,
    getReportById,
    deleteReport as destroyReport,
    getReportWokloadSummary,
    getReportWorkloadsDetected,
    getReportFlags,
    getReportInitialSavingestimation,
    getReportWorkloadInventory,
    getReportWorkloadInventoryCSV,
    getReportWorkloadInventoryAvailableFilters,
    getReportPayloadFile
} from '../api/report';
import { GenericAction } from '../models/action';

export const ActionTypes = {
    FETCH_REPORTS: 'FETCH_REPORTS',
    FETCH_REPORT: 'FETCH_REPORT',
    DELETE_REPORT: 'DELETE_REPORT',
    FETCH_REPORT_WORKLOAD_SUMMARY: 'FETCH_REPORT_WORKLOAD_SUMMARY',
    FETCH_REPORT_WORKLOADS_DETECTED: 'FETCH_REPORT_WORKLOADS_DETECTED',
    FETCH_REPORT_FLAGS: 'FETCH_REPORT_FLAGS',
    FETCH_REPORT_INITIAL_SAVING_ESTIMATION: 'FETCH_REPORT_INITIAL_SAVING_ESTIMATION',
    FETCH_REPORT_WOKLOAD_INVENTORY: 'FETCH_REPORT_WOKLOAD_INVENTORY',
    FETCH_REPORT_WOKLOAD_INVENTORY_CSV: 'FETCH_REPORT_WOKLOAD_INVENTORY_CSV',
    FETCH_REPORT_WOKLOAD_INVENTORY_AVAILABLE_FILTERS: 'FETCH_REPORT_WOKLOAD_INVENTORY_AVAILABLE_FILTERS',
    FETCH_REPORT_PAYLOAD_FILE: 'FETCH_REPORT_PAYLOAD_FILE'
};

/**
 * Fetchs reports
 */
export const fetchReports = (page: number, perPage: number, filterText: string): GenericAction => {
    return {
        type: ActionTypes.FETCH_REPORTS,
        payload: getAllReports(page, perPage, filterText),
        meta: {
            notifications: {
                rejected: {
                    variant: 'danger',
                    title: 'Failed to load reports'
                }
            }
        }
    };
};

/**
 * Fetchs a single report
 * @param id report ID
 */
export const fetchReport = (id: number): GenericAction => ({
    type: ActionTypes.FETCH_REPORT,
    payload: getReportById(id),
    meta: {
        notifications: {
            rejected: {
                variant: 'danger',
                title: `Failed to load report ${id}`
            }
        }
    }
});

export const deleteReport = (id: number, name: string): GenericAction => ({
    type: ActionTypes.DELETE_REPORT,
    payload: destroyReport(id).then(() => ({ id })),
    meta: {
        notifications: {
            rejected: {
                variant: 'danger',
                title: `Failed to delete report ${name}`
            },
            fulfilled: {
                variant: 'success',
                title: `Report ${name} deleted`
            }
        }
    }
});

export const fetchReportWorkloadSummary = (id: number): GenericAction => ({
    type: ActionTypes.FETCH_REPORT_WORKLOAD_SUMMARY,
    payload: getReportWokloadSummary(id),
    meta: {
        notifications: {
            rejected: {
                variant: 'danger',
                title: `Failed to load report workload summary ${id}`
            }
        }
    }
});

export const fetchReportWorkloadsDetected = (
    id: number,
    page: number,
    perPage: number,
    orderBy: string,
    orderDirection: 'asc' | 'desc' | undefined
): GenericAction => ({
    type: ActionTypes.FETCH_REPORT_WORKLOADS_DETECTED,
    payload: getReportWorkloadsDetected(id, page, perPage, orderBy, orderDirection),
    meta: {
        notifications: {
            rejected: {
                variant: 'danger',
                title: `Failed to load report workloads detected ${id}`
            }
        }
    }
});

export const fetchReportFlags = (
    id: number,
    page: number,
    perPage: number,
    orderBy: string,
    orderDirection: 'asc' | 'desc' | undefined
): GenericAction => ({
    type: ActionTypes.FETCH_REPORT_FLAGS,
    payload: getReportFlags(id, page, perPage, orderBy, orderDirection),
    meta: {
        notifications: {
            rejected: {
                variant: 'danger',
                title: `Failed to load report flags ${id}`
            }
        }
    }
});

export const fetchReportInitialSavingEstimation = (id: number): GenericAction => ({
    type: ActionTypes.FETCH_REPORT_INITIAL_SAVING_ESTIMATION,
    payload: getReportInitialSavingestimation(id),
    meta: {
        notifications: {
            rejected: {
                variant: 'danger',
                title: `Failed to load report saving estimation ${id}`
            }
        }
    }
});

export const fetchReportWorkloadInventory = (
    id: number,
    page: number,
    perPage: number,
    orderBy: string,
    orderDirection: 'asc' | 'desc' | undefined,
    filters: Map<string, string[]>
): GenericAction => ({
    type: ActionTypes.FETCH_REPORT_WOKLOAD_INVENTORY,
    payload: getReportWorkloadInventory(id, page, perPage, orderBy, orderDirection, filters),
    meta: {
        notifications: {
            rejected: {
                variant: 'danger',
                title: `Failed to load report workload inventory ${id}`
            }
        }
    }
});

export const fetchReportWorkloadInventoryCSV = (id: number): GenericAction => ({
    type: ActionTypes.FETCH_REPORT_WOKLOAD_INVENTORY_CSV,
    payload: getReportWorkloadInventoryCSV(id),
    meta: {
        notifications: {
            rejected: {
                variant: 'danger',
                title: `Failed to load report workload inventory ${id}`
            }
        }
    }
});

export const fetchReportWorkloadInventoryAvailableFilters = (id: number): GenericAction => ({
    type: ActionTypes.FETCH_REPORT_WOKLOAD_INVENTORY_AVAILABLE_FILTERS,
    payload: getReportWorkloadInventoryAvailableFilters(id),
    meta: {
        notifications: {
            rejected: {
                variant: 'danger',
                title: `Failed to load report workload inventory filters ${id}`
            }
        }
    }
});

export const fetchReportPayloadFile = (id: number): GenericAction => ({
    type: ActionTypes.FETCH_REPORT_PAYLOAD_FILE,
    payload: getReportPayloadFile(id),
    meta: {
        notifications: {
            rejected: {
                variant: 'danger',
                title: `Failed to fetch report ${id} payload file`
            }
        }
    }
});
