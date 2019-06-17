import { getAllReports, getReportById } from '../api/report';
import { GenericAction } from '../models/action';

export const ActionTypes = {
    FETCH_REPORTS: 'FETCH_REPORTS',
    FETCH_REPORT: 'FETCH_REPORT'
};

/**
 * Fetchs reports
 */
export const fetchReports = (): GenericAction  => ({
    type: ActionTypes.FETCH_REPORTS,
    payload: getAllReports(),
    meta: {
        notifications: {
            rejected: {
                variant: 'danger',
                title: 'Failed to load reports'
            }
        }
    }
});

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
