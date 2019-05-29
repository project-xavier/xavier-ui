import {
    initialStateFor,
    pendingMessage,
    successMessage,
    failureMessage
} from './reducerHelper';
import {
    ActionTypes
} from '../actions/UploadActions';

export const uploadsReducer = function (state = initialStateFor('uploads', []), action) {
    switch (action.type) {
        case ActionTypes.UPLOAD_PROGRESS:
            return {
                ...state,
                uploads: state.uploads.map((upload) => {
                    let uploadCopy = { ...upload };
                    if (upload.file === action.payload.file) {
                        uploadCopy = Object.assign({}, uploadCopy, action.payload);
                    }

                    return uploadCopy;
                })
            };

        case ActionTypes.UPLOAD_CLEAR:
            return {
                ...state,
                uploads: []
            };

        case pendingMessage(ActionTypes.UPLOAD_REQUEST):
            return {
                ...state,
                uploads: [
                    ...state.uploads,
                    {
                        file: action.meta.file,
                        success: null,
                        error: null,
                        uploading: true
                    }
                ]
            };

        case successMessage(ActionTypes.UPLOAD_REQUEST):
            return {
                ...state,
                uploads: state.uploads.map((upload) => {
                    if (upload.file === action.meta.file) {
                        return {
                            ...upload,
                            success: true,
                            error: null,
                            uploading: false
                        };
                    } else {
                        return {
                            ...upload
                        };
                    }
                })
            };

        case failureMessage(ActionTypes.UPLOAD_REQUEST):
            return {
                ...state,
                uploads: state.uploads.map(upload => {
                    if (upload.file === action.meta.file) {
                        return {
                            ...upload,
                            success: false,
                            error: action.payload.message,
                            uploading: false
                        };
                    }

                    return upload;
                })
            };

        default:
            return state;
    }
};
