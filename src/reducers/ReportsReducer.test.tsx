import { reportsReducer, initialState as systemInitialState } from './ReportsReducer';
import { ActionTypes } from '../actions/ReportActions';
import { successMessage, failureMessage, pendingMessage } from './reducerHelper';

import reportsMock, { reportMock } from './__fixtures__/reports';
import { GenericAction } from '../models/action';
import { ReportState, ObjectFetchStatus } from '../models/state';
import { Report } from '../models';

const defaultFetchStatus: ObjectFetchStatus = {
    error: null,
    status: 'none'
};

const reportTestInitialState: ReportState = {
    reports: {
        total: 1,
        items: [
            {
                id: 36,
                reportName: 'my report name 37',
                reportDescription: 'my report description 37',
                payloadName: 'file1.json',
                inserted: 546785214,
                lastUpdate: 546785214,
                status: 'IN_PROGRESS'
            }
        ]
    },
    reportsFetchStatus: { ...defaultFetchStatus },

    report: {
        id: 37,
        reportName: 'my report name 37',
        reportDescription: 'my report description 37',
        payloadName: 'file2.json',
        inserted: 546425465,
        lastUpdate: 546425465,
        status: 'IN_PROGRESS'
    },
    reportFetchStatus: { ...defaultFetchStatus },

    reportWorkloadSummary: null,
    reportWorkloadSummaryFetchStatus: { ...defaultFetchStatus },
    reportWorkloadsDetected: {
        total: 0,
        items: []
    },
    reportWorkloadsDetectedFetchStatus: { ...defaultFetchStatus },
    reportFlags: {
        total: 0,
        items: []
    },
    reportFlagsFetchStatus: { ...defaultFetchStatus },

    reportInitialSavingEstimation: null,
    reportInitialSavingEstimationFetchStatus: { ...defaultFetchStatus },

    reportWorkloadInventory: {
        total: 0,
        items: []
    },
    reportWorkloadInventoryFetchStatus: { ...defaultFetchStatus },
    reportWorkloadInventoryAllCSVFetchStatus: { ...defaultFetchStatus },
    reportWorkloadInventoryFilteredCSVFetchStatus: { ...defaultFetchStatus },
    reportWorkloadInventoryAvailableFilters: null,
    reportWorkloadInventoryAvailableFiltersFetchStatus: { ...defaultFetchStatus },

    reportPayloadDownloadLinkFetchStatus: { ...defaultFetchStatus }
};

const fromRequest = (type: string, payload: any, meta = {}) => ({
    type,
    payload,
    meta: { partial: false, ...meta }
});

describe('report reducer', () => {
    it('should return the default system state', () => {
        const initialState = undefined;
        const action = {} as GenericAction;

        expect(reportsReducer(initialState, action)).toEqual(systemInitialState);
    });

    it('should handle FETCH_REPORTS_PENDING', () => {
        const expectedNewState: ReportState = {
            ...reportTestInitialState,
            reportsFetchStatus: {
                error: null,
                status: 'inProgress'
            }
        };

        const newState: ReportState = reportsReducer(
            reportTestInitialState,
            fromRequest(pendingMessage(ActionTypes.FETCH_REPORTS), {})
        );

        expect(newState).toEqual(expectedNewState);
    });

    it('should handle FETCH_REPORT_PENDING', () => {
        const expectedNewState: ReportState = {
            ...reportTestInitialState,
            report: null,
            reportFetchStatus: {
                error: null,
                status: 'inProgress'
            }
        };

        const newState: ReportState = reportsReducer(
            reportTestInitialState,
            fromRequest(pendingMessage(ActionTypes.FETCH_REPORT), {})
        );

        expect(newState).toEqual(expectedNewState);
    });

    it('should handle FETCH_REPORTS_SUCCESS', () => {
        const total = 100;

        const expectedNewState: ReportState = {
            ...reportTestInitialState,
            reports: {
                total,
                items: reportsMock.data
            },
            reportsFetchStatus: {
                error: null,
                status: 'complete'
            }
        };

        const newState: ReportState = reportsReducer(
            reportTestInitialState,
            fromRequest(successMessage(ActionTypes.FETCH_REPORTS), {
                data: {
                    data: [...reportsMock.data],
                    meta: {
                        count: total
                    }
                }
            })
        );

        expect(newState).toEqual(expectedNewState);
    });

    it('should handle FETCH_REPORT_SUCCESS', () => {
        const testReport: Report = reportMock.data;

        const expectedNewState: ReportState = {
            ...reportTestInitialState,
            report: testReport,
            reportFetchStatus: {
                error: null,
                status: 'complete'
            }
        };

        const newState: ReportState = reportsReducer(
            reportTestInitialState,
            fromRequest(successMessage(ActionTypes.FETCH_REPORT), reportMock)
        );

        expect(newState).toEqual(expectedNewState);
    });

    it('should handle FETCH_REPORTS_FAILURE', () => {
        const error = 'my error message';

        const expectedNewState: ReportState = {
            ...reportTestInitialState,
            reports: {
                items: [],
                total: 0
            },
            reportsFetchStatus: {
                error,
                status: 'complete'
            }
        };
        const newState: ReportState = reportsReducer(
            reportTestInitialState,
            fromRequest(failureMessage(ActionTypes.FETCH_REPORTS), { message: error })
        );

        expect(newState).toEqual(expectedNewState);
    });

    it('should handle FETCH_REPORT_FAILURE', () => {
        const error = 'my error message';

        const expectedNewState: ReportState = {
            ...reportTestInitialState,
            report: null,
            reportFetchStatus: {
                error,
                status: 'complete'
            }
        };

        const newState: ReportState = reportsReducer(
            reportTestInitialState,
            fromRequest(failureMessage(ActionTypes.FETCH_REPORT), { message: error })
        );

        expect(newState).toEqual(expectedNewState);
    });
});
