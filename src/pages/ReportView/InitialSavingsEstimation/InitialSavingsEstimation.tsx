import React from 'react';
import { RouterGlobalProps } from '../../../models/router';
import {
    Card,
    CardBody,
    CardHeader,
    Stack,
    StackItem,
    Bullseye
} from '@patternfly/react-core';
import { Report, ReportInitialSavingEstimation } from '../../../models';
import {
    Table,
    TableHeader,
    TableBody,
    textCenter
} from '@patternfly/react-table';
import {
    ChartThemeColor,
    ChartThemeVariant,
    Chart,
    ChartGroup,
    ChartBar
} from '@patternfly/react-charts';
import {
    Skeleton
    // SkeletonTable
} from '@redhat-cloud-services/frontend-components';
import './InitialSavingsEstimation.scss';

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
    columns: any;
    rows: any;
};

class InitialSavingsEstimation extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            columns: [
                { title: 'Repositories' },
                'Branches',
                { title: 'Pull requests' },
                'Workspaces',
                {
                    title: 'Last Commit',
                    transforms: [ textCenter ],
                    cellTransforms: [ textCenter ]
                }
            ],
            rows: [
                [ 'one', 'two', 'three', 'four', 'five' ],
                [
                    {
                        title: <div>one - 2</div>,
                        props: { title: 'hover title', colSpan: 3 }
                    },
                    'four - 2',
                    'five - 2'
                ],
                [
                    'one - 3',
                    'two - 3',
                    'three - 3',
                    'four - 3',
                    {
                        title: 'five - 3 (not centered)',
                        props: { textCenter: false }
                    }
                ]
            ]
        };
    }

    componentDidMount() {
        this.refreshData();
    }

    refreshData() {
        const { report, fetchReportInitialSavingEstimation } = this.props;
        fetchReportInitialSavingEstimation(report.id).then(() => {
            this.filtersInRowsAndCells();
        });;
    }

    filtersInRowsAndCells(): void {
    }

    renderInfo = () => {
        return (
            <React.Fragment>
                <Stack gutter="md">
                    <StackItem isFilled={ false }>
                        <p>Report build for a 3 year insfraestructure Migration for Acme Inc.</p>
                        <br />
                        <p>Source: Vmware Vsphere Enterprise Plus * Oracle Web Logic</p>
                        <p>Target: Red Hat Virtualization + JBoss Enterprise Application Platform</p>
                        <p>Date: 2019-04-25</p>
                        <br />
                        <p>Over 3 year(s) with Red Hat Virtualization, your initial savings estimation could be as much as</p>
                    </StackItem>
                    <StackItem isFilled={ false } className="pf-u-text-align-center stack-item-border">
                        <p>$1,403,500.00</p>
                    </StackItem>
                </Stack>
            </React.Fragment>
        );
    }

    renderCostExpenditureComparison = () => {
        const dataVMware = [{ x: 'Year1', y: 1000 }, { x: 'Year2', y: 2000 }, { x: 'Year3', y: 3000 }];
        const dataRHV = [{ x: 'Year1', y: 2500 }, { x: 'Year2', y: 2000 }, { x: 'Year3', y: 2200 }];

        return (
            <div>
                <div className="bar-chart-container">
                    <Chart
                        domainPadding={ { x: [ 30, 25 ]} }
                        themeColor={ ChartThemeColor.multi }
                        themeVariant={ ChartThemeVariant.light }
                    >
                        <ChartGroup offset={ 11 }>
                            <ChartBar data={ dataVMware } />
                            <ChartBar data={ dataRHV } />
                        </ChartGroup>
                    </Chart>
                </div>
            </div>
        );
    };

    migrationComplexity = () => {
        const { columns, rows } = this.state;
        return (
            <Table caption='Simple Table' cells={ columns } rows={ rows }>
                <TableHeader />
                <TableBody />
            </Table>
        );
    }

    render() {
        const { report, reportInitialSavingEstimation } = this.props;

        return (
            <React.Fragment>
                <Stack gutter='md'>
                    <StackItem isFilled={ false }>
                        <Card>
                            <CardHeader>Initial Savings Estimation ({ report ? report.fileName : '' })</CardHeader>
                            <CardBody>
                                { reportInitialSavingEstimation ? this.renderInfo() : <Skeleton size="lg"/> }
                            </CardBody>
                        </Card>
                    </StackItem>
                    <StackItem isFilled={ false }>
                        <Card>
                            <CardHeader>Cost expenditure comparison during the 3 year migration</CardHeader>
                            <CardBody>
                                <Bullseye>
                                    { reportInitialSavingEstimation ? this.renderCostExpenditureComparison() : <Skeleton size="sm"/> }
                                </Bullseye>
                            </CardBody>
                        </Card>
                    </StackItem>
                    <StackItem isFilled={ false }>
                        <Card>
                            <CardHeader>Environment variables</CardHeader>
                            <CardBody>
                                { this.migrationComplexity() }
                            </CardBody>
                        </Card>
                    </StackItem>
                </Stack>
            </React.Fragment>
        );
    }
}

export default InitialSavingsEstimation;
