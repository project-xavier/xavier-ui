import React from 'react';
import { shallow } from 'enzyme';
import { ApplicationPlatformsCard } from './ApplicationPlatformsCard';
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
    openjdk: 5,
    jbosseap: 1,
  },
  scanRunModels: [],
  summaryModels: [],
  workloadsDetectedOSTypeModels: [],
  javaRuntimes: [],
  applicationPlatforms: [],
  osInformation: [],
};

describe('ApplicationPlatformsCard', () => {
  it('expect to render', () => {
    const reportWorkloadSummary: ReportWorkloadSummary = {
      ...BasicReportWorkloadSummary,
      applicationPlatforms: [
        {
          name: 'Application1',
          version: null,
          total: 10,
          priority: 100,
        },
        {
          name: 'Application2',
          version: null,
          total: 20,
          priority: 100,
        },
        {
          name: 'Application2',
          version: null,
          total: 15,
          priority: 100,
        },
      ],
    };

    const wrapper = shallow(
      <ApplicationPlatformsCard reportWorkloadSummary={reportWorkloadSummary} />
    );
    expect(wrapper).toMatchSnapshot();
  });

  it('expect to render empty card when undefined reportWorkloadSummary', () => {
    const wrapper = shallow(<ApplicationPlatformsCard reportWorkloadSummary={null} />);
    expect(wrapper).toMatchSnapshot();
  });

  it('expect to render empty card when no java runtimes', () => {
    const reportWorkloadSummary: ReportWorkloadSummary = {
      ...BasicReportWorkloadSummary,
      javaRuntimes: [],
    };

    const wrapper = shallow(
      <ApplicationPlatformsCard reportWorkloadSummary={reportWorkloadSummary} />
    );
    expect(wrapper).toMatchSnapshot();
  });
});
