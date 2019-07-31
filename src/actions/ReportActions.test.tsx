jest.mock('../api/apiClient', () => ({
    get: jest.fn(() => Promise.resolve({})),
    post: jest.fn(() => Promise.resolve({})),
    put: jest.fn(() => Promise.resolve({})),
    delete: jest.fn(() => Promise.resolve({}))
}));

import * as actionGenerator from './ReportActions';

describe('fetchReports', () => {
    it('returns a state object', () => {
        expect(actionGenerator.fetchReports(1, 10, 'search text')).toMatchSnapshot();
    });
});

describe('fetchReport', () => {
    it('returns a state object', () => {
        expect(actionGenerator.fetchReport(1)).toMatchSnapshot();
    });
});

describe('deleteReport', () => {
    it('returns a state object', () => {
        expect(actionGenerator.deleteReport(1, 'my report name')).toMatchSnapshot();
    });
});

describe('fetchReportWorkloadMigrationSummary', () => {
    it('returns a state object', () => {
        expect(actionGenerator.fetchReportWorkloadMigrationSummary(1)).toMatchSnapshot();
    });
});

describe('fetchReportInitialSavingEstimation', () => {
    it('returns a state object', () => {
        expect(actionGenerator.fetchReportInitialSavingEstimation(1)).toMatchSnapshot();
    });
});

describe('fetchReportWorkloadInventory', () => {
    it('returns a state object', () => {
        expect(actionGenerator.fetchReportWorkloadInventory(1, 1, 10, 'vmName', 'asc')).toMatchSnapshot();
    });
});
