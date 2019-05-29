import { getAllReports, getReportById } from '../api/report';
import { GenericAction } from '../models/action';

export const FETCH_REPORTS = 'FETCH_REPORTS';
export const FETCH_REPORT = 'FETCH_REPORT';

export const fetchReports = (): GenericAction  => ({
    type: FETCH_REPORTS,
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

export const fetchReport = (id: number): GenericAction => ({
    type: FETCH_REPORT,
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
