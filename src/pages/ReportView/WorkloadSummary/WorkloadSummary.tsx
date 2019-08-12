import React from 'react';
import {
    Skeleton,
    SkeletonTable
} from '@redhat-cloud-services/frontend-components';
import { ObjectFetchStatus } from '../../../models/state';
import { ReportWorkloadSummary } from '../../../models';
import {
    Bullseye,
    EmptyState,
    EmptyStateIcon,
    EmptyStateVariant,
    Title,
    EmptyStateBody,
    Button,
    TitleLevel,
    Stack,
    StackItem
} from '@patternfly/react-core';
import { ErrorCircleOIcon } from '@patternfly/react-icons';
import ReportCard from '../../../PresentationalComponents/ReportCard';
import SummaryTable from '../../../PresentationalComponents/Reports/SummaryTable';
import FancyChartDonut from '../../../PresentationalComponents/FancyChartDonut';
import { FancyChartDonutData } from '../../../PresentationalComponents/FancyChartDonut/FancyChartDonut';

interface StateToProps {
    reportWorkloadSummary: ReportWorkloadSummary;
    reportWorkloadSummaryFetchStatus: ObjectFetchStatus;
}

interface DispatchToProps {
    fetchReportWorkloadSummary: (reportId: number) => any;
}

interface Props extends StateToProps, DispatchToProps {
    reportId: number;
};

interface State {
};

class WorkloadMigrationSummary extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    public componentDidMount() {
        this.refreshData();
    }

    public refreshData = () => {
        const { reportId, fetchReportWorkloadSummary } = this.props;
        fetchReportWorkloadSummary(reportId);
    };

    public renderSummary = () => {
        const { reportWorkloadSummary } = this.props;

        return (
            <ReportCard title="Summary">
                <SummaryTable
                    summary={ reportWorkloadSummary.summary }
                />
            </ReportCard>
        );
    };

    public renderMigrationComplexity = () => {
        const { reportInitialSavingEstimation } = this.props;

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
            height: 300,
            width: 300
        };
        const chartLegendProps = {
            height: 300,
            width: 210,
            responsive: false,
            y: 60
        };

        const chartData: FancyChartDonutData[] = [
            { label: 'VMware', value: percentages[0] },
            { label: 'RHV Hypervisors', value: percentages[1] },
            { label: 'RHV Growth', value: percentages[2] },
            { label: 'Red Hat Training', value: percentages[3] },
            { label: 'Red Hat Consulting', value: percentages[4] },
            { label: 'Travel and Lodging', value: percentages[5] }
        ];

        const tickFormat = (label: string, value: number) => `${label}: ${value.toFixed(2)}%`;
        return (
            <ReportCard
                title='Total VMware maintenance, Red Hat Virtualization, training and services costs during a 3 year migration)'
            >
                <FancyChartDonut
                    data={ chartData }
                    chartProps={ chartProps }
                    chartLegendProps={ chartLegendProps }
                    tickFormat={ tickFormat }
                />
            </ReportCard>
        );
    };

    public renderReports = () => {
        return (
            <React.Fragment>
                <Stack gutter='md'>
                    <StackItem isFilled={ false }>
                        { this.renderSummary() }
                    </StackItem>
                    <StackItem isFilled={ false }>
                        { this.renderMigrationComplexity() }
                    </StackItem>
                </Stack>
            </React.Fragment>
        );
    };

    public renderReportSkeleton = () => {
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
                                    <Skeleton size="sm" /><br />
                                    <Skeleton size="sm" style={ { height: '60px' } } /><br />
                                    <Skeleton size="sm" />
                                </StackItem>
                                <StackItem isFilled={ false } className="stack-item-border">
                                    <Skeleton size="lg"/>
                                </StackItem>
                            </Stack>
                        </ReportCard>
                    </StackItem>
                    <StackItem isFilled={ false }>
                        <ReportCard
                            title={ <Skeleton size="sm" /> }
                        >
                            <Skeleton size="sm" style={ { height: '300px' } }/>
                        </ReportCard>
                    </StackItem>
                    <StackItem isFilled={ false }>
                        <ReportCard
                            title={ <Skeleton size="sm" /> }
                        >
                            <SkeletonTable colSize={ 3 } rowSize={ 3 }/>
                        </ReportCard>
                    </StackItem>
                    <StackItem isFilled={ false }>
                        <ReportCard
                            title={ <Skeleton size="sm" /> }
                        >
                            <SkeletonTable colSize={ 2 } rowSize={ 2 }/>
                        </ReportCard>
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
        const { reportWorkloadSummary, reportWorkloadSummaryFetchStatus } = this.props;

        const isFetchComplete: boolean = reportWorkloadSummaryFetchStatus.status === 'complete';

        if (reportWorkloadSummaryFetchStatus.error || (isFetchComplete && !reportWorkloadSummary)) {
            return this.renderFetchError();
        }

        return (
            <React.Fragment>
                { isFetchComplete ? this.renderReports() : this.renderReportSkeleton() }
            </React.Fragment>
        );
    }
}

export default WorkloadMigrationSummary;
