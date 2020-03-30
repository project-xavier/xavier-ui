import React from 'react';
import { shallow } from 'enzyme';
import { FetchErrorEmptyState, FetchErrorEmptyStateProps } from './FetchErrorEmptyState';
import { Button } from '@patternfly/react-core';

describe('FetchErrorEmptyState', () => {
    it('FetchErrorEmptyState should render', () => {
        const props: FetchErrorEmptyStateProps = {
            onRetry: jest.fn()
        };

        const wrapper = shallow(<FetchErrorEmptyState {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('FetchErrorEmptyState on retry click should execute callback', () => {
        // Given
        const callbackMock = jest.fn();
        const props: FetchErrorEmptyStateProps = {
            onRetry: callbackMock
        };

        // When

        const wrapper = shallow(<FetchErrorEmptyState {...props} />);
        wrapper
            .find(Button)
            .first()
            .simulate('click');

        // Then

        expect(callbackMock.mock.calls.length).toEqual(1);
    });
});
