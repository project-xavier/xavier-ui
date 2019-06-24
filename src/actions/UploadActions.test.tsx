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
            reportName: 'myReportName',
            reportDescription: 'myReportDescription',
            yearOverYearGrowthRatePercentage: 5,
            percentageOfHypervisorsMigratedOnYear1: 50,
            percentageOfHypervisorsMigratedOnYear2: 30,
            percentageOfHypervisorsMigratedOnYear3: 10
        };

        expect(actionGenerator.uploadRequest(upload)).toMatchSnapshot();
    });
});

describe('uploadProgress', () => {
    it('returns a state object', () => {
        expect(actionGenerator.uploadProgress(60)).toMatchSnapshot();
    });
});

describe('selectFile', () => {
    it('returns a state object', () => {
        const file = new File([ '' ], 'myFile.zip');
        expect(actionGenerator.selectUploadFile(file)).toMatchSnapshot();
    });
});
