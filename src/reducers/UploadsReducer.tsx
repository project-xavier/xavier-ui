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
import { Upload } from '../models';

export const initialState: UploadState = {
    uploads: []
};

export const uploadsReducer = function (
    state: UploadState = initialState,
    action: GenericAction
) {
    switch (action.type) {
        case ActionTypes.UPLOAD_PROGRESS: {
            const uploads: Upload[] = state.uploads.map((upload: Upload) => {
                const newState: Upload = {
                    ...upload,
                    progress: upload.file === action.payload.file ? action.payload.progress : upload.progress
                };

                return newState;
            });

            const nextState: UploadState = {
                ...state,
                uploads
            };
            return nextState;
        }

        case ActionTypes.UPLOAD_CLEAR: {
            return {
                ...state,
                uploads: []
            };
        }

        case pendingMessage(ActionTypes.UPLOAD_REQUEST): {
            const upload: Upload = {
                error: null,
                success: null,
                progress: 0,
                uploading: true,
                file: action.meta.file
            };

            const nextState: UploadState = {
                ...state,
                uploads: [
                    ...state.uploads,
                    upload
                ]
            };
            return nextState;
        }

        case successMessage(ActionTypes.UPLOAD_REQUEST): {
            const uploads: Upload[] = state.uploads.map((upload: Upload) => {
                let newUpload: Upload;
                if (upload.file === action.meta.file) {
                    newUpload = {
                        ...upload,
                        error: null,
                        success: true,
                        uploading: false
                    };
                } else {
                    newUpload = {
                        ...upload
                    };
                }

                return newUpload;
            });

            const nextState: UploadState = {
                ...state,
                uploads
            };
            return nextState;
        }

        case failureMessage(ActionTypes.UPLOAD_REQUEST): {
            const uploads: Upload[] = state.uploads.map((upload: Upload) => {
                let newUpload: Upload;
                if (upload.file === action.meta.file) {
                    newUpload = {
                        ...upload,
                        error: action.payload.message,
                        success: false,
                        uploading: false
                    };
                } else {
                    newUpload = {
                        ...upload
                    };
                }

                return newUpload;
            });

            const nextState: UploadState = {
                ...state,
                uploads
            };
            return nextState;
        }

        default:
            return state;
    }
};
