import {
    successMessage,
    failureMessage,
    pendingMessage,
    initialStateFor
} from './reducerHelper';

describe('initialStateFor', () => {
    it('returns and object with the reducers initial object', () => {
        expect(initialStateFor('data')).toEqual({
            data: [],
            error: null,
            loading: false
        });
    });

    it('can take a initial object argument', () => {
        expect(initialStateFor('data', {})).toEqual({
            data: {},
            error: null,
            loading: false
        });
    });
});

describe('successMessage', () => {
    it('appends _FULFILLED', () => {
        expect(successMessage('FETCH')).toEqual('FETCH_FULFILLED');
    });
});

describe('failureMessage', () => {
    it('appends _REJECTED', () => {
        expect(failureMessage('FETCH')).toEqual('FETCH_REJECTED');
    });
});

describe('pendingMessage', () => {
    it('appends _PENDING', () => {
        expect(pendingMessage('FETCH')).toEqual('FETCH_PENDING');
    });
});
