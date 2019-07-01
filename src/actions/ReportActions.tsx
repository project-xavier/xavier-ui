import {
    getAllReports,
    getReportById,
    deleteReport as destroyReport,
    getReportWokloadMigrationSummary,
    getReportInitialSavingestimation
} from '../api/report';
import { GenericAction } from '../models/action';

export const ActionTypes = {
    FETCH_REPORTS: 'FETCH_REPORTS',
    FETCH_REPORT: 'FETCH_REPORT',
    DELETE_REPORT: 'DELETE_REPORT',
    FETCH_REPORT_WORKLOAD_MIGRATION_SUMMARY: 'FETCH_REPORT_WORKLOAD_MIGRATION_SUMMARY',
    FETCH_REPORT_INITIAL_SAVING_ESTIMATION: 'FETCH_REPORT_INITIAL_SAVING_ESTIMATION',
    FETCH_REPORT_WOKLOAD_INVENTORY: 'FETCH_REPORT_WOKLOAD_INVENTORY'
};

/**
 * Fetchs reports
 */
export const fetchReports = (page: number, perPage: number, filterText: string): GenericAction  => {
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
                title: `Failed to load report ${ id }`
            }
        }
    }
});

export const deleteReport = (id: number, name: string): GenericAction => ({
    type: ActionTypes.DELETE_REPORT,
    payload: destroyReport(id).then(() => ({ id })),
    meta: {
        noError: true, // turns of automatic notification
        notifications: {
            rejected: {
                variant: 'danger',
                title: `Failed to delete report ${ name }`
            },
            fulfilled: {
                variant: 'success',
                title: `Report ${ name } deleted`
            }
        }
    }
});

export const fetchReportWorkloadMigrationSummary = (id: number): GenericAction => ({
    type: ActionTypes.FETCH_REPORT_WORKLOAD_MIGRATION_SUMMARY,
    payload: getReportWokloadMigrationSummary(id),
    meta: {
        notifications: {
            rejected: {
                variant: 'danger',
                title: `Failed to load report workload summary ${ id }`
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
                title: `Failed to load report saving estimation ${ id }`
            }
        }
    }
});

