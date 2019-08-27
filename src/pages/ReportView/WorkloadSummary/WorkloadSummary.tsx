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
import { formatPercentage, formatNumber } from '../../../Utilities/formatValue';
import ScansRunTable from '../../../PresentationalComponents/Reports/ScansRunTable';
import WorkloadsDetectedTable from '../../../SmartComponents/Reports/WorkloadsDetectedTable';
import FlagsTable from '../../../SmartComponents/Reports/FlagsTable';

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

const sumReducer = (a: number, b: number) => a + b;

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

    public renderErrorCard = (title: string) => {
        return (
            <ReportCard title={title}>
                There is no enough data to render this card.
            </ReportCard>
        );
    };
    public renderSummary = () => {
        const { reportWorkloadSummary } = this.props;

        const title="Summary";
        const summary = reportWorkloadSummary.summaryModels;

        if (!summary) {
            return this.renderErrorCard(title);
        }

        return (
            <ReportCard title={title}>
                <SummaryTable summary={ summary } />
            </ReportCard>
        );
    };

    public renderMigrationComplexity = () => {
        const { reportWorkloadSummary } = this.props;

        const title="Migration complexity";
        const complexity = reportWorkloadSummary.complexityModel;

        if (!complexity) {
            return this.renderErrorCard(title);
        }

        //
        const pieValues = [
            complexity.easy,
            complexity.medium,
            complexity.hard,
            complexity.unknown
        ];

        const total = pieValues.reduce(sumReducer, 0);
        const percentages = pieValues.map((val: number) => val / total);

        const chartProps = {
            title: formatNumber(total, 0),
            subTitle: 'Total VMs',
            height: 250,
            width: 250
        };
        const chartLegendProps = {
            height: 300,
            width: 210,
            responsive: false,
            y: 60
        };

        const chartData: FancyChartDonutData[] = [
            { label: 'Easy', value: percentages[0], data: pieValues[0] },
            { label: 'Medium', value: percentages[1], data: pieValues[1] },
            { label: 'Hard', value: percentages[2], data: pieValues[2] },
            { label: 'Unknow', value: percentages[3], data: pieValues[3] }
        ];

        const tickFormat = (label: string, value: number, data: any) => `${label}: ${formatPercentage(value, 2)}`;
        const tooltipFormat = (datum: any, active: boolean) => `${datum.x}: ${formatPercentage(datum.y, 2)} \n VMs: ${formatNumber(datum.data, 0)}`;

        return (
            <ReportCard
                title='Migration complexity'
            >
                <FancyChartDonut
                    data={ chartData }
                    chartProps={ chartProps }
                    chartLegendProps={ chartLegendProps }
                    tickFormat={ tickFormat }
                    tooltipFormat={ tooltipFormat }
                />
            </ReportCard>
        );
    };

    public renderTargetRecommendation = () => {
        const { reportWorkloadSummary } = this.props;

        const title="Target recommendation";
        const recommendedTargetsIMS = reportWorkloadSummary.recommendedTargetsIMSModel;

        if (!recommendedTargetsIMS) {
            return this.renderErrorCard(title);
        }

        const values = [
            recommendedTargetsIMS.rhv,
            recommendedTargetsIMS.osp,
            recommendedTargetsIMS.rhel
        ];
        const total = recommendedTargetsIMS.total;
        const percentages = values.map((val: number) => val / total);
        
        return (
            <ReportCard
                title={title}
                skipBullseye={ true }
            >
                <div className="pf-l-grid pf-m-all-6-col-on-md pf-m-all-4-col-on-lg pf-m-gutter">
                    <div>
                        <h2 className="pf-c-title pf-m-4xl">
                            { formatPercentage(percentages[0], 0) } RHV
                        </h2>
                        <h3 className="pf-c-title pf-m-1xl">
                            Workloads suitable for Red Hat Virtualization
                        </h3>
                    </div>
                    <div>
                        <h2 className="pf-c-title pf-m-4xl">
                            { formatPercentage(percentages[1], 0) } OSP
                        </h2>
                        <h3 className="pf-c-title pf-m-1xl">
                            Workloads could be running on Red Hat OpenStack Platform
                        </h3>
                    </div>
                    <div>
                        <h2 className="pf-c-title pf-m-4xl">
                            { formatPercentage(percentages[2], 0) } RHEL
                        </h2>
                        <h3 className="pf-c-title pf-m-1xl">
                            Workloads running, or possible to migrate to Red Hat Enterprise Linux
                        </h3>
                    </div>
                </div>
            </ReportCard>
        );
    };

    public renderWorkloadsDetectedTable = () => {
        const { reportId } = this.props;
        
        return (
            <ReportCard
                title='Workloads detected'
                skipBullseye={ true }
            >
                <WorkloadsDetectedTable reportId={ reportId }/>
            </ReportCard>
        );
    };

    public renderWorkloadsDetected = () => {
        const { reportWorkloadSummary } = this.props;        

        const title="Workloads detected (OS Types)";
        const workloadOsTypesDetected = reportWorkloadSummary.workloadOsTypesDetectedModel;

        if (!workloadOsTypesDetected) {
            return this.renderErrorCard(title);
        }

        //
        const pieValues = [
            workloadOsTypesDetected.rhel,
            workloadOsTypesDetected.sles,
            workloadOsTypesDetected.windows,
            workloadOsTypesDetected.oel
        ];

        const total = pieValues.reduce(sumReducer, 0);
        const percentages = pieValues.map((val: number) => val / total);

        const chartProps = {
            title: formatPercentage(1, 0),
            subTitle: 'Total',
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
            { label: 'RHEL', value: percentages[0] },
            { label: 'SLES', value: percentages[1] },
            { label: 'Windows', value: percentages[2] },
            { label: 'OEL', value: percentages[3] }
        ];

        const tickFormat = (label: string, value: number) => `${label}: ${formatPercentage(value, 2)}`;
        return (
            <ReportCard
                title={title}
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

    public renderFlagsTable = () => {
        const { reportId } = this.props;
        
        return (
            <ReportCard
                title='Flags (Considerations to be migrated)'
                skipBullseye={ true }
            >
                <FlagsTable reportId={ reportId }/>
            </ReportCard>
        );
    };

    public renderScansRun = () => {
        const { reportWorkloadSummary } = this.props;
       
        const title="Scans run";
        const scanRuns = reportWorkloadSummary.scanRunModels;

        if (!scanRuns) {
            return this.renderErrorCard(title);
        }

        return (
            <ReportCard title={title}>
                <ScansRunTable
                    scanRuns={ scanRuns }
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
                    <StackItem isFilled={ false }>
                        { this.renderTargetRecommendation() }
                    </StackItem>
                    <StackItem isFilled={ false }>
                        { this.renderWorkloadsDetectedTable() }
                    </StackItem>
                    <StackItem isFilled={ false }>
                        { this.renderWorkloadsDetected() }
                    </StackItem>
                    <StackItem isFilled={ false }>
                        { this.renderFlagsTable() }
                    </StackItem>
                    <StackItem isFilled={ false }>
                        { this.renderScansRun() }
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
