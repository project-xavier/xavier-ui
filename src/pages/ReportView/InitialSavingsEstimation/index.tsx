import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { RouterGlobalProps } from '../../../models/router';
import { GlobalState } from '../../../models/state';
import { Card, CardBody, CardHeader, Stack, StackItem } from '@patternfly/react-core';
import { Report } from '../../../models';
import {
    Table,
    TableHeader,
    TableBody,
    textCenter
} from '@patternfly/react-table';
import {
    ChartThemeColor,
    ChartThemeVariant,
    Chart
    // ChartGroup,
    // ChartBar
} from '@patternfly/react-charts';

interface StateToProps extends RouterGlobalProps {
    report: Report | null;
}

interface DispatchToProps {
}

interface Props extends StateToProps, DispatchToProps {
};

interface State {
    columns: any;
    rows: any;
};

export class InitialSavingsEstimation extends React.Component<Props, State> {

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

    costExpenditure = () => {
        return (
            <div>
                <div className="bar-chart-container">
                    <Chart
                        domainPadding={ { x: [ 30, 25 ]} }
                        themeColor={ ChartThemeColor.blue }
                        themeVariant={ ChartThemeVariant.light }
                    >
                        { /* <ChartGroup offset={ 11 }>
                            <ChartBar data={ [{ x: 'Cats', y: 1 }, { x: 'Dogs', y: 2 }, { x: 'Birds', y: 5 }, { x: 'Mice', y: 3 }] } />
                            <ChartBar data={ [{ x: 'Cats', y: 2 }, { x: 'Dogs', y: 1 }, { x: 'Birds', y: 7 }, { x: 'Mice', y: 4 }] } />
                            <ChartBar data={ [{ x: 'Cats', y: 4 }, { x: 'Dogs', y: 4 }, { x: 'Birds', y: 9 }, { x: 'Mice', y: 7 }] } />
                            <ChartBar data={ [{ x: 'Cats', y: 3 }, { x: 'Dogs', y: 3 }, { x: 'Birds', y: 8 }, { x: 'Mice', y: 5 }] } />
                        </ChartGroup> */ }
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
        const { report } = this.props;

        return (
            <React.Fragment>
                <Stack gutter='md'>
                    <StackItem isFilled={ false }>
                        <Card>
                            <CardHeader>Initial Savings Estimation ({ report ? report.fileName : '' })</CardHeader>
                            <CardBody>
                                <p>Report build for a 3 year insfraestructure Migration for Acme Inc.</p>
                                <p>Source: Vmware Vsphere Enterprise Plus * Oracle Web Logic</p>
                                <p>Target: Red Hat Virtualization + JBoss Enterprise Application Platform</p>
                                <p>Date: 2019-04-25</p>
                                <p>Over 3 year(s) with Red Hat Virtualization, your initial savings estimation could be as much as</p>
                                <p>$1,403,500.00</p>
                            </CardBody>
                        </Card>
                    </StackItem>
                    <StackItem isFilled={ false }>
                        <Card>
                            <CardHeader>Cost expenditure comparison during the 3 year migration</CardHeader>
                            <CardBody>
                                { this.costExpenditure() }
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

const mapStateToProps = (state: GlobalState)  => {
    let { report } = state.reportState;
    return {
        report
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({

    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(InitialSavingsEstimation);
