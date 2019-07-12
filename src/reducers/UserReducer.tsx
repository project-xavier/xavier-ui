import {
    ActionTypes
} from '../actions/UserActions';
import {
    pendingMessage,
    successMessage,
    failureMessage
} from './reducerHelper';
import { UserState } from '../models/state';
import { GenericAction } from '../models/action';

export const initialState: UserState = {
    user: null,
    userFetchStatus: {
        error: null,
        status: 'none'
    }
};

export const userReducer = function (
    state: UserState = initialState,
    action: GenericAction
) {
    switch (action.type) {
        case ActionTypes.UPDATE_USER: {
            const nextState: UserState = {
                ...state,
                user: Object.assign({}, state.user, action.payload.user)
            };

            return nextState;
        }

        case pendingMessage(ActionTypes.FETCH_USER): {
            const nextState: UserState = {
                ...state,
                user: null,
                userFetchStatus: {
                    error: null,
                    status: 'inProgress'
                }
            };

            return nextState;
        }

        case successMessage(ActionTypes.FETCH_USER): {
            const nextState: UserState = {
                ...state,
                user: action.payload.data,
                userFetchStatus: {
                    error: null,
                    status: 'complete'
                }
            };

            return nextState;
        }

        case failureMessage(ActionTypes.FETCH_USER): {
            const nextState: UserState = {
                ...state,
                user: null,
                userFetchStatus: {
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
