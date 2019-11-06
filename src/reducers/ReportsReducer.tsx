import { ActionTypes } from '../actions/ReportActions';
import { pendingMessage, successMessage, failureMessage } from './reducerHelper';
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

    reportWorkloadSummary: null,
    reportWorkloadSummaryFetchStatus: {
        ...defaultFetchStatus
    },
    reportWorkloadsDetected: {
        total: 0,
        items: []
    },
    reportWorkloadsDetectedFetchStatus: {
        ...defaultFetchStatus
    },
    reportFlags: {
        total: 0,
        items: []
    },
    reportFlagsFetchStatus: {
        ...defaultFetchStatus
    },

    reportInitialSavingEstimation: null,
    reportInitialSavingEstimationFetchStatus: {
        ...defaultFetchStatus
    },

    reportWorkloadInventory: {
        total: 0,
        items: []
    },
    reportWorkloadInventoryFetchStatus: {
        ...defaultFetchStatus
    },
    reportWorkloadInventoryAllCSVFetchStatus: {
        ...defaultFetchStatus
    },
    reportWorkloadInventoryFilteredCSVFetchStatus: {
        ...defaultFetchStatus
    },
    reportWorkloadInventoryAvailableFilters: null,
    reportWorkloadInventoryAvailableFiltersFetchStatus: {
        ...defaultFetchStatus
    }
};

export const reportsReducer = (state: ReportState = initialState, action: GenericAction) => {
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

        // FETCH_REPORT_WORKLOAD_SUMMARY single report
        case pendingMessage(ActionTypes.FETCH_REPORT_WORKLOAD_SUMMARY): {
            const nextState: ReportState = {
                ...state,
                reportWorkloadSummaryFetchStatus: {
                    ...state.reportWorkloadSummaryFetchStatus,
                    error: null,
                    status: 'inProgress'
                }
            };

            return nextState;
        }

        case successMessage(ActionTypes.FETCH_REPORT_WORKLOAD_SUMMARY): {
            const nextState: ReportState = {
                ...state,
                reportWorkloadSummary: action.payload.data,
                reportWorkloadSummaryFetchStatus: {
                    ...state.reportWorkloadSummaryFetchStatus,
                    error: null,
                    status: 'complete'
                }
            };
            return nextState;
        }

        case failureMessage(ActionTypes.FETCH_REPORT_WORKLOAD_SUMMARY): {
            const nextState: ReportState = {
                ...state,
                reportWorkloadSummary: null,
                reportWorkloadSummaryFetchStatus: {
                    ...state.reportWorkloadSummaryFetchStatus,
                    error: action.payload.message,
                    status: 'complete'
                }
            };
            return nextState;
        }

        // FETCH_REPORT_WORKLOADS_DETECTED single report
        case pendingMessage(ActionTypes.FETCH_REPORT_WORKLOADS_DETECTED): {
            const nextState: ReportState = {
                ...state,
                reportWorkloadsDetectedFetchStatus: {
                    ...state.reportWorkloadsDetectedFetchStatus,
                    error: null,
                    status: 'inProgress'
                }
            };

            return nextState;
        }

        case successMessage(ActionTypes.FETCH_REPORT_WORKLOADS_DETECTED): {
            const nextState: ReportState = {
                ...state,
                reportWorkloadsDetected: {
                    ...state.reportWorkloadsDetected,
                    items: action.payload.data.content,
                    total: action.payload.data.totalElements
                },
                reportWorkloadsDetectedFetchStatus: {
                    ...state.reportWorkloadsDetectedFetchStatus,
                    error: null,
                    status: 'complete'
                }
            };
            return nextState;
        }

        case failureMessage(ActionTypes.FETCH_REPORT_WORKLOADS_DETECTED): {
            const nextState: ReportState = {
                ...state,
                reportWorkloadsDetected: {
                    ...state.reportWorkloadsDetected,
                    items: [],
                    total: 0
                },
                reportWorkloadsDetectedFetchStatus: {
                    ...state.reportWorkloadsDetectedFetchStatus,
                    error: action.payload.message,
                    status: 'complete'
                }
            };
            return nextState;
        }

        // FETCH_REPORT_FLAGS single report
        case pendingMessage(ActionTypes.FETCH_REPORT_FLAGS): {
            const nextState: ReportState = {
                ...state,
                reportFlagsFetchStatus: {
                    ...state.reportFlagsFetchStatus,
                    error: null,
                    status: 'inProgress'
                }
            };

            return nextState;
        }

        case successMessage(ActionTypes.FETCH_REPORT_FLAGS): {
            const nextState: ReportState = {
                ...state,
                reportFlags: {
                    ...state.reportFlags,
                    items: action.payload.data.content,
                    total: action.payload.data.totalElements
                },
                reportFlagsFetchStatus: {
                    ...state.reportFlagsFetchStatus,
                    error: null,
                    status: 'complete'
                }
            };
            return nextState;
        }

        case failureMessage(ActionTypes.FETCH_REPORT_FLAGS): {
            const nextState: ReportState = {
                ...state,
                reportFlags: {
                    ...state.reportFlags,
                    items: [],
                    total: 0
                },
                reportFlagsFetchStatus: {
                    ...state.reportFlagsFetchStatus,
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
                reportWorkloadInventory: {
                    ...state.reportWorkloadInventory,
                    items: action.payload.data.content,
                    total: action.payload.data.totalElements
                },
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
                reportWorkloadInventory: {
                    ...state.reportWorkloadInventory,
                    items: [],
                    total: 0
                },
                reportWorkloadInventoryFetchStatus: {
                    ...state.reportWorkloadInventoryFetchStatus,
                    error: action.payload.message,
                    status: 'complete'
                }
            };
            return nextState;
        }

        // FETCH_REPORT_WOKLOAD_INVENTORY_ALL_CSV single report
        case pendingMessage(ActionTypes.FETCH_REPORT_WOKLOAD_INVENTORY_ALL_CSV): {
            const nextState: ReportState = {
                ...state,
                reportWorkloadInventoryAllCSVFetchStatus: {
                    ...state.reportWorkloadInventoryAllCSVFetchStatus,
                    error: null,
                    status: 'inProgress'
                }
            };

            return nextState;
        }

        case successMessage(ActionTypes.FETCH_REPORT_WOKLOAD_INVENTORY_ALL_CSV): {
            const nextState: ReportState = {
                ...state,
                reportWorkloadInventoryAllCSVFetchStatus: {
                    ...state.reportWorkloadInventoryAllCSVFetchStatus,
                    error: null,
                    status: 'complete'
                }
            };
            return nextState;
        }

        case failureMessage(ActionTypes.FETCH_REPORT_WOKLOAD_INVENTORY_ALL_CSV): {
            const nextState: ReportState = {
                ...state,
                reportWorkloadInventoryAllCSVFetchStatus: {
                    ...state.reportWorkloadInventoryAllCSVFetchStatus,
                    error: action.payload.message,
                    status: 'complete'
                }
            };
            return nextState;
        }

        // FETCH_REPORT_WOKLOAD_INVENTORY_FILTERED_CSV single report
        case pendingMessage(ActionTypes.FETCH_REPORT_WOKLOAD_INVENTORY_FILTERED_CSV): {
            const nextState: ReportState = {
                ...state,
                reportWorkloadInventoryFilteredCSVFetchStatus: {
                    ...state.reportWorkloadInventoryFilteredCSVFetchStatus,
                    error: null,
                    status: 'inProgress'
                }
            };

            return nextState;
        }

        case successMessage(ActionTypes.FETCH_REPORT_WOKLOAD_INVENTORY_FILTERED_CSV): {
            const nextState: ReportState = {
                ...state,
                reportWorkloadInventoryFilteredCSVFetchStatus: {
                    ...state.reportWorkloadInventoryFilteredCSVFetchStatus,
                    error: null,
                    status: 'complete'
                }
            };
            return nextState;
        }

        case failureMessage(ActionTypes.FETCH_REPORT_WOKLOAD_INVENTORY_FILTERED_CSV): {
            const nextState: ReportState = {
                ...state,
                reportWorkloadInventoryFilteredCSVFetchStatus: {
                    ...state.reportWorkloadInventoryFilteredCSVFetchStatus,
                    error: action.payload.message,
                    status: 'complete'
                }
            };
            return nextState;
        }

        // FETCH_REPORT_WOKLOAD_INVENTORY_AVAILABLE_FILTERS
        case pendingMessage(ActionTypes.FETCH_REPORT_WOKLOAD_INVENTORY_AVAILABLE_FILTERS): {
            const nextState: ReportState = {
                ...state,
                reportWorkloadInventoryAvailableFilters: null,
                reportWorkloadInventoryAvailableFiltersFetchStatus: {
                    ...state.reportWorkloadInventoryAvailableFiltersFetchStatus,
                    error: null,
                    status: 'inProgress'
                }
            };

            return nextState;
        }

        case successMessage(ActionTypes.FETCH_REPORT_WOKLOAD_INVENTORY_AVAILABLE_FILTERS): {
            const nextState: ReportState = {
                ...state,
                reportWorkloadInventoryAvailableFilters: action.payload.data,
                reportWorkloadInventoryAvailableFiltersFetchStatus: {
                    ...state.reportWorkloadInventoryAvailableFiltersFetchStatus,
                    error: null,
                    status: 'complete'
                }
            };
            return nextState;
        }

        case failureMessage(ActionTypes.FETCH_REPORT_WOKLOAD_INVENTORY_AVAILABLE_FILTERS): {
            const nextState: ReportState = {
                ...state,
                reportWorkloadInventoryAvailableFilters: null,
                reportWorkloadInventoryAvailableFiltersFetchStatus: {
                    ...state.reportWorkloadInventoryAvailableFiltersFetchStatus,
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
