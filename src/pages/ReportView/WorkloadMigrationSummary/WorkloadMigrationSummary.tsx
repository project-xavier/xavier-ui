import React from 'react';
import { RouterGlobalProps } from '../../../models/router';
import { Card, CardBody, CardHeader, Stack, StackItem, Bullseye } from '@patternfly/react-core';
import { Report, ReportWorkloadMigrationSummary, Summary } from '../../../models';
import {
    Table,
    TableHeader,
    TableBody
} from '@patternfly/react-table';
import {
    ChartDonut,
    ChartThemeColor,
    ChartThemeVariant,
    ChartLegend
} from '@patternfly/react-charts';
import {
    Skeleton,
    SkeletonTable
} from '@redhat-cloud-services/frontend-components';
import './WorkloadMigrationSummary.scss';

interface StateToProps {
    report: Report;
    reportMigrationSummary: ReportWorkloadMigrationSummary;
}

interface DispatchToProps {
    fetchReportWorkloadMigrationSummary: (reportId: number) => any;
}

interface Props extends StateToProps, DispatchToProps, RouterGlobalProps {
};

interface State {
    columns: any;
    rows: any;
};

class WorkloadMigrationSummary extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            columns: [
                { title: 'Provider' },
                { title: 'Product' },
                { title: 'Version' },
                { title: 'Hypervisors' },
                { title: 'Sockets' },
                { title: 'Clusters' },
                { title: 'VMs' }
            ],
            rows: []
        };
    }

    componentDidMount() {
        this.refreshData();
    }

    refreshData() {
        const { report, fetchReportWorkloadMigrationSummary } = this.props;
        fetchReportWorkloadMigrationSummary(report.id).then(() => {
            this.filtersInRowsAndCells();
        });;
    }

    filtersInRowsAndCells(): void {
        const { reportMigrationSummary } = this.props;
        const summaries: Summary[] = Object.values(reportMigrationSummary.summary);

        let rows: any[][] = [];
        if (summaries.length > 0) {
            rows = summaries.map((summary) => (
                [
                    {
                        title: summary.provider
                    },
                    {
                        title: summary.product
                    },
                    {
                        title: summary.version
                    },
                    {
                        title: summary.hypervisors
                    },
                    {
                        title: summary.sockets
                    },
                    {
                        title: summary.clusters
                    },
                    {
                        title: summary.vms
                    }
                ]
            ));
        }

        this.setState({ rows });
    }

    renderInfo = () => {
        return (
            <React.Fragment>
                <p>Report build for a 3 year insfraestructure Migration for Acme Inc.</p>
                <p>2019-05-15</p>
            </React.Fragment>
        );
    }

    renderSummaryTable = () => {
        const { columns, rows } = this.state;

        return (
            <Table aria-label='Summary list' cells={ columns } rows={ rows }>
                <TableHeader />
                <TableBody />
            </Table>
        );
    };

    renderMigrationComplexity = () => {
        const { reportMigrationSummary: { complexity }} = this.props;

        const chartData = [
            { x: 'Hard', y: complexity.hard },
            { x: 'Medium', y: complexity.medium },
            { x: 'Easy', y: complexity.easy },
            { x: 'Unknown', y: complexity.unknown }
        ];

        const legendData = [
            { name: 'Hard' },
            { name: 'Medium' },
            { name: 'Easy' },
            { name: 'Unknown' }
        ];

        return (
            <div>
                <div className="donut-chart-container">
                    <ChartDonut
                        title="Complexity"
                        subTitle=""
                        data={ chartData }
                        labels={ datum => `${datum.x}: ${datum.y}` }
                        themeColor={ ChartThemeColor.multi }
                        themeVariant={ ChartThemeVariant.light }
                    />
                </div>
                <ChartLegend
                    data={ legendData }
                    height={ 35 }
                    orientation={ 'horizontal' }
                    responsive={ true }
                    themeColor={ ChartThemeColor.multi }
                    themeVariant={ ChartThemeVariant.light }
                    x={ 64 }
                />
            </div>
        );
    }

    render() {
        const { report, reportMigrationSummary } = this.props;

        return (
            <React.Fragment>
                <Stack gutter='md'>
                    <StackItem isFilled={ false }>
                        <Card>
                            <CardHeader>Workload Migration Summary ({ report ? report.fileName : '' })</CardHeader>
                            <CardBody>
                                { reportMigrationSummary ? this.renderInfo() : <Skeleton size="lg"/> }
                            </CardBody>
                        </Card>
                    </StackItem>
                    <StackItem isFilled={ false }>
                        <Card>
                            <CardHeader>Summary</CardHeader>
                            <CardBody>
                                { reportMigrationSummary ? this.renderSummaryTable() : <SkeletonTable colSize={ 7 } rowSize={ 4 }/> }
                            </CardBody>
                        </Card>
                    </StackItem>
                    <StackItem isFilled={ false }>
                        <Card>
                            <CardHeader>Migration complexity</CardHeader>
                            <CardBody>
                                <Bullseye>
                                    { reportMigrationSummary ? this.renderMigrationComplexity() : <Skeleton size="sm"/> }
                                </Bullseye>
                            </CardBody>
                        </Card>
                    </StackItem>
                </Stack>
            </React.Fragment>
        );
    }
}

export default WorkloadMigrationSummary;
