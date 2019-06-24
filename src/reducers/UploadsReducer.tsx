import {
    pendingMessage,
    successMessage,
    failureMessage
} from './reducerHelper';
import {
    ActionTypes
} from '../actions/UploadActions';
import { GenericAction } from '../models/action';
import { UploadState } from '../models/state';

export const initialState: UploadState = {
    file: null,
    success: null,
    error: null,
    progress: 0,
    uploading: false
};

export const uploadsReducer = function (
    state: UploadState = initialState,
    action: GenericAction
) {
    switch (action.type) {
        case ActionTypes.UPLOAD_PROGRESS: {
            const nextState: UploadState = {
                ...state,
                progress: action.payload.progress
            };
            return nextState;
        }

        case ActionTypes.SELECT_UPLOAD_FILE: {
            const nextState: UploadState = {
                ...state,
                error: null,
                success: null,
                progress: 0,
                uploading: false,
                file: action.payload.file
            };
            return nextState;
        }

        //
        case pendingMessage(ActionTypes.UPLOAD_REQUEST): {
            const nextState: UploadState = {
                ...state,
                error: null,
                success: null,
                progress: 0,
                uploading: true,
                file: action.meta.file
            };
            return nextState;
        }

        case successMessage(ActionTypes.UPLOAD_REQUEST): {
            const nextState: UploadState = {
                ...state,
                success: true,
                uploading: false
            };
            return nextState;
        }

        case failureMessage(ActionTypes.UPLOAD_REQUEST): {
            const nextState: UploadState = {
                ...state,
                error: action.payload.message,
                success: false,
                uploading: false
            };
            return nextState;
        }

        default:
            return state;
    }
};
