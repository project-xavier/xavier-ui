import React from 'react';
import { RouterGlobalProps } from '../../../models/router';
import {
    Card,
    CardBody,
    CardHeader,
    Stack,
    StackItem
} from '@patternfly/react-core';
import { Report, ReportInitialSavingEstimation } from '../../../models';
import {
    Skeleton,
    SkeletonTable
} from '@redhat-cloud-services/frontend-components';
import './InitialSavingsEstimation.scss';
import { formatValue } from '../../../Utilities/formatValue';
import Environment from '../../../PresentationalComponents/Reports/Environment';
import RenewalEstimation from '../../../PresentationalComponents/Reports/RenewalEstimation';
import FancyChartDonut from '../../../PresentationalComponents/FancyChartDonut';
import FancyBarChart from '../../../PresentationalComponents/FancyBarChart';
import { FancyGroupedBarChartData } from '../../../PresentationalComponents/FancyGroupedBarChart/FancyGroupedBarChart';
import FancyGroupedBarChart from '../../../PresentationalComponents/FancyGroupedBarChart';
import ReportCard from '../../../PresentationalComponents/ReportCard';
import ProjectCostBreakdownTable from '../../../PresentationalComponents/Reports/ProjectCostBreakdownTable';
import ProjectCostBreakdownInYear4 from '../../../PresentationalComponents/Reports/ProjectCostBreakdownInYear4';
import ProjectCostBreakdownInYear4PerVM from '../../../PresentationalComponents/Reports/ProjectCostBreakdownInYear4PerVM';

interface StateToProps {
    report: Report;
    reportInitialSavingEstimation: ReportInitialSavingEstimation;
}

interface DispatchToProps {
    fetchReportInitialSavingEstimation: (reportId: number) => any;
}

interface Props extends StateToProps, DispatchToProps, RouterGlobalProps {
};

interface State {
};

class InitialSavingsEstimation extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    componentDidMount() {
        this.refreshData();
    }

    refreshData() {
        const { report, fetchReportInitialSavingEstimation } = this.props;
        fetchReportInitialSavingEstimation(report.id);
    }

    renderInfo = () => {
        const { report, reportInitialSavingEstimation } = this.props;

        const skeleton = (
            <Stack gutter="md">
                <StackItem isFilled={ false }>
                    <Skeleton size="sm" />
                    <br />
                    <Skeleton size="sm" style={ { height: '60px' } } />
                    <br />
                    <Skeleton size="sm" />
                </StackItem>
                <StackItem isFilled={ false } className="stack-item-border">
                    <Skeleton size="lg"/>
                </StackItem>
            </Stack>
        );

        return (
            <ReportCard
                title={ `Initial Savings Estimation (${ report ? report.fileName : '' })` }
                loading={ reportInitialSavingEstimation ? false : true }
                loadingSkeleton={ skeleton }
                headerClass="pf-m-2xl-override"
                bodyClass="pf-c-content no-margin-bottom"
                skipBullseye={ true }
            >
                <p>
                    Report build for a 3 year insfraestructure Migration for Acme Inc.
                </p>
                <p>
                    <span>Source:</span>&nbsp;
                    <span>Vmware Vsphere Enterprise Plus + Oracle Web Logic</span><br />
                    <span>Target:</span>&nbsp;
                    <span>Red Hat Virtualization + JBoss Enterprise Application Platform</span><br />
                    <span>Date:</span>&nbsp;
                    <span>{ new Date(report.creationDate).toUTCString() }</span>
                </p>
                <p>
                    <span>Over 3 year(s) with Red Hat Virtualization, your initial savings estimation could be as much as</span>
                </p>
                <p className="pf-c-title pf-m-2xl pf-u-text-align-center stack-item-border">
                    <span>
                        { formatValue(reportInitialSavingEstimation ? reportInitialSavingEstimation.rhvSavingsModel.rhvSaveHighValue : 0, 'usd') }
                    </span>
                </p>
            </ReportCard>
        );
    }

    renderCostExpenditureComparison = () => {
        const { reportInitialSavingEstimation } = this.props;

        // TODO change values
        const data: FancyGroupedBarChartData = {
            labels: [ 'VMware Costs', 'RHV Costs' ],
            colors: [ '#0066CC', '#C9190B' ],
            values: [
                [{ x: '1', y: 1000000 }, { x: '2', y: 2000000 }, { x: '3', y: 3000000 }],
                [{ x: '1', y: 4000000 }, { x: '2', y: 5000000 }, { x: '3', y: 6500000 }]
                // [{ x: '1', y: 100 }, { x: '2', y: 200 }, { x: '3', y: 300 }],
                // [{ x: '1', y: 400 }, { x: '2', y: 500 }, { x: '3', y: 600 }]
            ]
        };

        const chartProps = {
            width: 650,
            height: 300,
            domainPadding: {
                x: 110,
                y: 60
            },
            padding: { left: 150, right: 20, bottom: 30, top: 0 }
        };

        const footer = (
            <div className="pf-u-text-align-center">
                <span style={ { marginLeft: 130 } }>Year</span>
            </div>
        );

        return (
            <ReportCard
                title="Cost expenditure comparison during the 3 year migration"
                loading={ reportInitialSavingEstimation ? false : true }
                loadingSkeleton={ <Skeleton size="sm" style={ { height: '300px' } }/> }
            >
                <FancyGroupedBarChart
                    data={ data }
                    legendProps={ { height: 20, x: 130 } }
                    chartProps={ chartProps }
                    chartGroupProps={ { offset: 50 } }
                    chartBarProps={ { barWidth: 50 } }
                    tickFormat={ { y: (tick: any) => `${formatValue(tick, 'usd')}` } }
                    footer={ footer }
                />
            </ReportCard>
        );
    };

    renderEnvironment = () => {
        const { reportInitialSavingEstimation } = this.props;

        return (
            <ReportCard
                title="Environment"
                loading={ reportInitialSavingEstimation ? false : true }
                loadingSkeleton={ <SkeletonTable colSize={ 3 } rowSize={ 3 }/> }
            >
                {
                    reportInitialSavingEstimation &&
                    <Environment
                        data={ reportInitialSavingEstimation.environmentModel }
                    />
                }
            </ReportCard>
        );
    }

    renderRenewalEstimation = () => {
        const { reportInitialSavingEstimation } = this.props;

        return (
            <ReportCard
                title="VMware ELA renewal estimation"
                loading={ reportInitialSavingEstimation ? false : true }
                loadingSkeleton={ <SkeletonTable colSize={ 2 } rowSize={ 2 }/> }
            >
                {
                    reportInitialSavingEstimation &&
                    <RenewalEstimation
                        data={ reportInitialSavingEstimation.sourceCostsModel }
                    />
                }
            </ReportCard>
        );
    }

    renderCostBreakdown = () => {
        const { reportInitialSavingEstimation } = this.props;

        const data = [
            { label: 'Support', value: 32.6, color: '#004B95' },
            { label: 'vSphere Plus Lic.', value: 67.4, color: '#519DE9' }
        ];

        return (
            <FancyChartDonut
                title='Cost breakdown for VMware ELA (using "most likely" estimation)'
                total = { reportInitialSavingEstimation.sourceCostsModel.sourceRenewLikelyValue }
                data={ data }
                suffix = "%"
            />
        );
    }

    renderTotalMaintenance = () => {
        const { reportInitialSavingEstimation } = this.props;
        const {
            rhvSwitchTAndEValue,
            rhvSwitchConsultValue,
            rhvSwitchLearningSubsValue
        } = reportInitialSavingEstimation.rhvRampUpCostsModel;

        const data = [
            { label: 'Travel and Lodging', value: rhvSwitchTAndEValue, color: '#5C969D' },
            { label: 'Red Hat Consulting', value: rhvSwitchConsultValue, color: '#F0AB00' },
            { label: 'Red Hat Training', value: rhvSwitchLearningSubsValue, color: '#509149' },
            { label: 'RHV Growth', value: 2.4, color: '#C58C00' },
            { label: 'RHV Hypervisors', value: 18.1, color: '#C9190B' },
            { label: 'VMware', value: 68, color: '#519DE9' }
        ];

        return (
            <FancyChartDonut
                title='Cost breakdown for VMware ELA (using "most likely" estimation)'
                data={ data }
                suffix = "%"
            />
        );
    }

    renderProjectCostBreakdown = () => {
        const { reportInitialSavingEstimation } = this.props;

        // TODO change values
        const data: FancyGroupedBarChartData = {
            colors: [ '#0066CC', '#C9190B', '#C58C00', '#509149', '#EF9234', '#5C969D' ],
            values: [
                [{ x: 'VMware', y: 1000000 }],
                [{ x: 'RVH Hypervisors', y: 400000 }],
                [{ x: 'RHV Growth', y: 40000 }],
                [{ x: 'Red Hat Training', y: 40000 }],
                [{ x: 'Red Hat', y: 40000 }],
                [{ x: 'Travel and lodging', y: 40000 }]
            ]
        };

        const chartProps = {
            width: 650,
            height: 300,
            domainPadding: {
                x: 50,
                y: 60
            },
            padding: { left: 150, right: 0, bottom: 100, top: 0 }
        };

        const footer = (
            <div className="pf-u-text-align-center">
                <span style={ { marginLeft: 130 } }>Migration Cost Breakdown</span>
            </div>
        );

        return (
            <ReportCard
                title="Project cost breakdown"
                loading={ reportInitialSavingEstimation ? false : true }
                loadingSkeleton={ <Skeleton size="sm" style={ { height: '300px' } }/> }
            >
                <FancyBarChart
                    data={ data }
                    chartProps={ chartProps }
                    chartGroupProps={ { offset: 0 } }
                    chartBarProps={ { barWidth: 50 } }
                    tickFormat={ { y: (tick: any) => `${formatValue(tick, 'usd')}` } }
                    footer={ footer }
                />
            </ReportCard>
        );
    }

    renderProjectCostBreakdownTable = () => {
        const { reportInitialSavingEstimation } = this.props;

        return (
            <ReportCard
                title="Project cost breakdown"
                loading={ reportInitialSavingEstimation ? false : true }
                loadingSkeleton={ <SkeletonTable colSize={ 2 } rowSize={ 2 }/> }
            >
                {
                    reportInitialSavingEstimation &&
                    <ProjectCostBreakdownTable
                        rhvRampUpCostsModel={ reportInitialSavingEstimation.rhvRampUpCostsModel }
                        sourceRampDownCostsModel={ reportInitialSavingEstimation.sourceRampDownCostsModel }
                    />
                }
            </ReportCard>
        );
    }

    renderProjectCostBreakdownInYear4 = () => {
        const { reportInitialSavingEstimation } = this.props;

        return (
            <ReportCard
                title="Project cost breakdown in year 4"
                loading={ reportInitialSavingEstimation ? false : true }
                loadingSkeleton={ <SkeletonTable colSize={ 2 } rowSize={ 2 }/> }
            >
                <ProjectCostBreakdownInYear4
                />
            </ReportCard>
        );
    }

    renderProjectCostBreakdownInYear4PerVM = () => {
        const { reportInitialSavingEstimation } = this.props;

        return (
            <ReportCard
                title="Project cost breakdown in year 4, Per VM"
                loading={ reportInitialSavingEstimation ? false : true }
                loadingSkeleton={ <SkeletonTable colSize={ 2 } rowSize={ 2 }/> }
            >
                <ProjectCostBreakdownInYear4PerVM
                />
            </ReportCard>
        );
    }

    render() {
        return (
            <React.Fragment>
                <Stack gutter='md'>
                    <StackItem isFilled={ false }>
                        { this.renderInfo() }
                    </StackItem>
                    <StackItem isFilled={ false }>
                        { this.renderCostExpenditureComparison() }
                    </StackItem>
                    <StackItem isFilled={ false }>
                        { this.renderEnvironment() }
                    </StackItem>
                    <StackItem isFilled={ false }>
                        { this.renderRenewalEstimation() }
                    </StackItem>
                    { /* <StackItem isFilled={ false }>
                        { reportInitialSavingEstimation ? this.renderCostBreakdown() : <Skeleton size="sm"/> }
                    </StackItem> */ }
                    { /* <StackItem isFilled={ false }>
                        { this.renderTotalMaintenance() }
                    </StackItem> */ }
                    <StackItem isFilled={ false }>
                        { this.renderProjectCostBreakdown() }
                    </StackItem>
                    <StackItem isFilled={ false }>
                        { this.renderProjectCostBreakdownTable() }
                    </StackItem>
                    <StackItem isFilled={ false }>
                        { this.renderProjectCostBreakdownInYear4() }
                    </StackItem>
                    <StackItem isFilled={ false }>
                        { this.renderProjectCostBreakdownInYear4PerVM() }
                    </StackItem>
                    <StackItem isFilled={ false }>
                        <Card>
                            <CardHeader>Disclaimer</CardHeader>
                            <CardBody>
                                <p>
                                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut
                                    labore et dolore magna aliqua.Ut enim ad minim veniam, quis nostrud exercitation ullamco
                                    laboris nisi ut aliquip ex ea commodo consequat. Learn more about this in the documentation.
                                </p>
                            </CardBody>
                        </Card>
                    </StackItem>
                </Stack>
            </React.Fragment>
        );
    }
}

export default InitialSavingsEstimation;
