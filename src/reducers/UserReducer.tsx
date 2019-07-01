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
    error: null,
    user: null,
    loading: false
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
                loading: true,
                error: null
            };

            return nextState;
        }

        case successMessage(ActionTypes.FETCH_USER): {
            const nextState: UserState = {
                ...state,
                user: action.payload.data,
                loading: false
            };

            return nextState;
        }

        case failureMessage(ActionTypes.FETCH_USER): {
            const nextState: UserState = {
                ...state,
                user: null,
                loading: false,
                error: action.payload.message
            };

            return nextState;
        }

        default:
            return state;
    }
};
