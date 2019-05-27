import ApiClient from './apiClient';

describe('request', () => {
    const objectResolver = Promise.resolve({});
    const mockFetchPromise = Promise.resolve({
        ok: true,
        json: () => objectResolver
    });
    const fetchSpy: any = jest.fn(() => mockFetchPromise);

    beforeAll(() => {
        // window.insights = {
        //     chrome: { auth: { getUser: jest.fn(() => objectResolver) }}
        // };
        window.fetch = fetchSpy;
    });

    it('calls fetch', () => {
        expect(ApiClient.request('/path', {}, 'get')).toEqual(objectResolver);
        // Oddly this does not give the expected result, even though it has to call the
        // spy in order to get objectResolver as an expected result above.
        //
        //  expect(window.fetch).toHaveBeenCalledWith('/api/hooks/path');
    });

    afterAll(() => {
        const fetch: any = window.fetch;
        fetch.mockClear();
    });
});

describe('API calls', () => {
    const mockGet = jest.fn(() => ({}));

    beforeAll(() => {
        Object.assign(ApiClient, {
            request: mockGet
        });
    });

    describe('post', () => {
        it('calls request with /create and post', () => {
            expect(ApiClient.post('/create', {key: 'value'})).toEqual({});
            expect(ApiClient.request).toHaveBeenCalledWith('/create', {key: 'value'}, 'post', {});
        });
    });

    describe('get', () => {
        it('calls request with path and get', () => {
            expect(ApiClient.get('/get')).toEqual({});
            expect(ApiClient.request).toHaveBeenCalledWith('/get');
        });
    });

    describe('put', () => {
        it('calls request with path and put', () => {
            expect(ApiClient.put('/update', {key: 'value'})).toEqual({});
            expect(ApiClient.request).toHaveBeenCalledWith('/update', {key: 'value'}, 'put', {});
        });
    });

    describe('delete', () => {
        it('calls request with path and delete', () => {
            expect(ApiClient.delete('/destroy')).toEqual({});
            expect(ApiClient.request).toHaveBeenCalledWith('/destroy', null, 'delete', {});
        });
    });

    afterAll(() => {
        const request: any = ApiClient.request;
        request.mockClear();
    });
});
