import { uploadFile } from '../api/upload';

export const ActionTypes = {
    UPLOAD_REQUEST: 'UPLOAD_REQUEST',
    UPLOAD_PROGRESS: 'UPLOAD_PROGRESS',
    UPLOAD_CLEAR: 'UPLOAD_CLEAR'
};

export const uploadRequest = (customerId, file, config) => {
    const formData = new FormData();
    formData.append('file', file, file.name);
    return {
        type: ActionTypes.UPLOAD_REQUEST,
        payload: uploadFile(customerId, formData, config),
        meta: {
            file,
            notifications: {
                rejected: {
                    variant: 'danger',
                    title: `Failed to upload file ${file.name}`
                }
            }
        }
    };
};

export const uploadProgress = (file, progress) => ({
    type: ActionTypes.UPLOAD_PROGRESS,
    payload: {
        file,
        progress
    }
});

export const uploadClear = () => ({
    type: ActionTypes.UPLOAD_CLEAR
});

