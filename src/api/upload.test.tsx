jest.mock('./apiClient', () => ({
    get: jest.fn(() => Promise.resolve({})),
    post: jest.fn(() => Promise.resolve({})),
    put: jest.fn(() => Promise.resolve({})),
    delete: jest.fn(() => Promise.resolve({}))
}));

import * as actionGenerator from './upload';

describe('uploadFile', () => {
    it('returns a state object', () => {
        const file = new File([ '' ], 'myFile.zip');
    
        const formData = new FormData();
        formData.append('file', file, file.name);
        formData.append('customerId', 'myCustomerId');
    
        const config = {};
        expect(actionGenerator.uploadFile(formData, config)).toMatchSnapshot();
    });
});
