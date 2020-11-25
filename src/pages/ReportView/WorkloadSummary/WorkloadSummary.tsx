import React from 'react';
import {
  Bullseye,
  EmptyState,
  EmptyStateIcon,
  EmptyStateVariant,
  Title,
  EmptyStateBody,
  Button,
  Stack,
  StackItem,
  Tooltip,
} from '@patternfly/react-core';
import { ErrorCircleOIcon, HelpIcon } from '@patternfly/react-icons';
import { Skeleton } from '@redhat-cloud-services/frontend-components/components/Skeleton';
import { SkeletonTable } from '@redhat-cloud-services/frontend-components/components/SkeletonTable';
import ReportCard from '../../../PresentationalComponents/ReportCard';
import SummaryTable from '../../../PresentationalComponents/Reports/SummaryTable';
import FancyChartDonut from '../../../PresentationalComponents/FancyChartDonut';
import { FancyChartDonutData } from '../../../PresentationalComponents/FancyChartDonut/FancyChartDonut';
import { formatPercentage, formatNumber } from '../../../Utilities/formatValue';
import ScansRunTable from '../../../PresentationalComponents/Reports/ScansRunTable';
import WorkloadsDetectedTable from '../../../SmartComponents/Reports/WorkloadsDetectedTable';
import FlagsTable from '../../../SmartComponents/Reports/FlagsTable';
import { SolidCard } from '../../../PresentationalComponents/SolidCard';
import { ObjectFetchStatus } from '../../../models/state';
import { ReportWorkloadSummary } from '../../../models';
import { JavaRuntimesCard } from '../../../PresentationalComponents/WorkladSummary/JavaRuntimesCard';
import { EmptyCard } from '../../../PresentationalComponents/EmptyCard';
import { ApplicationPlatformsCard } from '../../../PresentationalComponents/WorkladSummary/ApplicationPlatformsCard';
import { OSInformation } from '../../../PresentationalComponents/WorkladSummary/OSInformation';

interface StateToProps {
  reportWorkloadSummary: ReportWorkloadSummary | null;
  reportWorkloadSummaryFetchStatus: ObjectFetchStatus;
}

interface DispatchToProps {
  fetchReportWorkloadSummary: (reportId: number) => any;
}

export interface WorkloadMigrationSummaryProps extends StateToProps, DispatchToProps {
  reportId: number;
}

interface State {
  isCurrentFetchReportWorkloadSummaryCompletedSuccessfully: boolean;
}

const sumReducer = (a: number, b: number) => a + b;

export class WorkloadMigrationSummary extends React.Component<
  WorkloadMigrationSummaryProps,
  State
> {
  constructor(props: WorkloadMigrationSummaryProps) {
    super(props);
    this.state = {
      isCurrentFetchReportWorkloadSummaryCompletedSuccessfully: false,
    };
  }

  public componentDidMount() {
    this.refreshData();
  }

  public refreshData = () => {
    const { reportId, fetchReportWorkloadSummary } = this.props;
    fetchReportWorkloadSummary(reportId)
      .then(() => {
        this.setState({ isCurrentFetchReportWorkloadSummaryCompletedSuccessfully: true });
      })
      .catch(() => {
        this.setState({ isCurrentFetchReportWorkloadSummaryCompletedSuccessfully: false });
      });
  };

  public renderErrorCard = (cardTitle: string | React.ReactElement) => {
    return <EmptyCard cardTitle={cardTitle} message="Not enought data to show this card" />;
  };

  public renderSummary = () => {
    const { reportWorkloadSummary } = this.props;
    const title = 'Summary';

    if (!reportWorkloadSummary) {
      return this.renderErrorCard(title);
    }

    // TODO this validation was created when Models were not complete in the backend
    // It should be safe to remove this
    const summary = reportWorkloadSummary.summaryModels;
    if (!summary) {
      return this.renderErrorCard(title);
    }

    return (
      <ReportCard title={title}>
        <SummaryTable summary={summary} />
      </ReportCard>
    );
  };

  public renderMigrationComplexity = () => {
    const { reportWorkloadSummary } = this.props;
    const title = 'VM migration assessment';

    if (!reportWorkloadSummary) {
      return this.renderErrorCard(title);
    }

    // TODO this validation was created when Models were not complete in the backend
    // It should be safe to remove this
    const complexity = reportWorkloadSummary.complexityModel;
    if (!complexity) {
      return this.renderErrorCard(title);
    }

    //
    const pieValues = [
      complexity.easy || 0,
      complexity.medium || 0,
      complexity.hard || 0,
      complexity.unknown || 0,
      complexity.unsupported || 0,
    ];

    const total = pieValues.reduce(sumReducer, 0);
    const percentages = pieValues.map((val: number) => val / total);

    const chartProps = {
      title: formatNumber(total, 0),
      subTitle: 'Total VMs',
    };

    const chartData: FancyChartDonutData[] = [
      { label: 'Easy', value: percentages[0], extraData: pieValues[0] },
      { label: 'Medium', value: percentages[1], extraData: pieValues[1] },
      { label: 'Hard', value: percentages[2], extraData: pieValues[2] },
      { label: 'Unknown', value: percentages[3], extraData: pieValues[3] },
      { label: 'Unsupported', value: percentages[4], extraData: pieValues[4] },
    ];

    const tickFormat = (label: string, value: number, data: any) =>
      `${label}: ${formatPercentage(value, 2)}`;
    const tooltipFormat = ({ datum }) =>
      `${datum.x}: ${formatPercentage(datum.y, 2)} \n VMs: ${formatNumber(datum.extraData, 0)}`;

    return (
      <ReportCard
        title={
          <span>
            <span>{title}</span>&nbsp;
            <span>
              <Tooltip
                position="top"
                content={<div>Data based on the number of flags found per VM</div>}
              >
                <HelpIcon />
              </Tooltip>
            </span>
          </span>
        }
      >
        <FancyChartDonut
          data={chartData}
          chartProps={chartProps}
          tickFormat={tickFormat}
          tooltipFormat={tooltipFormat}
        />
      </ReportCard>
    );
  };

  public renderTargetRecommendation = () => {
    const { reportWorkloadSummary } = this.props;
    const title = 'Target recommendations';

    if (!reportWorkloadSummary) {
      return this.renderErrorCard(title);
    }

    // TODO this validation was created when Models were not complete in the backend
    // It should be safe to remove this
    const recommendedTargetsIMS = reportWorkloadSummary.recommendedTargetsIMSModel;
    if (!recommendedTargetsIMS) {
      return this.renderErrorCard(title);
    }

    const values = [
      recommendedTargetsIMS.rhv || 0,
      recommendedTargetsIMS.osp || 0,
      recommendedTargetsIMS.rhel || 0,
      recommendedTargetsIMS.ocp || 0,
    ];
    const total = recommendedTargetsIMS.total;
    const percentages = values.map((val: number) => val / total);

    return (
      <ReportCard title={title} skipBullseye={true}>
        <div className="pf-l-grid pf-m-all-6-col-on-md pf-m-all-4-col-on-lg pf-m-gutter">
          <SolidCard
            title={`${formatPercentage(percentages[0], 0)} Red Hat Virtualization`}
            description="Workloads suitable for Red Hat Virtualization"
          />
          <SolidCard
            title={`${formatPercentage(percentages[1], 0)} Red Hat OpenStack Platform`}
            description="Workloads could be running on Red Hat OpenStack Platform"
          />
          {/* <SolidCard
                        title={`${formatPercentage(percentages[2], 0)} RHEL`}
                        description="Workloads possible to migrate to Red Hat Enterprise Linux"
                    /> */}
          <SolidCard
            title={`${formatPercentage(percentages[3], 0)} Red Hat OpenShift Virtualization`}
            description="Workloads targeted for Red Hat OpenShift Virtualization"
          />
        </div>
      </ReportCard>
    );
  };

  public renderWorkloadsDetectedTable = () => {
    const { reportId } = this.props;

    return (
      <ReportCard title="Workloads detected" skipBullseye={true}>
        <WorkloadsDetectedTable reportId={reportId} />
      </ReportCard>
    );
  };

  public renderOSInformation = () => {
    const { reportWorkloadSummary } = this.props;
    return <OSInformation reportWorkloadSummary={reportWorkloadSummary} />;
  };

  public renderJavaRuntimes = () => {
    const { reportWorkloadSummary } = this.props;
    return <JavaRuntimesCard reportWorkloadSummary={reportWorkloadSummary} />;
  };

  public renderApplicationPlatforms = () => {
    const { reportWorkloadSummary } = this.props;
    return <ApplicationPlatformsCard reportWorkloadSummary={reportWorkloadSummary} />;
  };

  public renderFlagsTable = () => {
    const { reportId } = this.props;

    return (
      <ReportCard
        title="Flags (factors that might increase the migration effort)"
        skipBullseye={true}
      >
        <FlagsTable reportId={reportId} />
      </ReportCard>
    );
  };

  public renderScansRun = () => {
    const { reportWorkloadSummary } = this.props;
    const title = 'Scans run';

    if (!reportWorkloadSummary) {
      return this.renderErrorCard(title);
    }

    // TODO this validation was created when Models were not complete in the backend
    // It should be safe to remove this
    const scanRuns = reportWorkloadSummary.scanRunModels;
    if (!scanRuns) {
      return this.renderErrorCard(title);
    }

    return (
      <ReportCard title={title}>
        <ScansRunTable scanRuns={scanRuns} />
      </ReportCard>
    );
  };

  public renderReports = () => {
    return (
      <React.Fragment>
        <Stack hasGutter={true}>
          <StackItem isFilled={false}>{this.renderSummary()}</StackItem>
          <StackItem isFilled={false}>{this.renderTargetRecommendation()}</StackItem>
          <StackItem isFilled={false}>{this.renderMigrationComplexity()}</StackItem>
          <StackItem isFilled={false}>{this.renderFlagsTable()}</StackItem>
          <StackItem isFilled={false}>{this.renderOSInformation()}</StackItem>
          <StackItem isFilled={false}>{this.renderJavaRuntimes()}</StackItem>
          <StackItem>{this.renderApplicationPlatforms()}</StackItem>
          <StackItem isFilled={false}>{this.renderWorkloadsDetectedTable()}</StackItem>
          <StackItem isFilled={false}>{this.renderScansRun()}</StackItem>
        </Stack>
      </React.Fragment>
    );
  };

  public renderReportSkeleton = () => {
    return (
      <React.Fragment>
        <Stack hasGutter={true}>
          <StackItem isFilled={false}>
            <ReportCard title={<Skeleton size="sm" />}>
              <SkeletonTable colSize={7} rowSize={3} />
            </ReportCard>
          </StackItem>
          <StackItem isFilled={false}>
            <ReportCard title={<Skeleton size="sm" />}>
              <Skeleton size="sm" style={{ height: '300px' }} />
            </ReportCard>
          </StackItem>
          <StackItem isFilled={false}>
            <ReportCard title={<Skeleton size="sm" />}>
              <SkeletonTable colSize={3} rowSize={1} />
            </ReportCard>
          </StackItem>
        </Stack>
      </React.Fragment>
    );
  };

  public renderFetchError = () => {
    return (
      <Bullseye>
        <EmptyState variant={EmptyStateVariant.large}>
          <EmptyStateIcon icon={ErrorCircleOIcon} />
          <Title headingLevel="h5" size="lg">
            Error
          </Title>
          <EmptyStateBody>Something unexpected happend, please try again!</EmptyStateBody>
          <Button variant="primary" onClick={this.refreshData}>
            Retry
          </Button>
        </EmptyState>
      </Bullseye>
    );
  };

  public render() {
    const { isCurrentFetchReportWorkloadSummaryCompletedSuccessfully } = this.state;
    const { reportWorkloadSummary, reportWorkloadSummaryFetchStatus } = this.props;

    const isFetchComplete: boolean = reportWorkloadSummaryFetchStatus.status === 'complete';

    if (reportWorkloadSummaryFetchStatus.error || (isFetchComplete && !reportWorkloadSummary)) {
      return this.renderFetchError();
    }

    return (
      <React.Fragment>
        {isFetchComplete && isCurrentFetchReportWorkloadSummaryCompletedSuccessfully
          ? this.renderReports()
          : this.renderReportSkeleton()}
      </React.Fragment>
    );
  }
}
