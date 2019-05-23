import React from 'react';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
    Skeleton,
    SkeletonSize,
    TableToolbar
} from '@red-hat-insights/insights-frontend-components';
import {
    Button,
    Bullseye,
    EmptyState,
    EmptyStateIcon,
    EmptyStateBody,
    Title,
    ToolbarItem,
    ToolbarGroup
} from '@patternfly/react-core';
import {
    Table,
    TableHeader,
    TableBody,
    TableGridBreakpoint
} from '@patternfly/react-table';
import { CubesIcon } from '@patternfly/react-icons';
import ReportListPage from '../../PresentationalComponents/ReportListPage/ReportListPage';
import LoadingState from '../../PresentationalComponents/LoadingState/LoadingState';
import * as actionCreators from '../../actions/ReportActions';

class ReportsList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            columns: [
                { title: 'Report ID' },
                { title: 'Customer ID' },
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

    componentDidMount() {
        this.refreshData();
    }

    refreshData() {
        this.props.fetchReports().then(() =>
            this.filtersInRowsAndCells()
        );
    }

    filtersInRowsAndCells() {
        const reports = Object.values(this.props.reports);

        let rows = [];
        if (reports.length > 0) {
            rows = reports.map(({ id, customerId, fileName }) => (
                [
                    { title: id },
                    { title: customerId },
                    { title: fileName },
                    {
                        title: <Button variant='primary' component= { Link } to={ `/reports/${id}` }>View</Button>
                    }
                ]));
        }

        this.setState({ rows });
    }

    noResults() {
        return (
            <Bullseye>
                <EmptyState>
                    <p>
                        <EmptyStateIcon icon={ CubesIcon } />
                    </p>
                    <Title size="lg">No reports found</Title>
                    <EmptyStateBody>
                        There are no reports processed yet.
                    </EmptyStateBody>
                    <Button variant="primary" component={ Link } to={ '/upload' }>Upload</Button>
                </EmptyState>
            </Bullseye>
        );
    }

    resultsTable() {
        const { rows, columns } = this.state;

        return (
            <React.Fragment>
                <TableToolbar>
                    <ToolbarGroup>
                        <ToolbarItem>
                            <Button component={ Link } to={ '/upload' }>Upload</Button>
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

ReportsList.propTypes = {
    fetchReports: PropTypes.func.isRequired,
    reports: PropTypes.array.isRequired,
    loading: PropTypes.bool,
    total: PropTypes.number,
    error: PropTypes.string
};

const mapStateToProps = ({ reports: { reports, loading, error, total }}) => ({
    reports,
    loading,
    error,
    total
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators({
        fetchReports: actionCreators.fetchReports
    }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ReportsList);
