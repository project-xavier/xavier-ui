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

import uploadsMock, { uploadMock } from './__fixtures__/uploads';
import { GenericAction } from '../models/action';
import { Upload } from '../models';
import { UploadState } from '../models/state';

const uploadInitialState = {
    uploads: [
        {
            file: new File([ '' ], 'myFile1.zip'),
            success: null,
            error: null,
            progress: 0,
            uploading: false
        },
        {
            file: new File([ '' ], 'myFile2.zip'),
            success: null,
            error: null,
            progress: 0,
            uploading: false
        }
    ]
};

const fromRequest = (type: string, payload: any, meta = {}) => ({
    type,
    payload,
    meta: { partial: false, ...meta }
});

describe('report reducer', () => {
    it('should return the initial state', () => {
        const initialState = undefined;
        const action = {} as GenericAction;
        
        expect(
            uploadsReducer(initialState, action)
        ).toEqual(systemInitialState);
    });

    it('should handle UPLOAD_PROGRESS', () => {
        const update: Upload = uploadMock.data;
        const uploads: Upload[] = uploadsMock.data;

        const expectedUpload: Upload = { ...update, progress: 20 };
        const expectedUploads: Upload[] = [ ...uploads ].map(e => {
            return e.file === update.file ? expectedUpload : e;
        });

        const expectedNewState: UploadState = {
            ...uploadInitialState,
            uploads: expectedUploads
        };
        const newState: UploadState = uploadsReducer(
            {
                ...uploadInitialState,
                uploads
            },
            fromRequest(ActionTypes.UPLOAD_PROGRESS, { file: update.file, progress: 20 })
        );
        expect(newState).toEqual(expectedNewState);
    });

    it('should handle UPLOAD_CLEAR', () => {
        const expectedNewState: UploadState = {
            ...uploadInitialState,
            uploads: []
        };
        const newState: UploadState = uploadsReducer(
            uploadInitialState,
            fromRequest(ActionTypes.UPLOAD_CLEAR, {})
        );
        expect(newState).toEqual(expectedNewState);
    });

    it('should handle UPLOAD_REQUEST_PENDING', () => {
        const file = new File([ '' ], 'myFile1.zip');

        const upload: Upload = {
            file,
            error: null,
            success: null,
            progress: 0,
            uploading: true
        };

        const expectedNewState: UploadState = {
            ...uploadInitialState,
            uploads: [
                ...uploadInitialState.uploads,
                upload
            ]
        };
        const newState: UploadState = uploadsReducer(
            uploadInitialState,
            fromRequest(pendingMessage(ActionTypes.UPLOAD_REQUEST), {}, { file })
        );
        expect(newState).toEqual(expectedNewState);
    });

    it('should handle UPLOAD_REQUEST_SUCCESS', () => {
        const update: Upload = uploadMock.data;
        const uploads: Upload[] = uploadsMock.data;

        const expectedUpload: Upload = { ...update, success: true };
        const expectedUploads: Upload[] = [ ...uploads ].map(e => {
            return e.file === update.file ? expectedUpload : e;
        });

        const expectedNewState: UploadState = {
            ...uploadInitialState,
            uploads: expectedUploads
        };

        const mockPayload = { };
        const mockMeta = { file: update.file };
        const newState: UploadState = uploadsReducer(
            {
                ...uploadInitialState,
                uploads
            },
            fromRequest(successMessage(ActionTypes.UPLOAD_REQUEST), mockPayload, mockMeta)
        );
        expect(newState).toEqual(expectedNewState);
    });

    it('should handle UPLOAD_REQUEST_FAILURE', () => {
        const error = 'It broke';

        const update: Upload = uploadMock.data;
        const uploads: Upload[] = uploadsMock.data;

        const expectedUpload: Upload = { ...update, error, success: false };
        const expectedUploads: Upload[] = [ ...uploadsMock.data ].map(e => {
            return e.file === update.file ? expectedUpload : e;
        });


        const expectedNewState: UploadState = {
            ...uploadInitialState,
            uploads: expectedUploads
        };

        const mockPayload = { message: error };
        const mockMeta = { file: update.file };
        const newState: UploadState = uploadsReducer(
            {
                ...uploadInitialState,
                uploads
            },
            fromRequest(failureMessage(ActionTypes.UPLOAD_REQUEST), mockPayload, mockMeta)
        );
        expect(newState).toEqual(expectedNewState);
    });

});
