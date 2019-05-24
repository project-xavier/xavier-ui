import {
    FETCH_REPORT,
    FETCH_REPORTS
} from '../actions/ReportActions';
import {
    pendingMessage,
    successMessage,
    failureMessage,
    initialStateFor
} from './reducerHelper';

export const reportsReducer = function (state = initialStateFor('reports', []), action) {
    switch (action.type) {
        case pendingMessage(FETCH_REPORTS):
            return {
                ...state,
                reports: [],
                loading: true,
                error: null
            };

        case successMessage(FETCH_REPORTS):
            return {
                ...state,
                reports: action.payload.data,
                loading: false,
                error: null,
                total: action.payload.data.length
            };

        case failureMessage(FETCH_REPORTS):
            return {
                ...state,
                reports: [],
                loading: false,
                error: action.payload.message
            };

        case pendingMessage(FETCH_REPORT):
            return {
                ...state,
                loading: true,
                error: null
            };

        case successMessage(FETCH_REPORT):
            return {
                ...state,
                loading: false,
                error: null,
                report: action.payload.data
            };

        case failureMessage(FETCH_REPORT):
            return {
                ...state,
                loading: false,
                error: action.payload.message
            };

        default:
            return state;
    }
};
