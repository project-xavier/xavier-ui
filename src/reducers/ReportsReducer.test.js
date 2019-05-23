import { reportsReducer } from './ReportsReducer';
import {
    FETCH_REPORTS,
    FETCH_REPORT
} from '../actions/ReportActions';
import {
    successMessage,
    failureMessage,
    pendingMessage
} from './reducerHelper';

import reportsMock, { reportMock } from '../__fixtures__/reports';

const initialState = {
    error: null,
    loading: false
};

const fromRequest = (type, payload, meta: {}) => ({
    type,
    payload,
    meta: { partial: false, ...meta }
});

describe('report reducer', () => {
    const reportInitialState = {
        ...initialState,
        reports: []
    };

    it('should return the initial state', () => {
        expect(reportsReducer(undefined, {})).toEqual(reportInitialState);
    });

    it('should handle FETCH_REPORTS_PENDING', () => {
        const expectation = {
            ...reportInitialState,
            loading: true,
            error: null
        };
        const newState = reportsReducer(
            reportInitialState,
            fromRequest(pendingMessage(FETCH_REPORTS), {})
        );
        expect(newState).toEqual(expectation);
    });

    it('should handle FETCH_REPORT_PENDING', () => {
        const expectation = {
            ...reportInitialState,
            loading: true,
            error: null
        };
        const newState = reportsReducer(
            reportInitialState,
            fromRequest(pendingMessage(FETCH_REPORT), {})
        );
        expect(newState).toEqual(expectation);
    });

    it('should handle FETCH_REPORTS_SUCCESS', () => {
        const expectation = {
            ...reportInitialState,
            loading: false,
            reports: reportsMock.data,
            total: 3
        };
        const newState = reportsReducer(
            reportInitialState,
            fromRequest(successMessage(FETCH_REPORTS), reportsMock)
        );
        expect(newState).toEqual(expectation);
    });

    it('should handle FETCH_REPORT_SUCCESS', () => {
        let testReport = reportMock.data;

        const expectation = {
            ...reportInitialState,
            loading: false,
            report: testReport
        };
        const newState = reportsReducer(
            reportInitialState,
            fromRequest(successMessage(FETCH_REPORT), reportMock)
        );
        expect(newState).toEqual(expectation);
    });

    it('should handle FETCH_REPORTS_FAILURE', () => {
        const error = 'It broke';
        const newState = reportsReducer(
            reportInitialState,
            fromRequest(failureMessage(FETCH_REPORTS), { message: error })
        );
        expect(newState).toEqual({
            ...reportInitialState,
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
            loading: false,
            error
        });
    });

});
