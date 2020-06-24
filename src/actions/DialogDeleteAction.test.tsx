import { Item } from './DialogDeleteActions';
import * as actionGenerator from './DialogDeleteActions';
import { AxiosError } from 'axios';

describe('openModal', () => {
    it('returns a state object', () => {
        const modalProps: Item = {
            name: 'Pedro',
            type: 'Persona',
            onDelete: () => jest.fn(),
            onCancel: () => jest.fn()
        };
        expect(actionGenerator.openModal(modalProps)).toMatchSnapshot();
    });
});

describe('closeModal', () => {
    it('returns a state object', () => {
        expect(actionGenerator.closeModal()).toMatchSnapshot();
    });
});

describe('processing', () => {
    it('returns a state object', () => {
        expect(actionGenerator.processing()).toMatchSnapshot();
    });
});

describe('openModal', () => {
    it('returns a state object', () => {
        const error: AxiosError = {
            config: {},
            name: 'error',
            message: 'my custom error message',
            isAxiosError: false,
            toJSON: jest.fn()
        };
        expect(actionGenerator.error(error)).toMatchSnapshot();
    });
});
