import React from 'react';
import { shallow } from 'enzyme';
import { WorkloadsDetectedTable, WorkloadsDetectedTableProps } from './WorkloadsDetectedTable';

describe('WorkloadsDetectedTable', () => {
    it('should render error', () => {
        // Given
        const props: WorkloadsDetectedTableProps = {
            reportId: 1,

            // stateToProps
            reportWorkloadsDetected: { total: 0, items: [] },
            reportWorkloadsDetectedFetchStatus: { error: 'Error fetching data', status: 'complete' },

            // dispatchToProps
            fetchReportWorkloadsDetected: jest.fn()
        };

        // When
        const wrapper = shallow(<WorkloadsDetectedTable {...props} />);

        // Then
        expect(wrapper).toMatchSnapshot();
    });

    it('should render skeleton', () => {
        // Given
        const props: WorkloadsDetectedTableProps = {
            reportId: 1,

            // stateToProps
            reportWorkloadsDetected: { total: 0, items: [] },
            reportWorkloadsDetectedFetchStatus: { error: null, status: 'inProgress' },

            // dispatchToProps
            fetchReportWorkloadsDetected: jest.fn()
        };

        // When
        const wrapper = shallow(<WorkloadsDetectedTable {...props} />);

        // Then
        expect(wrapper).toMatchSnapshot();
    });

    it('should render empty result table', () => {
        // Given
        const props: WorkloadsDetectedTableProps = {
            reportId: 1,

            // stateToProps
            reportWorkloadsDetected: { total: 0, items: [] },
            reportWorkloadsDetectedFetchStatus: { error: null, status: 'complete' },

            // dispatchToProps
            fetchReportWorkloadsDetected: jest.fn()
        };

        // When
        const wrapper = shallow(<WorkloadsDetectedTable {...props} />);

        // Then
        expect(wrapper).toMatchSnapshot();
    });

    it('should render result table', () => {
        // Given
        const props: WorkloadsDetectedTableProps = {
            reportId: 1,

            // stateToProps
            reportWorkloadsDetected: {
                total: 1,
                items: [
                    {
                        workload: 'workload',
                        osName: 'osName',
                        clusters: 1,
                        vms: 2
                    }
                ]
            },
            reportWorkloadsDetectedFetchStatus: { error: null, status: 'complete' },

            // dispatchToProps
            fetchReportWorkloadsDetected: jest.fn()
        };

        // When
        const wrapper = shallow(<WorkloadsDetectedTable {...props} />);

        // Then
        expect(wrapper).toMatchSnapshot();
    });
});
