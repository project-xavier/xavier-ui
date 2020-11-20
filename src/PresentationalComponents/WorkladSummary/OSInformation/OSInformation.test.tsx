import React from 'react';
import { shallow } from 'enzyme';
import { OSInformation } from './OSInformation';
import { ReportWorkloadSummary } from 'src/models';

const BasicReportWorkloadSummary: ReportWorkloadSummary = {
  complexityModel: {
    easy: 1,
    hard: 2,
    medium: 3,
    unknown: 4,
    unsupported: 5,
  },
  recommendedTargetsIMSModel: {
    ocp: 10,
    osp: 20,
    rhel: 30,
    rhv: 40,
    total: 100,
    openjdk: 25,
    jbosseap: 8,
  },
  scanRunModels: [],
  summaryModels: [],
  workloadsDetectedOSTypeModels: [],
  javaRuntimes: [],
  applicationPlatforms: [],
  osInformation: [],
};

describe('JavaRuntimesCard', () => {
  it('expect to render', () => {
    const reportWorkloadSummary: ReportWorkloadSummary = {
      ...BasicReportWorkloadSummary,
      osInformation: [
        {
          osFamily: 'Windows Server',
          version: null,
          total: 10,
          priority: 100,
        },
        {
          osFamily: 'CentOS',
          version: null,
          total: 20,
          priority: 90,
        },
        {
          osFamily: 'Ubuntu',
          version: null,
          total: 20,
          priority: 80,
        },
        {
          osFamily: 'Other',
          version: null,
          total: 15,
          priority: 70,
        },
      ],
    };

    const wrapper = shallow(<OSInformation reportWorkloadSummary={reportWorkloadSummary} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('expect to render empty card when undefined reportWorkloadSummary', () => {
    const wrapper = shallow(<OSInformation reportWorkloadSummary={null} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('expect to render empty card when no java runtimes', () => {
    const reportWorkloadSummary: ReportWorkloadSummary = {
      ...BasicReportWorkloadSummary,
      javaRuntimes: [],
    };

    const wrapper = shallow(<OSInformation reportWorkloadSummary={reportWorkloadSummary} />);
    expect(wrapper).toMatchSnapshot();
  });
});
