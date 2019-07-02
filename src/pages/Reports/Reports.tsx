import React from 'react';
import { Link } from 'react-router-dom';
import {
    TableToolbar
} from '@redhat-cloud-services/frontend-components';
import {
    Button,
    ToolbarGroup,
    ToolbarItem,
    ButtonVariant,
    Pagination,
    InputGroup,
    TextInput,
    Form,
    EmptyState,
    EmptyStateVariant,
    EmptyStateIcon,
    Title,
    EmptyStateBody,
    Card,
    CardBody
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
import {
    SearchIcon,
    OkIcon,
    ErrorCircleOIcon,
    InProgressIcon,
    AddCircleOIcon
} from '@patternfly/react-icons';
import debounce from 'lodash/debounce';
import { Formik } from 'formik';

interface StateToProps {
    total: number;
    error: string | null;
    loading: boolean;
    reports: Report[];
}

interface DispatchToProps {
    fetchReports: (page: number, perPage: number, filterText: string) => any;
    deleteReport: (id: number, name: string) => any;
    showDeleteDialog: (name: string, type: string, onDelete: () => void, onCancel: () => void) => any;
    closeDeleteDialog: () => any;
}

interface Props extends StateToProps, DispatchToProps, RouterGlobalProps {
};

interface State {
    filterText: string;
    page: number;
    perPage: number;
    columns: Array<ICell | String>;
    rows: Array<IRow | Array<String>>,
    isFirstFetchReportsCall: boolean
};

const PULL_INTERVAL_TIME = 5000;

class Reports extends React.Component<Props, State> {

    redirectTimer: any;

    constructor(props: Props) {
        super(props);
        this.state = {
            filterText: '',
            page: 1,
            perPage: 10,
            columns: [
                { title: 'Name', props: {}},
                { title: 'Status', props: {}},
                {
                    title: '',
                    props: {
                        className: 'pf-u-text-align-center'
                    }
                }
            ],
            rows: [],
            isFirstFetchReportsCall: true
        };
    }

    componentDidMount() {
        this.refreshData();
        this.startPullScheduler();
    }

    componentWillUnmount() {
        this.stopPullScheduler();
    }

    startPullScheduler = () => {
        if (!this.redirectTimer) {
            this.redirectTimer = setInterval(() => {
                this.refreshData();
            }, PULL_INTERVAL_TIME);
        }
    }

    stopPullScheduler = () => {
        clearInterval(this.redirectTimer);
    }

    handleDelete = (report: Report) => {
        this.props.showDeleteDialog(report.fileName, 'report',
            () => {
                this.props.deleteReport(report.id, report.fileName).then(() => {
                    this.props.closeDeleteDialog();
                    this.refreshData();
                });
            },
            () => {
                this.props.closeDeleteDialog();
            }
        );
    }

    renderStatus = (report: Report) => {
        switch (report.analysisStatus) {
            case 'FINISHED':
                return <p><OkIcon className="success" /> Report created - { new Date(report.creationDate).toUTCString() }</p>;
            case 'FAILED':
                return <p><ErrorCircleOIcon className="error" /> Report failed - { new Date(report.creationDate).toUTCString() }</p>;
            case 'PROGRESS':
                return <p><InProgressIcon className="progress" /> Analyzing the upload file</p>;
            default:
                return null;
        }
    }

    renderAction = (report: Report) => {
        switch (report.analysisStatus) {
            case 'FINISHED':
                return <Button variant={ ButtonVariant.secondary } onClick={ () => this.handleDelete(report) }>Delete</Button>;
            case 'FAILED':
                return <Button variant={ ButtonVariant.secondary } onClick={ () => this.handleDelete(report) }>Delete</Button>;;
            case 'PROGRESS':
                return '';
            default:
                return null;
        }
    }

    filtersInRowsAndCells(): void {
        const reports: Report[] = Object.values(this.props.reports);

        let rows: any[][] = [];
        if (reports.length > 0) {
            rows = reports.map((report) => (
                [
                    {
                        title: <Link to={ `/reports/${report.id}` }>{ report.fileName }</Link>
                    },
                    {
                        title: this.renderStatus(report)
                    },
                    {
                        title: this.renderAction(report)
                    }
                ]
            ));
        }

        this.setState({ rows });
    }

    refreshData(page: number = this.state.page, perPage: number = this.state.perPage, filterText: string = this.state.filterText): void {
        this.props.fetchReports(page, perPage, filterText).then(() => {
            // If it is the first time fetching reports and there are no reports
            // thenn redirect to. Otherwise show empty table.
            const { total } = this.props;
            const { isFirstFetchReportsCall } = this.state;
            if (total === 0 && isFirstFetchReportsCall) {
                this.props.history.push('/no-reports');
            }

            this.setState({ isFirstFetchReportsCall: false });

            this.filtersInRowsAndCells();
        });
    }

    changePage = debounce(() => {
        this.refreshData();
    }, 800);

    onPageChange = (_event: any, page: number, shouldDebounce: boolean) => {
        this.setState({ page });
        if (shouldDebounce) {
            this.changePage();
        } else {
            this.refreshData(page);
        }
    }

    onSetPage = (event: any, page: number) => {
        return event.target.className === 'pf-c-form-control' || this.onPageChange(event, page, false);
    }

    onPageInput = (event: any, page: number) => {
        return this.onPageChange(event, page, true);
    }

    onPerPageSelect = (_event: any, perPage: number) => {
        let page = this.state.page;
        const total = this.props.total;

        // If current page and perPage would request data beyond total, show last available page
        if (page * perPage > total) {
            page = Math.floor(total / perPage) + 1;
        }

        this.setState({ page, perPage });
        this.refreshData(page, perPage);
    }

    renderNoResults() {
        return (
            <React.Fragment>
                <Card>
                    <CardBody>
                        <EmptyState variant={ EmptyStateVariant.full }>
                            <EmptyStateIcon icon={ AddCircleOIcon } />
                            <Title headingLevel="h5" size="lg">No reports found</Title>
                            <EmptyStateBody>
                                Reports are created from inventory data files that are uploaded to Red Hat
                            </EmptyStateBody>
                            <Button variant={ ButtonVariant.primary } component={ Link } to={ '/reports/upload' }>Create Report</Button>
                        </EmptyState>
                    </CardBody>
                </Card>
            </React.Fragment>
        );
    }

    renderResultsTable() {
        const { rows, columns } = this.state;

        return (
            <Table aria-label='Reports list'
                rows={ rows }
                cells={ columns }
                gridBreakPoint={ TableGridBreakpoint.gridMd } >
                <TableHeader />
                <TableBody />
            </Table>
        );
    }

    handleSearchSubmit = (values: any) => {
        const filterText: string = values.filterText;
        this.setState({
            filterText: filterText.trim()
        });
        this.refreshData();
    }

    renderSearchBox = () => {
        return (
            <Formik
                initialValues={ { filterText: '' } }
                validate={ () => {
                    let errors = {};
                    return errors;
                } }
                onSubmit={ this.handleSearchSubmit }
            >
                {
                    ({
                        values,
                        handleChange,
                        handleBlur,
                        handleSubmit
                    }) =>
                        <Form onSubmit={ handleSubmit }>
                            <InputGroup>
                                <TextInput
                                    type="search"
                                    id="filterText"
                                    name="filterText"
                                    aria-label="search text input"
                                    onChange={ (_value, event) => handleChange(event) }
                                    onBlur={ handleBlur }
                                    value={ values.filterText } />
                                <Button type="submit" variant={ ButtonVariant.tertiary } aria-label="search button for search input">
                                    <SearchIcon />
                                </Button>
                            </InputGroup>
                        </Form>
                }
            </Formik>
        );
    };

    render() {
        const { isFirstFetchReportsCall, page, perPage } = this.state;
        const { total } = this.props;

        if (isFirstFetchReportsCall) {
            return (
                <ReportsPage>{ '' }</ReportsPage>
            );
        }

        return (
            <ReportsPage>
                <TableToolbar className="pf-u-justify-content-space-between">
                    <ToolbarGroup>
                        <ToolbarItem className="pf-u-mr-xl">{ this.renderSearchBox() }</ToolbarItem>
                        <ToolbarItem className="pf-u-mr-md">
                            <Button type="button" variant={ ButtonVariant.secondary } component={ Link } to={ '/reports/upload' }>Create</Button>
                        </ToolbarItem>
                    </ToolbarGroup>
                    <ToolbarGroup>
                        <ToolbarItem>
                            <Pagination
                                itemCount={ total }
                                perPage={ perPage }
                                page={ page }
                                onSetPage={ this.onSetPage }
                                onPageInput={ this.onPageInput }
                                onPerPageSelect={ this.onPerPageSelect }
                            />
                        </ToolbarItem>
                    </ToolbarGroup>
                </TableToolbar>
                { (total > 0 ? this.renderResultsTable() : this.renderNoResults()) }
            </ReportsPage>
        );
    }
}

export default Reports;
