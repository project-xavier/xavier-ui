import React from 'react';
import { shallow } from 'enzyme';
import {
  WorkloadInventoryDetails,
  WorkloadInventoryDetailsProps,
} from './WorkloadInventoryDetails';

describe('WorkloadInventoryDetails', () => {
  it('expect to render', () => {
    const props: WorkloadInventoryDetailsProps = {
      reportWorkloadInventory: {
        diskSpace: 1073741824,
        memory: 2147483648,
        cpuCores: 10,
        osDescription: 'My description',
        provider: '',
        datacenter: '',
        cluster: '',
        vmName: '',
        osName: '',
        complexity: '',
        flagsIMS: [],
        workloads: [],
        recommendedTargetsIMS: [],
        insightsEnabled: true,
      },
    };
    const wrapper = shallow(<WorkloadInventoryDetails {...props} />);
    expect(wrapper).toMatchSnapshot();
  });
});
