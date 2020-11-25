import React from 'react';
import { shallow } from 'enzyme';
import ScansRunTable, { Props } from './ScansRunTable';

const props: Props = {
  scanRuns: [
    {
      target: 'vSphere1',
      smartStateEnabled: true,
      date: 1468959781804,
    },
    {
      target: 'vSphere2',
      smartStateEnabled: false,
      date: 1568764800000,
    },
    {
      target: 'vSphere3',
      smartStateEnabled: false,
      date: '2020-05-26T09:50:25.771+0000',
    },
  ],
};

describe('ScansRunTable should render table', () => {
  it('expect to render table using smartStateEnabled mapping', () => {
    const defaultProps: Props = {
      ...props,
    };

    const wrapper = shallow(<ScansRunTable {...defaultProps} />);
    expect(wrapper).toMatchSnapshot();
  });
});
