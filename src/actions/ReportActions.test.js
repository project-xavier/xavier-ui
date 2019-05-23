jest.mock('../api/apiClient', () => ({
    get: jest.fn(() => Promise.resolve({})),
    post: jest.fn(() => Promise.resolve({})),
    put: jest.fn(() => Promise.resolve({})),
    delete: jest.fn(() => Promise.resolve({}))
}));

import * as actionGenerator from './ReportActions';

describe('fetchReports', () => {
    it('returns a state object', () => {
        expect(actionGenerator.fetchReports()).toMatchSnapshot();
    });
});

describe('fetchReport', () => {
    it('returns a state object', () => {
        expect(actionGenerator.fetchReport(1)).toMatchSnapshot();
    });
});
