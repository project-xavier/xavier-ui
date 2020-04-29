import React from 'react';
import { shallow } from 'enzyme';
import { EmptyCard } from './EmptyCard';

describe('EmptyCard', () => {
    it('expect to render without description', () => {
        const wrapper = shallow(<EmptyCard cardTitle="My card title" message="My message" />);
        expect(wrapper).toMatchSnapshot();
    });

    it('expect to render with description', () => {
        const wrapper = shallow(
            <EmptyCard cardTitle="My card title" message="My message" description="My description" />
        );
        expect(wrapper).toMatchSnapshot();
    });

    it('expect to render with cardTitle as Element', () => {
        const wrapper = shallow(
            <EmptyCard cardTitle={<h1>My Title</h1>} message="My message" description="My description" />
        );
        expect(wrapper).toMatchSnapshot();
    });
});
