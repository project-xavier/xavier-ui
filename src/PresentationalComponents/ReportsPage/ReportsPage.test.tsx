import React from 'react';
import { shallow } from 'enzyme';
import ReportsPage from './ReportsPage';

describe('ReportPage', () => {
  it('expect to render', () => {
    const wrapper = shallow(<ReportsPage mainStyle={{ color: 'red' }}>children</ReportsPage>);
    expect(wrapper).toMatchSnapshot();
  });
});
