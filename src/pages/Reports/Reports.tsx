import React from 'react';
import { Link } from 'react-router-dom';
import {
    TableToolbar
} from '@redhat-cloud-services/frontend-components';
import {
    Button,
    ToolbarGroup,
    ToolbarItem,
    ButtonVariant
} from '@patternfly/react-core';
import {
    Table,
    TableHeader,
    TableBody,
    TableGridBreakpoint,
    IRow,
    ICell
} from '@patternfly/react-table';

import './Reports.scss';
import { Report } from '../../models';
import { RouterGlobalProps } from '../../models/router';
import ReportsPage from '../../PresentationalComponents/ReportsPage';
import LoadingState from '../../PresentationalComponents/LoadingState';
import NoReports from '../../SmartComponents/NoReports';

interface StateToProps {
    total: number;
    error: string | null;
    loading: boolean;
    reports: Report[];
}

interface DispatchToProps {
    fetchReports: () => any;
}

interface Props extends StateToProps, DispatchToProps, RouterGlobalProps {
};

interface State {
    columns: Array<ICell | String>;
    rows: Array<IRow | Array<String>>
};

class Reports extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            columns: [
                { title: 'Report Id', props: {}},
                { title: 'Customer Id', props: {}},
                {
                    title: 'File name',
                    props: {
                        className: 'pf-u-text-align-center'
                    }
                },
                ''
            ],
            rows: []
        };
    }

    componentDidMount(): void {
        this.refreshData();
    }

    refreshData(): void {
        this.props.fetchReports().then(() =>
            this.filtersInRowsAndCells()
        );
    }

    filtersInRowsAndCells(): void {
        const reports: Report[] = Object.values(this.props.reports);

        let rows: any[][] = [];
        if (reports.length > 0) {
            rows = reports.map(({ id, customerId, fileName }) => (
                [
                    { title: id },
                    { title: customerId },
                    { title: fileName },
                    {
                        title: <Button variant='primary' component={ Link } to={ `/reports/${id}` }>View</Button>
                    }
                ]
            ));
        }

        this.setState({ rows });
    }

    noResults() {
        return (
            <NoReports />
        );
    }

    resultsTable() {
        const { rows, columns } = this.state;

        return (
            <React.Fragment>
                <TableToolbar className="pf-u-justify-content-space-between">
                    <ToolbarGroup>
                        <ToolbarItem className="pf-u-mr-md">
                            <Button type="button" variant={ ButtonVariant.primary } component={ Link } to={ '/reports/upload' }>Create</Button>
                        </ToolbarItem>
                    </ToolbarGroup>
                </TableToolbar>
                <Table aria-label='Reports list'
                    rows={ rows }
                    cells={ columns }
                    gridBreakPoint={ TableGridBreakpoint.gridMd } >
                    <TableHeader />
                    <TableBody />
                </Table>
            </React.Fragment>
        );
    }

    render() {
        const { loading, total } = this.props;

        return (
            <ReportsPage>
                <LoadingState
                    loading={ loading }
                    placeholder={ '' } >
                    { total > 0 ? this.resultsTable() : this.noResults() }
                </LoadingState>
            </ReportsPage>
        );
    }
}

export default Reports;
