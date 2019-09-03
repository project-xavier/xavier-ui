import { ActionTypes } from '../actions/MappingsActions';
import { pendingMessage, successMessage, failureMessage } from './reducerHelper';
import { UserState, FetchStatus } from '../models/state';
import { GenericAction } from '../models/action';
import { FlagAssessment } from 'src/models';
import { AxiosError } from 'axios';

export interface FlagAssessmentCached extends FlagAssessment {
    timeRequested: number;
}
  
export type FlagAssessmentState = Readonly<{
    byFlag: Map<string, FlagAssessmentCached>;
    fetchStatus: Map<string, FetchStatus>;
    errors: Map<string, AxiosError | null>;
}>;
  
const defaultState: FlagAssessmentState = {
    byFlag: new Map(),
    fetchStatus: new Map(),
    errors: new Map(),
};

export const mappingsReducer = (state: FlagAssessmentState = defaultState, action: GenericAction) => {
    switch (action.type) {
        case pendingMessage(ActionTypes.FETCH_FLAG_ASSESSMENT): {
            const nextState: FlagAssessmentState = {
                ...state,
                fetchStatus: new Map(state.fetchStatus).set(
                    action.payload.flag,
                    FetchStatus.inProgress
                ),
            };

            return nextState;
        }

        case successMessage(ActionTypes.FETCH_FLAG_ASSESSMENT): {
            const nextState: FlagAssessmentState = {
                ...state,
                fetchStatus: new Map(state.fetchStatus).set(
                    action.meta.flag,
                    FetchStatus.complete
                ),
                byFlag: new Map(state.byFlag).set(action.meta.flag, {
                    ...action.payload,
                    timeRequested: Date.now(),
                }),
                errors: new Map(state.errors).set(action.meta.flag, null),
            };

            return nextState;
        }

        case failureMessage(ActionTypes.FETCH_FLAG_ASSESSMENT): {
            const nextState: FlagAssessmentState = {
                ...state,
                fetchStatus: new Map(state.fetchStatus).set(
                    action.meta.flag,
                    FetchStatus.complete
                ),
                errors: new Map(state.errors).set(action.meta.flag, action.payload),
            };

            return nextState;
        }

        default:
            return state;
    }
};
