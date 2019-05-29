import {
    reportsReducer,
    reportInitialState as systemInitialState
} from './ReportsReducer';
import {
    FETCH_REPORTS,
    FETCH_REPORT
} from '../actions/ReportActions';
import {
    successMessage,
    failureMessage,
    pendingMessage
} from './reducerHelper';

import reportsMock, { reportMock } from './__fixtures__/reports';
import { GenericAction } from '../models/action';
import { ReportState } from '../models/state';

const initialState = {
    error: null,
    loading: false
};

const reportInitialState: ReportState = {
    ...initialState,
    total: 1,
    reports: [
        {
            id: 36,
            customerId: '123456',
            fileName: 'file1.json',
            numberOfHosts: 254,
            totalDiskSpace: 5871365,
            totalPrice: 1200,
            creationDate: 546785214
        }
    ],
    report: {
        id: 37,
        customerId: '654321',
        fileName: 'file2.json',
        numberOfHosts: 257,
        totalDiskSpace: 6546531,
        totalPrice: 100,
        creationDate: 546425465
    }
};

const fromRequest = (type: string, payload: any, meta = {}) => ({
    type,
    payload,
    meta: { partial: false, ...meta }
});

describe('report reducer', () => {

    it('should return the initial state', () => {
        const initialState = undefined;
        const action = {} as GenericAction;
        
        expect(
            reportsReducer(initialState, action)
        ).toEqual(systemInitialState);
    });

    it('should handle FETCH_REPORTS_PENDING', () => {
        const expectedNewState = {
            ...reportInitialState,
            total: 0,
            reports: [],
            loading: true,
            error: null
        };
        const newState = reportsReducer(
            reportInitialState,
            fromRequest(pendingMessage(FETCH_REPORTS), {})
        );
        expect(newState).toEqual(expectedNewState);
    });

    it('should handle FETCH_REPORT_PENDING', () => {
        const expectedNewState = {
            ...reportInitialState,
            report: null,
            loading: true,
            error: null
        };
        const newState = reportsReducer(
            reportInitialState,
            fromRequest(pendingMessage(FETCH_REPORT), {})
        );
        expect(newState).toEqual(expectedNewState);
    });

    it('should handle FETCH_REPORTS_SUCCESS', () => {
        const expectedNewState = {
            ...reportInitialState,
            loading: false,
            reports: reportsMock.data,
            total: 3
        };
        const newState = reportsReducer(
            reportInitialState,
            fromRequest(successMessage(FETCH_REPORTS), reportsMock)
        );
        expect(newState).toEqual(expectedNewState);
    });

    it('should handle FETCH_REPORT_SUCCESS', () => {
        let testReport = reportMock.data;

        const expectedNewState = {
            ...reportInitialState,
            loading: false,
            report: testReport
        };
        const newState = reportsReducer(
            reportInitialState,
            fromRequest(successMessage(FETCH_REPORT), reportMock)
        );
        expect(newState).toEqual(expectedNewState);
    });

    it('should handle FETCH_REPORTS_FAILURE', () => {
        const error = 'It broke';
        const newState = reportsReducer(
            reportInitialState,
            fromRequest(failureMessage(FETCH_REPORTS), { message: error })
        );
        expect(newState).toEqual({
            ...reportInitialState,
            total: 0,
            reports: [],
            loading: false,
            error
        });
    });

    it('should handle FETCH_REPORT_FAILURE', () => {
        const error = 'It broke';
        const newState = reportsReducer(
            reportInitialState,
            fromRequest(failureMessage(FETCH_REPORT), { message: error })
        );
        expect(newState).toEqual({
            ...reportInitialState,
            report: null,
            loading: false,
            error
        });
    });

});
