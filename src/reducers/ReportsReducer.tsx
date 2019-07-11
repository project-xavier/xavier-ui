import {
    ActionTypes
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
        // FETCH_REPORTS list of reports
        case pendingMessage(ActionTypes.FETCH_REPORTS): {
            const nextState: ReportState = {
                ...state,
                total: 0,
                reports: [],
                loading: true,
                error: null
            };
            return nextState;
        }

        case successMessage(ActionTypes.FETCH_REPORTS): {
            const nextState: ReportState = {
                ...state,
                total: action.payload.data.length,
                reports: action.payload.data,
                loading: false
            };
            return nextState;
        }

        case failureMessage(ActionTypes.FETCH_REPORTS): {
            const nextState: ReportState = {
                ...state,
                total: 0,
                reports: [],
                loading: false,
                error: action.payload.message
            };
            return nextState;
        }

        // FETCH_REPORT single report
        case pendingMessage(ActionTypes.FETCH_REPORT): {
            const nextState: ReportState = {
                ...state,
                report: null,
                loading: true,
                error: null
            };

            return nextState;
        }

        case successMessage(ActionTypes.FETCH_REPORT): {
            const nextState: ReportState = {
                ...state,
                report: action.payload.data,
                loading: false
            };
            return nextState;
        }

        case failureMessage(ActionTypes.FETCH_REPORT): {
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
