import React from 'react';
import { bindActionCreators } from 'redux';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
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
import  * as reportActions from '../../actions/ReportActions';
import { Report } from '../../models';
import { GlobalState } from '../../models/state';
import { RouterGlobalProps } from '../../models/router';
import ReportsPage from '../../PresentationalComponents/ReportsPage';
import LoadingState from '../../PresentationalComponents/LoadingState/LoadingState';
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

export class Reports extends React.Component<Props, State> {

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
                { <TableToolbar className="pf-u-justify-content-space-between">
                    <ToolbarGroup>
                        <ToolbarItem className="pf-u-mr-md">
                            <Button type="button" variant={ ButtonVariant.primary } component={ Link } to={ '/reports/upload' }>Create</Button>
                        </ToolbarItem>
                    </ToolbarGroup>
                </TableToolbar> }
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

const mapStateToProps = (state: GlobalState)  => {
    let {
        reportState: {
            reports,
            loading,
            error,
            total
        }
    } = state;
    return {
        reports,
        loading,
        error,
        total
    };
};

const mapDispatchToProps = (dispatch: any) =>
    bindActionCreators({
        fetchReports: reportActions.fetchReports
    }, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Reports));
