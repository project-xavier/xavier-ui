import { uploadFile } from '../api/upload';
import { GenericAction } from '../models/action';
import { Upload } from '../models';

export const ActionTypes = {
    UPLOAD_REQUEST: 'UPLOAD_REQUEST',
    UPLOAD_PROGRESS: 'UPLOAD_PROGRESS',
    SELECT_UPLOAD_FILE: 'SELECT_UPLOAD_FILE',
    RESET_UPLOAD_FILE: 'RESET_UPLOAD_FILE'
};

export const uploadRequest = (upload: Upload, config = {}): GenericAction => {
    const formData = new FormData();
    Object.keys(upload).forEach(key => formData.append(key, upload[key].toString()));

    formData.set('file', upload.file, upload.file.name);
    return {
        type: ActionTypes.UPLOAD_REQUEST,
        payload: uploadFile(formData, config),
        meta: {
            file: upload.file,
            noError: true,
            notifications: { }
        }
    };
};

export const uploadProgress = (progress: number): GenericAction => ({
    type: ActionTypes.UPLOAD_PROGRESS,
    payload: {
        progress
    }
});

export const selectUploadFile = (file: File): GenericAction => ({
    type: ActionTypes.SELECT_UPLOAD_FILE,
    payload: {
        file
    }
});

export const resetUploadFile = (): GenericAction => ({
    type: ActionTypes.RESET_UPLOAD_FILE,
    payload: { }
});
