jest.mock('./apiClient', () => ({
    get: jest.fn(() => Promise.resolve({})),
    post: jest.fn(() => Promise.resolve({})),
    put: jest.fn(() => Promise.resolve({})),
    delete: jest.fn(() => Promise.resolve({}))
}));

import * as actionGenerator from './upload';

describe('uploadFile', () => {
    it('returns a state object', () => {
        const customerId = 'myCustomerId';
        const file = new File([ '' ], 'myFile.zip');
        const config = {};
        expect(actionGenerator.uploadFile(customerId, file, config)).toMatchSnapshot();
    });
});
