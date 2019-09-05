import { ActionTypes } from '../actions/MappingsActions';
import { pendingMessage, successMessage, failureMessage } from './reducerHelper';
import { FetchStatus, MappingsState, ObjectFetchStatus } from '../models/state';
import { GenericAction } from '../models/action';

export const defaultFetchStatus: ObjectFetchStatus = {
    error: null,
    status: 'none'
};

const defaultState: MappingsState = {
    flagAssessment: {
        byFlag: new Map(),
        fetchStatus: new Map(),
        errors: new Map(),
        allFlags: [],
        allFlagsFetchStatus: { ...defaultFetchStatus }
    }
};

export const mappingsReducer = (state: MappingsState = defaultState, action: GenericAction) => {
    switch (action.type) {
        //
        case pendingMessage(ActionTypes.FETCH_FLAG_ASSESSMENT): {
            const nextState: MappingsState = {
                ...state,
                flagAssessment: {
                    ...state.flagAssessment,
                    fetchStatus: new Map(state.flagAssessment.fetchStatus).set(action.meta.flag, FetchStatus.inProgress)
                }
            };

            return nextState;
        }

        case successMessage(ActionTypes.FETCH_FLAG_ASSESSMENT): {
            const nextState: MappingsState = {
                ...state,
                flagAssessment: {
                    ...state.flagAssessment,
                    fetchStatus: new Map(state.flagAssessment.fetchStatus).set(action.meta.flag, FetchStatus.complete),
                    byFlag: new Map(state.flagAssessment.byFlag).set(action.meta.flag, {
                        ...action.payload.data,
                        timeRequested: Date.now()
                    }),
                    errors: new Map(state.flagAssessment.errors).set(action.meta.flag, null)
                }
            };

            return nextState;
        }

        case failureMessage(ActionTypes.FETCH_FLAG_ASSESSMENT): {
            const nextState: MappingsState = {
                ...state,
                flagAssessment: {
                    ...state.flagAssessment,
                    fetchStatus: new Map(state.flagAssessment.fetchStatus).set(action.meta.flag, FetchStatus.complete),
                    errors: new Map(state.flagAssessment.errors).set(action.meta.flag, action.payload)
                }
            };

            return nextState;
        }

        //
        case pendingMessage(ActionTypes.FETCH_ALL_FLAG_ASSESSMENT): {
            const nextState: MappingsState = {
                ...state,
                flagAssessment: {
                    ...state.flagAssessment,
                    allFlagsFetchStatus: {
                        status: 'inProgress',
                        error: null
                    }
                }
            };

            return nextState;
        }

        case successMessage(ActionTypes.FETCH_ALL_FLAG_ASSESSMENT): {
            const nextState: MappingsState = {
                ...state,
                flagAssessment: {
                    ...state.flagAssessment,
                    allFlags: action.payload.data,
                    allFlagsFetchStatus: {
                        status: 'complete',
                        error: null
                    }
                }
            };

            return nextState;
        }

        case failureMessage(ActionTypes.FETCH_ALL_FLAG_ASSESSMENT): {
            const nextState: MappingsState = {
                ...state,
                flagAssessment: {
                    ...state.flagAssessment,
                    allFlags: [],
                    allFlagsFetchStatus: {
                        status: 'complete',
                        error: action.payload.message
                    }
                }
            };

            return nextState;
        }

        default:
            return state;
    }
};
