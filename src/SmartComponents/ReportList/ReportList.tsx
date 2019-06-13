import React from 'react';
import { bindActionCreators } from 'redux';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
    Skeleton,
    SkeletonSize,
    TableToolbar
} from '@redhat-cloud-services/frontend-components';
import {
    Button,
    Bullseye,
    EmptyState,
    EmptyStateIcon,
    EmptyStateBody,
    EmptyStateVariant,
    Title,
    ToolbarGroup,
    ToolbarItem
} from '@patternfly/react-core';
import {
    Table,
    TableHeader,
    TableBody,
    TableGridBreakpoint,
    IRow,
    ICell
} from '@patternfly/react-table';
import { CubesIcon } from '@patternfly/react-icons';
import ReportListPage from '../../PresentationalComponents/ReportListPage/ReportListPage';
import LoadingState from '../../PresentationalComponents/LoadingState/LoadingState';
import * as actionCreators from '../../actions/ReportActions';
import { Report } from '../../models';
import { GlobalState } from '../../models/state';
import { RouterGlobalProps } from '../../models/router';

interface StateToProps extends RouterGlobalProps {
    total: number;
    error: string | null;
    loading: boolean;
    reports: Report[];
}

interface DispatchToProps {
    fetchReports: () => any;
}

interface Props extends StateToProps, DispatchToProps {
};

interface State {
    columns: Array<ICell | String>;
    rows: Array<IRow | Array<String>>
};

export class ReportList extends React.Component<Props, State> {

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
            <Bullseye>
                <EmptyState variant={ EmptyStateVariant.full }>
                    <p>
                        <EmptyStateIcon icon={ CubesIcon } />
                    </p>
                    <Title size="lg">Let Red Hat Migration Analytics suggest ways to optimize your environment</Title>
                    <EmptyStateBody>
                                See how you can optimize your virtual environment by
                                uploading a Red Hat CloudForms generated inventory file
                                and then letting Red Hat Migration Analytics create
                                reports showing how you can save money and optimize
                                workloads - whether by migrating virtual machines or
                                migrating application to RHEL.
                    </EmptyStateBody>
                    <Button variant="primary" component={ Link } to={ '/upload' }>
                        Upload
                    </Button>
                </EmptyState>
            </Bullseye>
        );
    }

    resultsTable() {
        const { rows, columns } = this.state;

        return (
            <React.Fragment>
                { <TableToolbar>
                    <ToolbarGroup>
                        <ToolbarItem>
                            <Button component={ Link } to={ '/upload' }>Upload</Button>
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
        const placeholder = <Skeleton size={ SkeletonSize.lg } />;
        const { loading, total } = this.props;

        return (
            <ReportListPage
                title='Reports'
                showBreadcrumb={ false }>
                <LoadingState
                    loading={ loading }
                    placeholder={ placeholder } >
                    { total > 0 ? this.resultsTable() : this.noResults() }
                </LoadingState>
            </ReportListPage>
        );
    }
}

const mapStateToProps = (state: GlobalState)  => {
    let { reports: { reports, loading, error, total }} = state;
    return {
        reports,
        loading,
        error,
        total
    };
};

const mapDispatchToProps = (dispatch: any) =>
    bindActionCreators({
        fetchReports: actionCreators.fetchReports
    }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ReportList));
