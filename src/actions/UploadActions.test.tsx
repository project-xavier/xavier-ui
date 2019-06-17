jest.mock('../api/apiClient', () => ({
    get: jest.fn(() => Promise.resolve({})),
    post: jest.fn(() => Promise.resolve({})),
    put: jest.fn(() => Promise.resolve({})),
    delete: jest.fn(() => Promise.resolve({}))
}));

import * as actionGenerator from './UploadActions';
import { Upload } from '../models';

describe('uploadRequest', () => {
    it('returns a state object', () => {
        const upload: Upload = {
            file: new File([ '' ], 'myFile.zip'),
            name: 'myReport',
            customerId: 'myCustomerId',
            percentageYearOverYearGrowthRate: 5
        };
        expect(actionGenerator.uploadRequest(upload, {})).toMatchSnapshot();
    });
});

describe('uploadProgress', () => {
    it('returns a state object', () => {
        expect(actionGenerator.uploadProgress(new File([ '' ], 'myFile.zip'), 60)).toMatchSnapshot();
    });
});
