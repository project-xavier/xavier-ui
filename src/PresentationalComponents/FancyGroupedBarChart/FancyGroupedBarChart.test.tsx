import React from 'react';
import { shallow } from 'enzyme';
import FancyGroupedBarChart, { FancyGroupedBarChartData } from './FancyGroupedBarChart';

const baseData: FancyGroupedBarChartData = {
  legends: ['Legend1', 'Legend2'],
  colors: ['red', 'blue'],
  values: [
    [
      { x: 'Year1', y: 10, label: '10 oranges' },
      { x: 'Year2', y: 20, label: '20 oranges' },
      { x: 'Year3', y: 30, label: '30 oranges' },
    ],
    [
      { x: 'Year1', y: 40, label: '40 bananas' },
      { x: 'Year2', y: 50, label: '50 bananas' },
      { x: 'Year3', y: 60, label: '60 bananas' },
    ],
  ],
};

describe('FancyGroupedBarChart', () => {
  it('expect to render with minimun props', () => {
    const data = {
      ...baseData,
    };
    const wrapper = shallow(<FancyGroupedBarChart data={data} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('expect to render footer', () => {
    const data = {
      ...baseData,
    };

    const footer = <p>this is a footer</p>;

    const wrapper = shallow(<FancyGroupedBarChart data={data} footer={footer} />);
    expect(wrapper).toMatchSnapshot();
  });
});
