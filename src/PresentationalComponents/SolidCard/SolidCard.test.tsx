import React from 'react';
import { shallow } from 'enzyme';
import { SolidCard } from './SolidCard';

describe('SolidCard', () => {
    it('expect to render', () => {
        const wrapper = shallow(<SolidCard title="My Title" description="My description" />);
        expect(wrapper).toMatchSnapshot();
    });
});
