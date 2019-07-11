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
import { ReportState } from '../models/state';
import { Report } from '../models';

const reportInitialState: ReportState = {
    error: 'my error',
    loading: false,
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

    it('should return the default state', () => {
        const initialState: ReportState = undefined;
        const action = {} as GenericAction;
        
        expect(
            reportsReducer(initialState, action)
        ).toEqual(systemInitialState);
    });

    it('should return the previous state', () => {
        const initialState: ReportState = {
            error: 'my error',
            total: 90,
            report: null,
            reports: [],
            loading: true
        };
        const action = {} as GenericAction;
        
        expect(
            reportsReducer(initialState, action)
        ).toEqual(initialState);
    });

    it('should handle FETCH_REPORTS_PENDING', () => {
        const expectedNewState: ReportState = {
            ...reportInitialState,
            total: 0,
            reports: [],
            loading: true,
            error: null
        };
        const newState: ReportState = reportsReducer(
            reportInitialState,
            fromRequest(pendingMessage(ActionTypes.FETCH_REPORTS), {})
        );
        expect(newState).toEqual(expectedNewState);
    });

    it('should handle FETCH_REPORT_PENDING', () => {
        const expectedNewState: ReportState = {
            ...reportInitialState,
            report: null,
            loading: true,
            error: null
        };
        const newState: ReportState = reportsReducer(
            reportInitialState,
            fromRequest(pendingMessage(ActionTypes.FETCH_REPORT), {})
        );
        expect(newState).toEqual(expectedNewState);
    });

    it('should handle FETCH_REPORTS_SUCCESS', () => {
        const expectedNewState: ReportState = {
            ...reportInitialState,
            loading: false,
            reports: reportsMock.data,
            total: 3
        };
        const newState: ReportState = reportsReducer(
            reportInitialState,
            fromRequest(successMessage(ActionTypes.FETCH_REPORTS), reportsMock)
        );
        expect(newState).toEqual(expectedNewState);
    });

    it('should handle FETCH_REPORT_SUCCESS', () => {
        let testReport: Report = reportMock.data;

        const expectedNewState: ReportState = {
            ...reportInitialState,
            loading: false,
            report: testReport
        };
        const newState: ReportState = reportsReducer(
            reportInitialState,
            fromRequest(successMessage(ActionTypes.FETCH_REPORT), reportMock)
        );
        expect(newState).toEqual(expectedNewState);
    });

    it('should handle FETCH_REPORTS_FAILURE', () => {
        const error = 'It broke';
        
        const expectedNewState: ReportState = {
            ...reportInitialState,
            total: 0,
            reports: [],
            loading: false,
            error
        };
        const newState: ReportState = reportsReducer(
            reportInitialState,
            fromRequest(failureMessage(ActionTypes.FETCH_REPORTS), { message: error })
        );

        expect(newState).toEqual(expectedNewState);
    });

    it('should handle FETCH_REPORT_FAILURE', () => {
        const error = 'It broke';

        const expectedNewState: ReportState = {
            ...reportInitialState,
            report: null,
            loading: false,
            error
        };
        const newState: ReportState = reportsReducer(
            reportInitialState,
            fromRequest(failureMessage(ActionTypes.FETCH_REPORT), { message: error })
        );
        expect(newState).toEqual(expectedNewState);
    });

});
