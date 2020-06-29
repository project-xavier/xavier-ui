import React from 'react';
import {
    Skeleton,
    SkeletonTable
} from '@redhat-cloud-services/frontend-components';
import {
    Card,
    CardBody,
    CardHeader,
    Stack,
    StackItem,
    Bullseye,
    EmptyState,
    EmptyStateVariant,
    EmptyStateIcon,
    Title,
    TitleLevel,
    EmptyStateBody,
    Button,
    Tooltip
} from '@patternfly/react-core';

import { Report, ReportInitialSavingEstimation } from '../../../models';
import { formatValue } from '../../../Utilities/formatValue';
import { FancyGroupedBarChartData } from '../../../PresentationalComponents/FancyGroupedBarChart/FancyGroupedBarChart';

import Environment from '../../../PresentationalComponents/Reports/Environment';
import RenewalEstimation from '../../../PresentationalComponents/Reports/RenewalEstimation';
import FancyChartDonut from '../../../PresentationalComponents/FancyChartDonut';
import FancyGroupedBarChart from '../../../PresentationalComponents/FancyGroupedBarChart';
import ReportCard from '../../../PresentationalComponents/ReportCard';
import ProjectCostBreakdownTable from '../../../PresentationalComponents/Reports/ProjectCostBreakdownTable';
import { ObjectFetchStatus } from '../../../models/state';
import { ErrorCircleOIcon, HelpIcon } from '@patternfly/react-icons';
import {
    ChartAxisProps,
    ChartLegendProps,
    ChartProps,
    ChartGroupProps,
    ChartBarProps
} from '@patternfly/react-charts';
import { FancyChartDonutData } from '../../../PresentationalComponents/FancyChartDonut/FancyChartDonut';

interface StateToProps {
    report: Report | null;
    reportInitialSavingEstimation: ReportInitialSavingEstimation | null;
    reportInitialSavingEstimationFetchStatus: ObjectFetchStatus;
}

interface DispatchToProps {
    fetchReportInitialSavingEstimation: (reportId: number) => any;
}

interface Props extends StateToProps, DispatchToProps {
    reportId: number;
};

interface State {
};

const sumReducer = (a: number, b: number): number => a + b;

class InitialSavingsEstimation extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    public componentDidMount() {
        this.refreshData();
    }

    public refreshData = () => {
        const { reportId, fetchReportInitialSavingEstimation } = this.props;
        fetchReportInitialSavingEstimation(reportId);
    };

    public renderErrorCard = (title: any) => {
        return (
            <ReportCard title={title}>
                There is no enough data to render this card.
            </ReportCard>
        );
    };

    public renderInfo = () => {
        const { reportInitialSavingEstimation } = this.props;
        const title = "Over 3 year(s) with Red Hat Virtualization, your initial savings estimation could be as much as:";
        
        if (!reportInitialSavingEstimation) {
            return this.renderErrorCard(title);
        }

        return (
            <ReportCard
                title={title}
            >
                <p className="pf-c-title pf-m-4xl pf-u-text-align-center">
                    <span>
                        { formatValue(reportInitialSavingEstimation.rhvSavingsModel.rhvSaveHighValue, 'usd', { fractionDigits: 0 }) }
                    </span>
                </p>
            </ReportCard>
        );
    };

    public renderCostExpenditureComparison = () => {
        const { reportInitialSavingEstimation } = this.props;
        const title = "Cost expenditure comparison during the 3 year migration";

        if (!reportInitialSavingEstimation) {
            return this.renderErrorCard(title);
        }

        const sourceRampDownCostsModel = reportInitialSavingEstimation.sourceRampDownCostsModel;
        const rhvRampUpCostsModel = reportInitialSavingEstimation.rhvRampUpCostsModel;

        // VMware values
        const vmwareCostsYear1 = sourceRampDownCostsModel.year1SourceMaintenanceTotalValue;
        const vmwareCostsYear2 = sourceRampDownCostsModel.year2SourceMaintenanceTotalValue;
        const vmwareCostsYear3 = sourceRampDownCostsModel.year3SourceMaintenanceTotalValue;

        // RHV values
        const rhvCostsYear1 = rhvRampUpCostsModel.year1RhvGrandTotalGrowthValue + rhvRampUpCostsModel.rhvSwitchLearningSubsValue;
        const rhvCostsYear2 = rhvRampUpCostsModel.year2RhvGrandTotalGrowthValue;
        const rhvCostsYear3 = rhvRampUpCostsModel.year3RhvGrandTotalGrowthValue;

        // Chart config
        const legendProps: ChartLegendProps = { height: 20, x: 130 };
        const chartProps: ChartProps = {
            width: 650,
            height: 300,
            domainPadding: {
                x: 110,
                y: 60
            },
            padding: { left: 110, right: 20, bottom: 30, top: 0 }
        };
        const chartGroupProps: ChartGroupProps = { offset: 50 };
        const chartBarProps: ChartBarProps = { barWidth: 50 };

        const barChartData: FancyGroupedBarChartData = {
            legends: [ 'VMware costs', 'Red Hat Virtualization costs' ],
            colors: undefined,
            values: [
                [
                    { x: '1', y: vmwareCostsYear1, label: formatValue(vmwareCostsYear1, 'usd', { fractionDigits: 0 }) },
                    { x: '2', y: vmwareCostsYear2, label: formatValue(vmwareCostsYear2, 'usd', { fractionDigits: 0 }) },
                    { x: '3', y: vmwareCostsYear3, label: formatValue(vmwareCostsYear3, 'usd', { fractionDigits: 0 }) }
                ],
                [
                    { x: '1', y: rhvCostsYear1, label: formatValue(rhvCostsYear1, 'usd', { fractionDigits: 0 }) },
                    { x: '2', y: rhvCostsYear2, label: formatValue(rhvCostsYear2, 'usd', { fractionDigits: 0 }) },
                    { x: '3', y: rhvCostsYear3, label: formatValue(rhvCostsYear3, 'usd', { fractionDigits: 0 }) }
                ]
            ]
        };

        const dependentChartAxisProps: ChartAxisProps = {
            tickFormat: (tick: any) =>  `${formatValue(tick, 'usd', { fractionDigits: 0 })}`
        };

        const footer = (
            <div className="pf-u-text-align-center">
                <span style={ { marginLeft: 95 } }>Year</span>
            </div>
        );

        return (
            <ReportCard
                title={title}
            >
                <FancyGroupedBarChart
                    data={ barChartData }
                    legendProps={ legendProps }
                    chartProps={ chartProps }
                    chartGroupProps={ chartGroupProps }
                    chartBarProps={ chartBarProps }
                    dependentChartAxisProps={ dependentChartAxisProps }
                    footer={ footer }
                />
            </ReportCard>
        );
    };

    public renderEnvironment = () => {
        const { reportInitialSavingEstimation } = this.props;
        const title = "Environment";
        
        if (!reportInitialSavingEstimation) {
            return this.renderErrorCard(title);
        }

        return (
            <ReportCard title={title} skipBullseye={true}>
                <Environment data={ reportInitialSavingEstimation.environmentModel } />
            </ReportCard>
        );
    };

    public renderRenewalEstimation = () => {
        const { reportInitialSavingEstimation } = this.props;
        const title = "VMware ELA renewal estimation";
        
        if (!reportInitialSavingEstimation) {
            return this.renderErrorCard(title);
        }

        return (
            <ReportCard title={title} skipBullseye={true}>
                <RenewalEstimation data={ reportInitialSavingEstimation.sourceCostsModel } />
            </ReportCard>
        );
    };

    public renderTotalMaintenance = () => {
        const { reportInitialSavingEstimation } = this.props;
        const title = (<span>
            <span>Total costs during 3 years migration</span>
            <span style={{float: 'right'}}>
                <Tooltip
                    position="right"
                    content={
                        <div>Includes VMWare maintenance, Red Hat virtualization subscriptions, training and services</div>
                    }
                >
                    <HelpIcon />
                </Tooltip>
            </span>
        </span>);

        if (!reportInitialSavingEstimation) {
            return this.renderErrorCard(title);
        }

        const sourceRampDownCostsModel = reportInitialSavingEstimation.sourceRampDownCostsModel;
        const rhvRampUpCostsModel = reportInitialSavingEstimation.rhvRampUpCostsModel;

        const vmwareTotal = [
            sourceRampDownCostsModel.year1SourceMaintenanceTotalValue,
            sourceRampDownCostsModel.year2SourceMaintenanceTotalValue,
            sourceRampDownCostsModel.year3SourceMaintenanceTotalValue
        ].reduce(sumReducer, 0);

        const rhvHypervisorsTotal = [
            rhvRampUpCostsModel.year1RhvTotalValue,
            rhvRampUpCostsModel.year2RhvTotalValue,
            rhvRampUpCostsModel.year3RhvTotalValue
        ].reduce(sumReducer, 0);

        const rhvGrowthTotal = [
            (rhvRampUpCostsModel.year1RhvTotalGrowthValue || 0),
            (rhvRampUpCostsModel.year2RhvTotalGrowthValue || 0),
            (rhvRampUpCostsModel.year3RhvTotalGrowthValue || 0)
        ].reduce(sumReducer, 0);

        const rhTrainingTotal = rhvRampUpCostsModel.rhvSwitchLearningSubsValue;
        const rhConsultingTotal = rhvRampUpCostsModel.rhvSwitchConsultValue;
        const rhTravelAndLodgingTotal = rhvRampUpCostsModel.rhvSwitchTAndEValue;

        //
        const pieValues = [
            vmwareTotal,
            rhvHypervisorsTotal,
            rhvGrowthTotal,
            rhTrainingTotal,
            rhConsultingTotal,
            rhTravelAndLodgingTotal
        ];
        const total = pieValues.reduce(sumReducer, 0);
        const percentages = pieValues.map((val) => ((val / total) * 100));

        const chartProps = {
            title: formatValue(total, 'usd', { fractionDigits: 0 }),
            height: 240,
            width: 670
        };

        const chartData: FancyChartDonutData[] = [
            { label: 'VMware', value: percentages[0] },
            { label: 'Red Hat Virtualization hypervisors', value: percentages[1] },
            { label: 'Red Hat Virtualization growth', value: percentages[2] },
            { label: 'Red Hat training', value: percentages[3] },
            { label: 'Red Hat consulting', value: percentages[4] },
            { label: 'Travel and lodging', value: percentages[5] }
        ];

        const tickFormat = (label: string, value: number) => `${label}: ${value.toFixed(2)}%`;
        const tooltipFormat = ({datum}) => `${datum.x} \n ${datum.y.toFixed(2)}%`;

        return (
            <ReportCard title={title}>
                <FancyChartDonut
                    data={ chartData }
                    chartProps={ chartProps }
                    tickFormat={ tickFormat }
                    tooltipFormat={ tooltipFormat }
                />
            </ReportCard>
        );
    };

    public renderProjectCostBreakdown = () => {
        const { reportInitialSavingEstimation } = this.props;
        const title = "Project cost breakdown";

        if (!reportInitialSavingEstimation) {
            return this.renderErrorCard(title);
        }

        const sourceRampDownCostsModel = reportInitialSavingEstimation.sourceRampDownCostsModel;
        const rhvRampUpCostsModel = reportInitialSavingEstimation.rhvRampUpCostsModel;

        // Bar chart values
        const vmwareTotal = [
            sourceRampDownCostsModel.year1SourceMaintenanceTotalValue,
            sourceRampDownCostsModel.year2SourceMaintenanceTotalValue,
            sourceRampDownCostsModel.year3SourceMaintenanceTotalValue
        ].reduce(sumReducer, 0);

        const rhvHypervisorsTotal = [
            rhvRampUpCostsModel.year1RhvTotalValue,
            rhvRampUpCostsModel.year2RhvTotalValue,
            rhvRampUpCostsModel.year3RhvTotalValue
        ].reduce(sumReducer, 0);

        const rhvGrowthTotal = [
            rhvRampUpCostsModel.year1RhvTotalGrowthValue || 0,
            rhvRampUpCostsModel.year2RhvTotalGrowthValue || 0,
            rhvRampUpCostsModel.year3RhvTotalGrowthValue || 0
        ].reduce(sumReducer, 0);

        const rhTrainingTotal = rhvRampUpCostsModel.rhvSwitchLearningSubsValue;
        const rhConsultingTotal = rhvRampUpCostsModel.rhvSwitchConsultValue;
        const rhTravelAndLodgingTotal = rhvRampUpCostsModel.rhvSwitchTAndEValue;

        // Chart config
        const chartProps: ChartProps = {
            width: 650,
            height: 350,
            domainPadding: {
                x: 50,
                y: 60
            },
            padding: { left: 110, right: 0, bottom: 100, top: 0 }
        };
        const chartGroupProps: ChartGroupProps = { offset: 0 };
        const chartBarProps: ChartBarProps = { barWidth: 50 };

        const barChartData: FancyGroupedBarChartData = {
            legends: undefined,
            colors: undefined,
            values: [
                [{ x: 'VMware', y: vmwareTotal, label: formatValue(vmwareTotal, 'usd', { fractionDigits: 0 }) }],
                [{ x: 'RVH Hypervisors', y: rhvHypervisorsTotal, label: formatValue(rhvHypervisorsTotal, 'usd', { fractionDigits: 0 }) }],
                [{ x: 'RHV Growth', y: rhvGrowthTotal, label: formatValue(rhvGrowthTotal, 'usd', { fractionDigits: 0 }) }],
                [{ x: 'Red Hat Training', y: rhTrainingTotal, label: formatValue(rhTrainingTotal, 'usd', { fractionDigits: 0 }) }],
                [{ x: 'Red Hat Consulting', y: rhConsultingTotal, label: formatValue(rhConsultingTotal, 'usd', { fractionDigits: 0 }) }],
                [{ x: 'Travel and lodging', y: rhTravelAndLodgingTotal, label: formatValue(rhTravelAndLodgingTotal, 'usd', { fractionDigits: 0 }) }]
            ]
        };

        const tickLabels = {
            angle: -45,
            padding: 1,
            textAnchor: 'end'
        };
        const independentChartAxisProps: ChartAxisProps = {
            style: {
                tickLabels
            }
        };

        const dependentChartAxisProps: ChartAxisProps = {
            tickFormat: (tick: any) =>  `${formatValue(tick, 'usd', { fractionDigits: 0 })}`
        };

        const footer = (
            <div className="pf-u-text-align-center">
                <span style={ { marginLeft: 70 } }>Migration Cost Breakdown</span>
            </div>
        );

        return (
            <ReportCard title={title}>
                <FancyGroupedBarChart
                    data={ barChartData }
                    chartProps={ chartProps }
                    chartGroupProps={ chartGroupProps }
                    chartBarProps={ chartBarProps }
                    independentChartAxisProps={ independentChartAxisProps }
                    dependentChartAxisProps={ dependentChartAxisProps }
                    footer={ footer }
                />
            </ReportCard>
        );
    };

    public renderProjectCostBreakdownTable = () => {
        const { reportInitialSavingEstimation } = this.props;
        const title = "Project cost breakdown";

        if (!reportInitialSavingEstimation) {
            return this.renderErrorCard(title);
        }

        return (
            <ReportCard title={title} skipBullseye={true}>
                <ProjectCostBreakdownTable
                    rhvRampUpCostsModel={ reportInitialSavingEstimation.rhvRampUpCostsModel }
                    sourceRampDownCostsModel={ reportInitialSavingEstimation.sourceRampDownCostsModel }
                />
            </ReportCard>
        );
    };

    public renderReports = () => {
        return (
            <React.Fragment>
                <Stack gutter='md'>
                    <StackItem isFilled={ false }>
                        { this.renderInfo() }
                    </StackItem>
                    <StackItem isFilled={ false }>
                        <div className="pf-l-grid pf-m-all-6-col-on-lg pf-m-gutter">
                            { this.renderCostExpenditureComparison() }
                            { this.renderEnvironment() }
                        </div>
                    </StackItem>
                    <StackItem isFilled={ false }>
                        <div className="pf-l-grid pf-m-all-6-col-on-lg pf-m-gutter">
                            { this.renderTotalMaintenance() }
                            { this.renderRenewalEstimation() }
                        </div>
                    </StackItem>
                    <StackItem isFilled={ false }>
                        <div className="pf-l-grid pf-m-all-6-col-on-lg pf-m-gutter">
                            { this.renderProjectCostBreakdown() }
                            { this.renderProjectCostBreakdownTable() }
                        </div>
                    </StackItem>
                    <StackItem isFilled={ false }>
                        <Card>
                            <CardHeader>Disclaimer</CardHeader>
                            <CardBody>
                                <p>
                                    This website does not constitute an offer to sell, a solicitation of an offer to buy,
                                    or a recommendation of any security or any other product or service by Red Hat, Inc.
                                    or any other third party regardless of whether such product or service is referenced
                                    in this report.
                                </p>
                            </CardBody>
                        </Card>
                    </StackItem>
                </Stack>
            </React.Fragment>
        );
    };

    public renderReportsSkeleton = () => {
        return (
            <React.Fragment>
                <Stack gutter='md'>
                    <StackItem isFilled={ false }>
                        <ReportCard
                            title={ <Skeleton size="sm" /> }
                            skipBullseye={ true }
                        >
                            <Stack gutter="md">
                                <StackItem isFilled={ false }>
                                    <Skeleton size="lg"/>
                                </StackItem>
                            </Stack>
                        </ReportCard>
                    </StackItem>
                    <StackItem isFilled={ false }>
                        <div className="pf-l-grid pf-m-all-6-col-on-lg pf-m-gutter">
                            <ReportCard
                                title={ <Skeleton size="sm" /> }
                            >
                                <Skeleton size="sm" style={ { height: '300px' } }/>
                            </ReportCard>
                            <ReportCard
                                title={ <Skeleton size="sm" /> }
                            >
                                <SkeletonTable colSize={ 3 } rowSize={ 3 }/>
                            </ReportCard>
                        </div>
                    </StackItem>
                    <StackItem isFilled={ false }>
                        <div className="pf-l-grid pf-m-all-6-col-on-lg pf-m-gutter">
                            <ReportCard
                                title={ <Skeleton size="sm" /> }
                            >
                                <Skeleton size="sm" style={ { height: '300px' } }/>
                            </ReportCard>
                            <ReportCard
                                title={ <Skeleton size="sm" /> }
                            >
                                <SkeletonTable colSize={ 2 } rowSize={ 2 }/>
                            </ReportCard>
                        </div>
                    </StackItem>
                    <StackItem isFilled={ false }>
                        <div className="pf-l-grid pf-m-all-6-col-on-lg pf-m-gutter">
                            <ReportCard
                                title={ <Skeleton size="sm" /> }
                            >
                                <Skeleton size="sm" style={ { height: '300px' } }/>
                            </ReportCard>
                            <ReportCard
                                title={ <Skeleton size="sm" /> }
                            >
                                <SkeletonTable colSize={ 3 } rowSize={ 3 }/>
                            </ReportCard>
                        </div>
                    </StackItem>
                </Stack>
            </React.Fragment>
        );
    };

    public renderFetchError = () => {
        return (
            <Bullseye>
                <EmptyState variant={ EmptyStateVariant.large }>
                    <EmptyStateIcon icon={ ErrorCircleOIcon } />
                    <Title headingLevel={ TitleLevel.h5 } size="lg">
                        Error
                    </Title>
                    <EmptyStateBody>
                        Something unexpected happend, please try again!
                    </EmptyStateBody>
                    <Button variant="primary" onClick={ this.refreshData }>Retry</Button>
                </EmptyState>
            </Bullseye>
        );
    };

    public render() {
        const { reportInitialSavingEstimation, reportInitialSavingEstimationFetchStatus } = this.props;

        const isFetchComplete: boolean = reportInitialSavingEstimationFetchStatus.status === 'complete';

        if (reportInitialSavingEstimationFetchStatus.error || (isFetchComplete && !reportInitialSavingEstimation)) {
            return this.renderFetchError();
        }

        return (
            <React.Fragment>
                { isFetchComplete ? this.renderReports() : this.renderReportsSkeleton() }
            </React.Fragment>
        );
    }
}

export default InitialSavingsEstimation;
