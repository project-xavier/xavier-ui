jest.mock('../api/apiClient', () => ({
    get: jest.fn(() => Promise.resolve({})),
    post: jest.fn(() => Promise.resolve({})),
    put: jest.fn(() => Promise.resolve({})),
    delete: jest.fn(() => Promise.resolve({}))
}));

import * as actionGenerator from './UploadActions';

describe('uploadRequest', () => {
    it('returns a state object', () => {
        expect(actionGenerator.uploadRequest('myCustomerId', new File([ '' ], 'myFile.zip'), {})).toMatchSnapshot();
    });
});

describe('uploadProgress', () => {
    it('returns a state object', () => {
        expect(actionGenerator.uploadProgress(new File([ '' ], 'myFile.zip'), 60)).toMatchSnapshot();
    });
});

describe('uploadClear', () => {
    it('returns a state object', () => {
        expect(actionGenerator.uploadClear()).toMatchSnapshot();
    });
});
