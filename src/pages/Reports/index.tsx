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
    TextInput,
    Pagination,
    ButtonVariant,
    InputGroup
} from '@patternfly/react-core';
import {
    Table,
    TableHeader,
    TableBody,
    TableGridBreakpoint,
    IRow,
    ICell
} from '@patternfly/react-table';
import {
    SearchIcon,
    OkIcon,
    ErrorCircleOIcon
} from '@patternfly/react-icons';

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
                { title: 'Name', props: {}},
                { title: 'Status', props: {}},
                {
                    title: '',
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
            rows = reports.map(({ id, fileName }, index) => (
                [
                    {
                        title: <Link to={ `/reports/${id}` }>{ fileName }</Link>
                    },
                    {
                        title:
                        <p>{ index % 2 === 0 ?
                            <OkIcon className="success" /> : <ErrorCircleOIcon className="error" /> } Report created - 5/31/2019, 5:27pm
                        </p>
                    },
                    {
                        title: <Button variant={ ButtonVariant.secondary } component={ Link } to={ `/reports/${id}` }>Delete</Button>
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

    buildSearchBox = () => {
        return (
            <InputGroup>
                <TextInput type="search" aria-label="search text input" />
                <Button variant={ ButtonVariant.tertiary } aria-label="search button for search input">
                    <SearchIcon />
                </Button>
            </InputGroup>
        );
    };

    resultsTable() {
        const { rows, columns } = this.state;

        return (
            <React.Fragment>
                { <TableToolbar className="pf-u-justify-content-space-between">
                    <ToolbarGroup>
                        <ToolbarItem className="pf-u-mr-xl">{ this.buildSearchBox() }</ToolbarItem>
                        <ToolbarItem className="pf-u-mr-md">
                            <Button type="button" variant={ ButtonVariant.primary } component={ Link } to={ '/reports/upload' }>Upload</Button>
                        </ToolbarItem>
                    </ToolbarGroup>
                    <ToolbarGroup>
                        <ToolbarItem>
                            <Pagination
                                itemCount={ 523 }
                                perPage={ 1 }
                                page={ 3 }
                                onSetPage={ undefined }
                                widgetId="pagination-options-menu-top"
                                onPerPageSelect={ undefined }
                            />
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
