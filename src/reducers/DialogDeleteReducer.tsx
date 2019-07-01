import {
    ActionTypes
} from '../actions/DialogDeleteActions';
import { DialogDeleteState } from '../models/state';
import { GenericAction } from '../models/action';

export const initialState: DialogDeleteState = {
    isOpen: false,
    isProcessing: false,
    isError: false,
    name: '',
    type: '',
    onDelete: null,
    onCancel: null
};

export const dialogDeleteReducer = function (
    state: DialogDeleteState = initialState,
    action: GenericAction
): GenericAction {
    switch (action.type) {
        case ActionTypes.DIALOG_DELETE_OPEN: {
            const nextState: DialogDeleteState = {
                ...state,
                ...action.payload,
                isOpen: true
            };
            return nextState;
        }

        case ActionTypes.DIALOG_DELETE_PROCESSING: {
            const nextState: DialogDeleteState = {
                ...state,
                isProcessing: true
            };

            return nextState;
        }

        case ActionTypes.DIALOG_DELETE_CLOSE: {
            const nextState: DialogDeleteState = initialState;
            return nextState;
        }

        case ActionTypes.DIALOG_DELETE_ERROR: {
            const nextState: DialogDeleteState = {
                ...state,
                isError: true
            };

            return nextState;
        }

        default:
            return state;
    }
};
