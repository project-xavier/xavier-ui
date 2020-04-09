import React from 'react';
import { shallow } from 'enzyme';
import { FlagsTable, FlagsTableProps } from './FlagsTable';

describe('FlagsTable', () => {
    it('should render error', () => {
        // Given
        const props: FlagsTableProps = {
            reportId: 1,

            // stateToProps
            reportFlags: { total: 0, items: [] },
            reportFlagsFetchStatus: { error: 'Error fetching data', status: 'complete' },

            allFlags: [],
            allFlagsFetchStatus: { error: null, status: 'none' },

            // dispatchToProps
            fetchReportFlags: jest.fn(),
            fetchAllFlagAssessments: jest.fn()
        };

        // When
        const wrapper = shallow(<FlagsTable {...props} />);

        // Then
        expect(wrapper).toMatchSnapshot();
    });

    it('should render skeleton', () => {
        // Given
        const props: FlagsTableProps = {
            reportId: 1,

            // stateToProps
            reportFlags: { total: 0, items: [] },
            reportFlagsFetchStatus: { error: null, status: 'inProgress' },

            allFlags: [],
            allFlagsFetchStatus: { error: null, status: 'none' },

            // dispatchToProps
            fetchReportFlags: jest.fn(),
            fetchAllFlagAssessments: jest.fn()
        };

        // When
        const wrapper = shallow(<FlagsTable {...props} />);

        // Then
        expect(wrapper).toMatchSnapshot();
    });

    it('should render empty result table', () => {
        // Given
        const props: FlagsTableProps = {
            reportId: 1,

            // stateToProps
            reportFlags: {
                total: 0,
                items: []
            },
            reportFlagsFetchStatus: { error: null, status: 'complete' },

            allFlags: [],
            allFlagsFetchStatus: { error: null, status: 'none' },

            // dispatchToProps
            fetchReportFlags: jest.fn(),
            fetchAllFlagAssessments: jest.fn()
        };

        // When
        const wrapper = shallow(<FlagsTable {...props} />);

        // Then
        expect(wrapper).toMatchSnapshot();
    });

    it('should render result table', () => {
        // Given
        const props: FlagsTableProps = {
            reportId: 1,

            // stateToProps
            reportFlags: {
                total: 1,
                items: [
                    {
                        workload: 'workload',
                        flag: 'flag',
                        osName: 'osName',
                        clusters: 1,
                        vms: 2
                    }
                ]
            },
            reportFlagsFetchStatus: { error: null, status: 'complete' },

            allFlags: [],
            allFlagsFetchStatus: { error: null, status: 'none' },

            // dispatchToProps
            fetchReportFlags: jest.fn(),
            fetchAllFlagAssessments: jest.fn()
        };

        // When
        const wrapper = shallow(<FlagsTable {...props} />);

        // Then
        expect(wrapper).toMatchSnapshot();
    });
});
