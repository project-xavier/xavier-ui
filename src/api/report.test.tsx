jest.mock('./apiClient', () => ({
  get: jest.fn(() => Promise.resolve({})),
  post: jest.fn(() => Promise.resolve({})),
  put: jest.fn(() => Promise.resolve({})),
  delete: jest.fn(() => Promise.resolve({})),
}));

import * as actionGenerator from './report';

describe('getAllReports', () => {
  it('returns a state object', () => {
    expect(actionGenerator.getAllReports(1, 10, '')).toMatchSnapshot();
  });
});

describe('getReportById', () => {
  it('returns a state object', () => {
    expect(actionGenerator.getReportById(1)).toMatchSnapshot();
  });
});
