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
                // reports: [],
                // total: 0, // To avoid causing flash render in reportList page
                loading: true,
                error: null
            };
            return nextState;
        }

        case successMessage(ActionTypes.FETCH_REPORTS): {
            const nextState: ReportState = {
                ...state,
                total: parseInt(action.payload.headers['x-total-count']),
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

        // DELETE_REPORT single report
        case successMessage(ActionTypes.DELETE_REPORT): {
            const nextState: ReportState = {
                ...state,
                reports: state.reports.filter(r => r.id !== action.payload.id),
                total: state.total - 1
            };
            return nextState;
        }

        case failureMessage(ActionTypes.DELETE_REPORT): {
            const nextState: ReportState = {
                ...state,
                error: action.payload.message
            };
            return nextState;
        }

        // FETCH_REPORT_WORKLOAD_MIGRATION_SUMMARY single report
        case pendingMessage(ActionTypes.FETCH_REPORT_WORKLOAD_MIGRATION_SUMMARY): {
            const nextState: ReportState = {
                ...state,
                reportMigrationSummary: null,
                loading: true,
                error: null
            };

            return nextState;
        }

        case successMessage(ActionTypes.FETCH_REPORT_WORKLOAD_MIGRATION_SUMMARY): {
            const nextState: ReportState = {
                ...state,
                reportMigrationSummary: action.payload.data,
                loading: false
            };
            return nextState;
        }

        case failureMessage(ActionTypes.FETCH_REPORT_WORKLOAD_MIGRATION_SUMMARY): {
            const nextState: ReportState = {
                ...state,
                reportMigrationSummary: null,
                loading: false,
                error: action.payload.message
            };
            return nextState;
        }

        // FETCH_REPORT_INITIAL_SAVING_ESTIMATION single report
        case pendingMessage(ActionTypes.FETCH_REPORT_INITIAL_SAVING_ESTIMATION): {
            const nextState: ReportState = {
                ...state,
                reportInitialSavingEstimation: null,
                loading: true,
                error: null
            };

            return nextState;
        }

        case successMessage(ActionTypes.FETCH_REPORT_INITIAL_SAVING_ESTIMATION): {
            const nextState: ReportState = {
                ...state,
                reportInitialSavingEstimation: action.payload.data,
                loading: false
            };
            return nextState;
        }

        case failureMessage(ActionTypes.FETCH_REPORT_INITIAL_SAVING_ESTIMATION): {
            const nextState: ReportState = {
                ...state,
                reportInitialSavingEstimation: null,
                loading: false,
                error: action.payload.message
            };
            return nextState;
        }

        default:
            return state;
    }
};
