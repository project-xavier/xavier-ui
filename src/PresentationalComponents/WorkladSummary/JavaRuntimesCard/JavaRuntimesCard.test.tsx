import React from 'react';
import { shallow } from 'enzyme';
import { JavaRuntimesCard } from './JavaRuntimesCard';
import { ReportWorkloadSummary } from 'src/models';

const BasicReportWorkloadSummary: ReportWorkloadSummary = {
    complexityModel: {
        easy: 1,
        hard: 2,
        medium: 3,
        unknown: 4,
        unsupported: 5
    },
    recommendedTargetsIMSModel: {
        ocp: 10,
        osp: 20,
        rhel: 30,
        rhv: 40,
        total: 100,
        openjdk: 8,
        jbosseap: 9
    },
    scanRunModels: [],
    summaryModels: [],
    workloadsDetectedOSTypeModels: [],
    javaRuntimes: [],
    applicationPlatforms: [],
    osInformation: []
};

describe('JavaRuntimesCard', () => {
    it('expect to render', () => {
        const reportWorkloadSummary: ReportWorkloadSummary = {
            ...BasicReportWorkloadSummary,
            javaRuntimes: [
                {
                    vendor: 'VendorA',
                    version: '8',
                    total: 10,
                    priority: 100
                },
                {
                    vendor: 'VendorB',
                    version: '11',
                    total: 20,
                    priority: null
                },
                {
                    vendor: 'VendorB',
                    version: '8',
                    total: 15,
                    priority: 10
                }
            ]
        };

        const wrapper = shallow(<JavaRuntimesCard reportWorkloadSummary={reportWorkloadSummary} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('expect to render empty card when undefined reportWorkloadSummary', () => {
        const wrapper = shallow(<JavaRuntimesCard reportWorkloadSummary={null} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('expect to render empty card when no java runtimes', () => {
        const reportWorkloadSummary: ReportWorkloadSummary = {
            ...BasicReportWorkloadSummary,
            javaRuntimes: []
        };

        const wrapper = shallow(<JavaRuntimesCard reportWorkloadSummary={reportWorkloadSummary} />);
        expect(wrapper).toMatchSnapshot();
    });
});
