import { ActionType, getType } from 'typesafe-actions';
import { DialogDeleteState } from '../models/state';
import { closeModal, error, openModal, processing } from '../actions/DialogDeleteActions';

export const stateKey = 'deleteDialog';

export const defaultState: DialogDeleteState = {
    isOpen: false,
    isProcessing: false,
    isError: false,
    name: '',
    type: '',
    onDelete: null,
    onCancel: null
};

export type DeleteDialogAction = ActionType<
    | typeof openModal
    | typeof closeModal
    | typeof processing
    | typeof error
>;

export const dialogDeleteReducer = (
    state: DialogDeleteState = defaultState,
    action: DeleteDialogAction
): DialogDeleteState => {
    switch (action.type) {
        case getType(openModal):
            return {
                ...state,
                ...action.payload,
                isOpen: true
            };
        case getType(processing):
            return {
                ...state,
                isProcessing: true
            };
        case getType(closeModal):
            return defaultState;
        case getType(error):
            return {
                ...state,
                isError: true
            };
        default:
            return state;
    }
};
