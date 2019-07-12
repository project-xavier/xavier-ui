import {
    reportsReducer,
    initialState as systemInitialState
} from './ReportsReducer';
import {
    ActionTypes
} from '../actions/ReportActions';
import {
    successMessage,
    failureMessage,
    pendingMessage
} from './reducerHelper';

import reportsMock, { reportMock } from './__fixtures__/reports';
import { GenericAction } from '../models/action';
import { ReportState, ObjectFetchStatus } from '../models/state';
import { Report } from '../models';

const defaultFetchStatus: ObjectFetchStatus = {
    error: null,
    status: "none"
};

const reportTestInitialState: ReportState = {
    reports: {
        total: 1,
        items: [
            {
                id: 36,
                customerId: '123456',
                fileName: 'file1.json',
                numberOfHosts: 254,
                totalDiskSpace: 5871365,
                totalPrice: 1200,
                creationDate: 546785214,
                analysisStatus: 'progress'
            }
        ]
    },
    reportsFetchStatus: { ...defaultFetchStatus },

    report: {
        id: 37,
        customerId: '654321',
        fileName: 'file2.json',
        numberOfHosts: 257,
        totalDiskSpace: 6546531,
        totalPrice: 100,
        creationDate: 546425465,
        analysisStatus: 'progress'
    },
    reportFetchStatus: { ...defaultFetchStatus },

    reportMigrationSummary: null,
    reportMigrationSummaryFetchStatus: { ...defaultFetchStatus },

    reportInitialSavingEstimation: null,
    reportInitialSavingEstimationFetchStatus: { ...defaultFetchStatus }
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
        
        expect(
            reportsReducer(initialState, action)
        ).toEqual(systemInitialState);
    });

    it('should handle FETCH_REPORTS_PENDING', () => {
        const expectedNewState: ReportState = {
            ...reportTestInitialState,
            reportsFetchStatus: {
                error: null,
                status: "inProgress"
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
                status: "inProgress"
            }
        };

        const newState: ReportState = reportsReducer(
            reportTestInitialState,
            fromRequest(pendingMessage(ActionTypes.FETCH_REPORT), {})
        );

        expect(newState).toEqual(expectedNewState);
    });

    it('should handle FETCH_REPORTS_SUCCESS', () => {
        const headers = {
            'x-total-count': 100
        };

        const expectedNewState: ReportState = {
            ...reportTestInitialState,
            reports: {
                total: headers["x-total-count"],
                items: reportsMock.data
            },
            reportsFetchStatus: {
                error: null,
                status: "complete"
            }
        };

        const newState: ReportState = reportsReducer(
            reportTestInitialState,
            fromRequest(successMessage(ActionTypes.FETCH_REPORTS), {
                ...reportsMock,
                headers
            })
        );

        expect(newState).toEqual(expectedNewState);
    });

    it('should handle FETCH_REPORT_SUCCESS', () => {
        let testReport: Report = reportMock.data;

        const expectedNewState: ReportState = {
            ...reportTestInitialState,
            report: testReport,
            reportFetchStatus: {
                error: null,
                status: "complete"
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
                status: "complete"
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
                status: "complete"
            }
        };

        const newState: ReportState = reportsReducer(
            reportTestInitialState,
            fromRequest(failureMessage(ActionTypes.FETCH_REPORT), { message: error })
        );

        expect(newState).toEqual(expectedNewState);
    });

});
