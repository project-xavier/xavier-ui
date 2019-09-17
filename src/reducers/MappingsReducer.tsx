import { ActionTypes } from '../actions/MappingsActions';
import { pendingMessage, successMessage, failureMessage } from './reducerHelper';
import { MappingsState, ObjectFetchStatus } from '../models/state';
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
