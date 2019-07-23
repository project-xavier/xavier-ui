import {
    ActionTypes
} from '../actions/ReportActions';
import {
    pendingMessage,
    successMessage,
    failureMessage
} from './reducerHelper';
import { ReportState, ObjectFetchStatus } from '../models/state';
import { GenericAction } from '../models/action';

export const defaultFetchStatus: ObjectFetchStatus = {
    error: null,
    status: 'none'
};

export const initialState: ReportState = {
    report: null,
    reportFetchStatus: {
        ...defaultFetchStatus
    },

    reports: {
        total: 0,
        items: []
    },
    reportsFetchStatus: {
        ...defaultFetchStatus
    },

    reportMigrationSummary: null,
    reportMigrationSummaryFetchStatus: {
        ...defaultFetchStatus
    },

    reportInitialSavingEstimation: null,
    reportInitialSavingEstimationFetchStatus: {
        ...defaultFetchStatus
    },

    reportWorkloadInventory: null,
    reportWorkloadInventoryFetchStatus: {
        ...defaultFetchStatus
    }
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
                reportsFetchStatus: {
                    ...state.reportsFetchStatus,
                    error: null,
                    status: 'inProgress'
                }
            };
            return nextState;
        }

        case successMessage(ActionTypes.FETCH_REPORTS): {
            const nextState: ReportState = {
                ...state,
                reports: {
                    ...state.reports,
                    items: action.payload.data.content,
                    total: action.payload.data.totalElements
                },
                reportsFetchStatus: {
                    ...state.reportsFetchStatus,
                    error: null,
                    status: 'complete'
                }
            };
            return nextState;
        }

        case failureMessage(ActionTypes.FETCH_REPORTS): {
            const nextState: ReportState = {
                ...state,
                reports: {
                    ...state.reports,
                    items: [],
                    total: 0
                },
                reportsFetchStatus: {
                    ...state.reportsFetchStatus,
                    error: action.payload.message,
                    status: 'complete'
                }
            };
            return nextState;
        }

        // FETCH_REPORT single report
        case pendingMessage(ActionTypes.FETCH_REPORT): {
            const nextState: ReportState = {
                ...state,
                report: null,
                reportFetchStatus: {
                    ...state.reportFetchStatus,
                    error: null,
                    status: 'inProgress'
                }
            };

            return nextState;
        }

        case successMessage(ActionTypes.FETCH_REPORT): {
            const nextState: ReportState = {
                ...state,
                report: action.payload.data,
                reportFetchStatus: {
                    ...state.reportFetchStatus,
                    error: null,
                    status: 'complete'
                }
            };
            return nextState;
        }

        case failureMessage(ActionTypes.FETCH_REPORT): {
            const nextState: ReportState = {
                ...state,
                report: null,
                reportFetchStatus: {
                    ...state.reportFetchStatus,
                    error: action.payload.message,
                    status: 'complete'
                }
            };
            return nextState;
        }

        // DELETE_REPORT single report
        case successMessage(ActionTypes.DELETE_REPORT): {
            const nextState: ReportState = {
                ...state,
                reports: {
                    ...state.reports,
                    total: state.reports.total - 1,
                    items: state.reports.items.filter(r => r.id !== action.payload.id)
                }
            };
            return nextState;
        }

        case failureMessage(ActionTypes.DELETE_REPORT): {
            const nextState: ReportState = {
                ...state
            };
            return nextState;
        }

        // FETCH_REPORT_WORKLOAD_MIGRATION_SUMMARY single report
        case pendingMessage(ActionTypes.FETCH_REPORT_WORKLOAD_MIGRATION_SUMMARY): {
            const nextState: ReportState = {
                ...state,
                reportMigrationSummary: null,
                reportMigrationSummaryFetchStatus: {
                    ...state.reportMigrationSummaryFetchStatus,
                    error: null,
                    status: 'inProgress'
                }
            };

            return nextState;
        }

        case successMessage(ActionTypes.FETCH_REPORT_WORKLOAD_MIGRATION_SUMMARY): {
            const nextState: ReportState = {
                ...state,
                reportMigrationSummary: action.payload.data,
                reportMigrationSummaryFetchStatus: {
                    ...state.reportMigrationSummaryFetchStatus,
                    error: null,
                    status: 'complete'
                }
            };
            return nextState;
        }

        case failureMessage(ActionTypes.FETCH_REPORT_WORKLOAD_MIGRATION_SUMMARY): {
            const nextState: ReportState = {
                ...state,
                reportMigrationSummary: null,
                reportMigrationSummaryFetchStatus: {
                    ...state.reportMigrationSummaryFetchStatus,
                    error: action.payload.message,
                    status: 'complete'
                }
            };
            return nextState;
        }

        // FETCH_REPORT_INITIAL_SAVING_ESTIMATION single report
        case pendingMessage(ActionTypes.FETCH_REPORT_INITIAL_SAVING_ESTIMATION): {
            const nextState: ReportState = {
                ...state,
                reportInitialSavingEstimation: null,
                reportInitialSavingEstimationFetchStatus: {
                    ...state.reportInitialSavingEstimationFetchStatus,
                    error: null,
                    status: 'inProgress'
                }
            };

            return nextState;
        }

        case successMessage(ActionTypes.FETCH_REPORT_INITIAL_SAVING_ESTIMATION): {
            const nextState: ReportState = {
                ...state,
                reportInitialSavingEstimation: action.payload.data,
                reportInitialSavingEstimationFetchStatus: {
                    ...state.reportInitialSavingEstimationFetchStatus,
                    error: null,
                    status: 'complete'
                }
            };
            return nextState;
        }

        case failureMessage(ActionTypes.FETCH_REPORT_INITIAL_SAVING_ESTIMATION): {
            const nextState: ReportState = {
                ...state,
                reportInitialSavingEstimation: null,
                reportInitialSavingEstimationFetchStatus: {
                    ...state.reportInitialSavingEstimationFetchStatus,
                    error: action.payload.message,
                    status: 'complete'
                }
            };
            return nextState;
        }

        // FETCH_REPORT_WOKLOAD_INVENTORY single report
        case pendingMessage(ActionTypes.FETCH_REPORT_WOKLOAD_INVENTORY): {
            const nextState: ReportState = {
                ...state,
                reportWorkloadInventory: null,
                reportWorkloadInventoryFetchStatus: {
                    ...state.reportWorkloadInventoryFetchStatus,
                    error: null,
                    status: 'inProgress'
                }
            };

            return nextState;
        }

        case successMessage(ActionTypes.FETCH_REPORT_WOKLOAD_INVENTORY): {
            const nextState: ReportState = {
                ...state,
                reportWorkloadInventory: action.payload.data,
                reportWorkloadInventoryFetchStatus: {
                    ...state.reportWorkloadInventoryFetchStatus,
                    error: null,
                    status: 'complete'
                }
            };
            return nextState;
        }

        case failureMessage(ActionTypes.FETCH_REPORT_WOKLOAD_INVENTORY): {
            const nextState: ReportState = {
                ...state,
                reportWorkloadInventory: null,
                reportWorkloadInventoryFetchStatus: {
                    ...state.reportWorkloadInventoryFetchStatus,
                    error: action.payload.message,
                    status: 'complete'
                }
            };
            return nextState;
        }

        default:
            return state;
    }
};
