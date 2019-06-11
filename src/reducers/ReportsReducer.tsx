import {
    FETCH_REPORT,
    FETCH_REPORTS
} from '../actions/ReportActions';
import {
    pendingMessage,
    successMessage,
    failureMessage
} from './reducerHelper';
import { ReportState } from '../models/state';
import { GenericAction } from '../models/action';

export const initialState: ReportState = {
    error: null,
    total: 0,
    report: null,
    reports: [],
    loading: false
};

export const reportsReducer = function (
    state: ReportState = initialState,
    action: GenericAction
) {
    switch (action.type) {
        case pendingMessage(FETCH_REPORTS): {
            const nextState: ReportState = {
                ...state,
                total: 0,
                reports: [],
                loading: true,
                error: null
            };
            return nextState;
        }

        case successMessage(FETCH_REPORTS): {
            const nextState: ReportState = {
                ...state,
                total: action.payload.data.length,
                reports: action.payload.data,
                loading: false
            };
            return nextState;
        }

        case failureMessage(FETCH_REPORTS): {
            const nextState: ReportState = {
                ...state,
                total: 0,
                reports: [],
                loading: false,
                error: action.payload.message
            };
            return nextState;
        }

        case pendingMessage(FETCH_REPORT): {
            const nextState: ReportState = {
                ...state,
                report: null,
                loading: true,
                error: null
            };

            return nextState;
        }

        case successMessage(FETCH_REPORT): {
            const nextState: ReportState = {
                ...state,
                report: action.payload.data,
                loading: false
            };
            return nextState;
        }

        case failureMessage(FETCH_REPORT): {
            const nextState: ReportState = {
                ...state,
                report: null,
                loading: false,
                error: action.payload.message
            };
            return nextState;
        }

        default:
            return state;
    }
};
