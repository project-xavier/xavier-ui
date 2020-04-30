import React from 'react';
import { shallow } from 'enzyme';
import { WorkloadMigrationSummary, WorkloadMigrationSummaryProps } from './WorkloadSummary';

describe('WorkloadMigrationSummary', () => {
    it('expect to render error', () => {
        const props: WorkloadMigrationSummaryProps = {
            reportId: 1,
            reportWorkloadSummary: null,
            reportWorkloadSummaryFetchStatus: { error: 'Error message', status: 'complete' },
            fetchReportWorkloadSummary: (reportId: number) => ({
                then: () => ({
                    catch: jest.fn()
                })
            })
        };
        const wrapper = shallow(<WorkloadMigrationSummary {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('expect to render skeleton', () => {
        const props: WorkloadMigrationSummaryProps = {
            reportId: 1,
            reportWorkloadSummary: null,
            reportWorkloadSummaryFetchStatus: { error: null, status: 'inProgress' },
            fetchReportWorkloadSummary: (reportId: number) => ({
                then: () => ({
                    catch: jest.fn()
                })
            })
        };
        const wrapper = shallow(<WorkloadMigrationSummary {...props} />);
        expect(wrapper).toMatchSnapshot();
    });

    it('expect to render reports', () => {
        const props: WorkloadMigrationSummaryProps = {
            reportId: 1,
            reportWorkloadSummary: {
                summaryModels: [
                    {
                        provider: 'VMware',
                        clusters: 1,
                        sockets: 164,
                        vms: 126,
                        hosts: 2,
                        product: 'VMware vCenter',
                        version: '6.5'
                    }
                ],
                complexityModel: { easy: 111, medium: 11, hard: 0, unknown: 0, unsupported: 4 },
                recommendedTargetsIMSModel: { total: 126, rhv: 122, rhel: 7, osp: 121, ocp: 111 },
                workloadsDetectedOSTypeModels: [{ osName: 'ServerNT', total: 1 }, { osName: 'Linux', total: 4 }],
                scanRunModels: [{ target: 'VMware', date: 1580774400000, smartStateEnabled: true }],
                javaRuntimes: [],
                applicationPlatforms: []
            },
            reportWorkloadSummaryFetchStatus: { error: null, status: 'complete' },
            fetchReportWorkloadSummary: (reportId: number) => ({
                then: (callback: any) => {
                    callback();
                    return {
                        catch: jest.fn()
                    };
                }
            })
        };
        const wrapper = shallow(<WorkloadMigrationSummary {...props} />);
        expect(wrapper).toMatchSnapshot();
    });
});
