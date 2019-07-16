jest.mock('../api/apiClient', () => ({
    get: jest.fn(() => Promise.resolve({})),
    post: jest.fn(() => Promise.resolve({})),
    put: jest.fn(() => Promise.resolve({})),
    delete: jest.fn(() => Promise.resolve({}))
}));

import * as actionGenerator from './UserActions';
import { Upload, User } from '../models';

describe('fetchUser', () => {
    it('returns a state object', () => {
        expect(actionGenerator.fetchUser()).toMatchSnapshot();
    });
});

describe('updateUser', () => {
    it('returns a state object', () => {
        const user: User = {
            firstTimeCreatingReports: true
        };
        expect(actionGenerator.updateUser(user)).toMatchSnapshot();
    });
});
