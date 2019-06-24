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
    it('should return the initial state', () => {
        const initialState = undefined;
        const action = {} as GenericAction;
        
        expect(
            uploadsReducer(initialState, action)
        ).toEqual(systemInitialState);
    });
});
