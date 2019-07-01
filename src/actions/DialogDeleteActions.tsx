import { AxiosError } from 'axios';
import { GenericAction } from '../models/action';

export const ActionTypes = {
    DIALOG_DELETE_OPEN: 'DIALOG_DELETE_OPEN',
    DIALOG_DELETE_CLOSE: 'DIALOG_DELETE_CLOSE',
    DIALOG_DELETE_PROCESSING: 'DIALOG_DELETE_PROCESSING',
    DIALOG_DELETE_ERROR: 'DIALOG_DELETE_ERROR'
};

export const openModal = (name: string, type: string, onDelete: () => void, onCancel: () => void): GenericAction => ({
    type: ActionTypes.DIALOG_DELETE_OPEN,
    payload: {
        name,
        type,
        onDelete,
        onCancel
    }
});

export const closeModal = (): GenericAction => ({
    type: ActionTypes.DIALOG_DELETE_CLOSE,
    payload: {
    }
});

export const processingModal = (): GenericAction => ({
    type: ActionTypes.DIALOG_DELETE_PROCESSING,
    payload: {
    }
});

export const errorModal = (error: AxiosError): GenericAction => ({
    type: ActionTypes.DIALOG_DELETE_ERROR,
    payload: {
        ...error
    }
});
