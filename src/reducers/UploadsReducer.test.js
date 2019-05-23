import { uploadsReducer } from './UploadsReducer';
import {
    ActionTypes
} from '../actions/UploadActions';
import {
    successMessage,
    failureMessage,
    pendingMessage
} from './reducerHelper';

import uploadsMock, { uploadMock } from '../__fixtures__/uploads';

const initialState = {
    error: null,
    loading: false
};

const fromRequest = (type, payload, meta: {}) => ({
    type,
    payload,
    meta: { partial: false, ...meta }
});

describe('report reducer', () => {
    const uploadInitialState = {
        ...initialState,
        uploads: []
    };

    it('should return the initial state', () => {
        expect(uploadsReducer(undefined, {})).toEqual(uploadInitialState);
    });

    it('should handle UPLOAD_PROGRESS', () => {
        const update = uploadMock.data;
        const uploads = uploadsMock.data;

        const expectedUpload = { ...update, progress: 20 };
        const expectedUploads = [ ...uploads ].map(e => {
            return e.file === update.file ? expectedUpload : e;
        });

        const expectation = {
            ...uploadInitialState,
            loading: false,
            error: null,
            uploads: expectedUploads
        };
        const newState = uploadsReducer(
            {
                ...uploadInitialState,
                uploads
            },
            fromRequest(ActionTypes.UPLOAD_PROGRESS, { file: update.file, progress: 20 })
        );
        expect(newState).toEqual(expectation);
    });

    it('should handle UPLOAD_CLEAR', () => {
        const expectation = {
            ...uploadInitialState,
            loading: false,
            error: null,
            uploads: []
        };
        const newState = uploadsReducer(
            uploadInitialState,
            fromRequest(ActionTypes.UPLOAD_CLEAR, {})
        );
        expect(newState).toEqual(expectation);
    });

    it('should handle UPLOAD_REQUEST_PENDING', () => {
        const file = new File([ '' ], 'myFile1.zip');

        const expectation = {
            ...uploadInitialState,
            loading: false,
            error: null,
            uploads: [{
                file,
                error: null,
                success: null
            }]
        };
        const newState = uploadsReducer(
            uploadInitialState,
            fromRequest(pendingMessage(ActionTypes.UPLOAD_REQUEST), {}, { file })
        );
        expect(newState).toEqual(expectation);
    });

    it('should handle UPLOAD_REQUEST_SUCCESS', () => {
        const update = uploadMock.data;
        const uploads = uploadsMock.data;

        const expectedUpload = { ...update, success: true };
        const expectedUploads = [ ...uploads ].map(e => {
            return e.file === update.file ? expectedUpload : e;
        });

        const expectation = {
            ...uploadInitialState,
            loading: false,
            error: null,
            uploads: expectedUploads
        };
        const newState = uploadsReducer(
            {
                ...uploadInitialState,
                uploads
            },
            fromRequest(successMessage(ActionTypes.UPLOAD_PROGRESS), {}, { file: update.file })
        );
        expect(newState).toEqual(expectation);
    });

    it('should handle UPLOAD_REQUEST_FAILURE', () => {
        const error = 'It broke';

        const update = uploadMock.data;
        const uploads = uploadsMock.data;

        const expectedUpload = { ...update, error, success: false };
        const expectedUploads = [ ...uploads ].map(e => {
            return e.file === update.file ? expectedUpload : e;
        });

        const newState = uploadsReducer(
            {
                ...uploadInitialState,
                uploads
            },
            fromRequest(failureMessage(ActionTypes.UPLOAD_REQUEST), { message: error }, { file: update.file })
        );
        expect(newState).toEqual({
            ...uploadInitialState,
            loading: false,
            error: null,
            uploads: expectedUploads
        });
    });

});
