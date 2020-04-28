import React from 'react';
import { shallow } from 'enzyme';
import { EmptyCard } from './EmptyCard';

describe('EmptyCard', () => {
    it('expect to render', () => {
        const wrapper = shallow(<EmptyCard title="My Title" />);
        expect(wrapper).toMatchSnapshot();
    });

    it('expect to render with title as Element', () => {
        const wrapper = shallow(<EmptyCard title={<h1>My Title</h1>} />);
        expect(wrapper).toMatchSnapshot();
    });
});
