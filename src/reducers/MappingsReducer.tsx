import { ActionTypes } from '../actions/MappingsActions';
import { pendingMessage, successMessage, failureMessage } from './reducerHelper';
import { FetchStatus, MappingsState } from '../models/state';
import { GenericAction } from '../models/action';
  
const defaultState: MappingsState = {
    flagAssessment: {
        byFlag: new Map(),
        fetchStatus: new Map(),
        errors: new Map(),
    }
};

export const mappingsReducer = (state: MappingsState = defaultState, action: GenericAction) => {
    switch (action.type) {
        case pendingMessage(ActionTypes.FETCH_FLAG_ASSESSMENT): {
            const nextState: MappingsState = {
                ...state,
                flagAssessment: {
                    ...state.flagAssessment,
                    fetchStatus: new Map(state.flagAssessment.fetchStatus).set(
                        action.meta.flag,
                        FetchStatus.inProgress
                    )
                }
            };

            return nextState;
        }

        case successMessage(ActionTypes.FETCH_FLAG_ASSESSMENT): {
            const nextState: MappingsState = {
                ...state,
                flagAssessment: {
                    ...state.flagAssessment,
                    fetchStatus: new Map(state.flagAssessment.fetchStatus).set(
                        action.meta.flag,
                        FetchStatus.complete
                    ),
                    byFlag: new Map(state.flagAssessment.byFlag).set(action.meta.flag, {
                        ...action.payload.data,
                        timeRequested: Date.now(),
                    }),
                    errors: new Map(state.flagAssessment.errors).set(action.meta.flag, null),
                }
            };

            return nextState;
        }

        case failureMessage(ActionTypes.FETCH_FLAG_ASSESSMENT): {
            const nextState: MappingsState = {
                ...state,
                flagAssessment: {
                    ...state.flagAssessment,
                    fetchStatus: new Map(state.flagAssessment.fetchStatus).set(
                        action.meta.flag,
                        FetchStatus.complete
                    ),
                    errors: new Map(state.flagAssessment.errors).set(action.meta.flag, action.payload),
                }
            };

            return nextState;
        }

        default:
            return state;
    }
};
