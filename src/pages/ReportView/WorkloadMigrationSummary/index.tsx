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
    ChartDonut,
    // ChartLegend,
    ChartThemeColor,
    ChartThemeVariant
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

export class WorkloadMigrationSummary extends React.Component<Props, State> {

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

    summaryTable = () => {
        const { columns, rows } = this.state;

        return (
            <Table caption='Simple Table' cells={ columns } rows={ rows }>
                <TableHeader />
                <TableBody />
            </Table>
        );
    };

    migrationComplexity = () => {
        return (
            <div>
                <div className="donut-chart-container">
                    <ChartDonut
                        data={ [{ x: 'Cats', y: 35 }, { x: 'Dogs', y: 55 }, { x: 'Birds', y: 10 }] }
                        labels={ datum => `${datum.x}: ${datum.y}` }
                        subTitle="Pets"
                        themeColor={ ChartThemeColor.multi }
                        themeVariant={ ChartThemeVariant.light }
                        title="40"
                        radius= { 5 }
                    />
                </div>
                { /* <ChartLegend
                    data={ [{ name: 'Cats' }, { name: 'Dogs' }, { name: 'Birds' }] }
                    height={ 35 }
                    orientation={ 'horizontal' }
                    responsive={ false }
                    themeColor={ ChartThemeColor.multi }
                    themeVariant={ ChartThemeVariant.light }
                    x={ 8 }
                /> */ }
            </div>
        );
    }

    render() {
        const { report } = this.props;

        return (
            <React.Fragment>
                <Stack gutter='md'>
                    <StackItem isFilled={ false }>
                        <Card>
                            <CardHeader>Workload Migration Summary ({ report ? report.fileName : '' })</CardHeader>
                            <CardBody>
                                <p>Report build for a 3 year insfraestructure Migration for Acme Inc.</p>
                                <p>2019-05-15</p>
                            </CardBody>
                        </Card>
                    </StackItem>
                    <StackItem isFilled={ false }>
                        <Card>
                            <CardHeader>Summary</CardHeader>
                            <CardBody>
                                { this.summaryTable() }
                            </CardBody>
                        </Card>
                    </StackItem>
                    <StackItem isFilled={ false }>
                        <Card>
                            <CardHeader>Migration complexity</CardHeader>
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

export default connect(mapStateToProps, mapDispatchToProps)(WorkloadMigrationSummary);
