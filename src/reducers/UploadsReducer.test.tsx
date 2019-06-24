import { 
    uploadsReducer,
    initialState as systemInitialState
} from './UploadsReducer';
import {
    ActionTypes
} from '../actions/UploadActions';
import {
    successMessage,
    failureMessage,
    pendingMessage
} from './reducerHelper';

import { GenericAction } from '../models/action';
import { UploadState } from '../models/state';

const uploadInitialState: UploadState = {
    file: new File([ '' ], 'myFile1.zip'),
    success: null,
    error: null,
    progress: 0,
    uploading: false
};

const fromRequest = (type: string, payload: any, meta = {}) => ({
    type,
    payload,
    meta: { partial: false, ...meta }
});

describe('report reducer', () => {
    it('should return the default state', () => {
        const initialState: UploadState = undefined;
        const action = {} as GenericAction;
        
        expect(
            uploadsReducer(initialState, action)
        ).toEqual(systemInitialState);
    });

    it('should return the previous state', () => {
        const initialState: UploadState = {
            file: new File([ '' ], 'myFile.zip'),
            success: false,
            error: 'my custom error',
            progress: 90,
            uploading: true
        };
        const action = {} as GenericAction;
        
        expect(
            uploadsReducer(initialState, action)
        ).toEqual(initialState);
    });

    it('should handle SELECT_UPLOAD_FILE', () => {
        const payload = {
            file: new File([ '' ], 'myFile.zip')
        };

        const expectedNewState: UploadState = {
            ...uploadInitialState,
            file: payload.file,
            success: null,
            error: null,
            progress: 0,
            uploading: false
        };
        const newState: UploadState = uploadsReducer(
            uploadInitialState,
            fromRequest(ActionTypes.SELECT_UPLOAD_FILE, payload)
        );
        
        expect(newState).toEqual(expectedNewState);
    });

    it('should handle UPLOAD_PROGRESS', () => {
        const payload = {
            progress: 20
        };

        const expectedNewState: UploadState = {
            ...uploadInitialState,
            progress: payload.progress
        };

        const newState: UploadState = uploadsReducer(
            uploadInitialState,
            fromRequest(ActionTypes.UPLOAD_PROGRESS, payload)
        );
        expect(newState).toEqual(expectedNewState);
    });

    it('should handle UPLOAD_REQUEST_PENDING', () => {
        const payload = {};
        const meta = {
            file: new File([ '' ], 'myFile.zip')
        };

        const expectedNewState: UploadState = {
            ...uploadInitialState,
            error: null,
            success: null,
            progress: 0,
            uploading: true,
            file: meta.file
        };

        const newState: UploadState = uploadsReducer(
            uploadInitialState,
            fromRequest(pendingMessage(ActionTypes.UPLOAD_REQUEST), payload, meta)
        );
        expect(newState).toEqual(expectedNewState);
    });

    it('should handle UPLOAD_REQUEST_FULFILLED', () => {
        const payload = {};

        const expectedNewState: UploadState = {
            ...uploadInitialState,
            success: true,
            uploading: false
        };

        const newState: UploadState = uploadsReducer(
            uploadInitialState,
            fromRequest(successMessage(ActionTypes.UPLOAD_REQUEST), payload)
        );
        expect(newState).toEqual(expectedNewState);
    });

    it('should handle UPLOAD_REQUEST_REJECTED', () => {
        const payload = {
            message: 'my custom error message'
        };

        const expectedNewState: UploadState = {
            ...uploadInitialState,
            error: payload.message,
            success: false,
            uploading: false
        };

        const newState: UploadState = uploadsReducer(
            uploadInitialState,
            fromRequest(failureMessage(ActionTypes.UPLOAD_REQUEST), payload)
        );
        expect(newState).toEqual(expectedNewState);
    });
});
