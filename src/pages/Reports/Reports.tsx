import React from 'react';
import { Link } from 'react-router-dom';
import {
    TableToolbar,
    SkeletonTable
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
import * as deleteActions from '../../actions/DialogDeleteActions';
import {
    SearchIcon,
    OkIcon,
    ErrorCircleOIcon,
    InProgressIcon
} from '@patternfly/react-icons';
import debounce from 'lodash/debounce';
import { Formik } from 'formik';
import { ObjectFetchStatus } from '../../models/state';

interface StateToProps {
    reports: {
        total: number;
        items: Report[];
    };
    reportsFetchStatus: ObjectFetchStatus;
}

interface DispatchToProps {
    fetchReports: (page: number, perPage: number, filterText: string) => any;
    deleteReport: (id: number, name: string) => any;
    showDeleteDialog: typeof deleteActions.openModal;
    closeDeleteDialog: typeof deleteActions.closeModal;
}

export interface Props extends StateToProps, DispatchToProps, RouterGlobalProps {
};

export interface State {
    filterText: string;
    page: number;
    perPage: number;
    columns: Array<ICell | string>;
    rows: Array<IRow | string[]>;
    isFirstFetchReportsCall: boolean;
};

const PULL_INTERVAL_TIME = 5000;

class Reports extends React.Component<Props, State> {

    public pullTimer: any;

    public changePage = debounce(() => {
        this.refreshData();
    }, 800);

    constructor(props: Props) {
        super(props);
        this.state = {
            filterText: '',
            page: 1,
            perPage: 10,
            columns: [
                'Name',
                'Status',
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

    // React lyfe cycle methods

    public componentDidMount() {
        this.refreshData();
        this.startTimer(this.refreshData);
    }

    public componentDidUpdate() {
        // If it is the first time fetching reports and there are no reports
        // then redirect to /no-reports page.
        const { reportsFetchStatus, reports } = this.props;
        const { isFirstFetchReportsCall } = this.state;
        if (reports.total === 0 && isFirstFetchReportsCall && reportsFetchStatus.status === 'complete') {
            this.props.history.push('/no-reports');
        }
    }

    public componentWillUnmount() {
        this.stopTimer();
    }

    // Pull timer config

    public startTimer = (callback: (...args: any[]) => void) => {
        if (this.pullTimer) {
            clearInterval(this.pullTimer);
        }

        this.pullTimer = setInterval(callback, PULL_INTERVAL_TIME);
    };

    public stopTimer = () => {
        clearInterval(this.pullTimer);
    };

    //

    public handleDeleteReport = (report: Report) => {
        const { deleteReport, showDeleteDialog, closeDeleteDialog } = this.props;

        showDeleteDialog({
            name: report.fileName,
            type: 'report',
            onDelete: () => {
                deleteReport(report.id, report.fileName).then(() => {
                    closeDeleteDialog();
                    this.refreshData();
                });
            },
            onCancel: () => {
                closeDeleteDialog();
            }
        });
    };

    public renderReportStatus = (report: Report) => {
        switch (report.status) {
            case 'CREATED':
                return <p><OkIcon className="success" /> Report created - { new Date(report.creationDate).toUTCString() }</p>;
            case 'FAILED':
                return <p><ErrorCircleOIcon className="error" /> Report failed - { new Date(report.creationDate).toUTCString() }</p>;
            case 'IN_PROGRESS':
                return <p><InProgressIcon className="progress" /> Analyzing the upload file</p>;
            default:
                return null;
        }
    };

    public renderReportActions = (report: Report) => {
        const onDelete = (_event: any): void => {
            this.handleDeleteReport(report);
        };

        switch (report.status) {
            case 'CREATED':
                return <Button variant={ ButtonVariant.secondary } onClick={ onDelete }>Delete</Button>;
            case 'FAILED':
                return <Button variant={ ButtonVariant.secondary } onClick={ onDelete }>Delete</Button>;;
            case 'IN_PROGRESS':
                return '';
            default:
                return null;
        }
    };

    public filtersInRowsAndCells(): void {
        const reports: Report[] = this.props.reports.items ? Object.values(this.props.reports.items) : [];

        let rows: any[][] = [];
        if (reports.length > 0) {
            rows = reports.map((report) => (
                [
                    {
                        title: <Link to={ `/reports/${report.id}` }>{ report.fileName }</Link>
                    },
                    {
                        title: this.renderReportStatus(report)
                    },
                    {
                        title: this.renderReportActions(report)
                    }
                ]
            ));
        }

        this.setState({ rows });
    }

    public refreshData = (page: number = this.state.page, perPage: number = this.state.perPage, filterText: string = this.state.filterText) => {
        this.props.fetchReports(page, perPage, filterText).then(() => {
            this.filtersInRowsAndCells();

            // Change to false to indicate that
            const { isFirstFetchReportsCall } = this.state;
            if (isFirstFetchReportsCall) {
                this.setState({ isFirstFetchReportsCall: false });
            }
        });
    }

    public onPageChange = (event: any, page: number, shouldDebounce: boolean) => {
        this.setState({ page });
        if (shouldDebounce) {
            this.changePage();
        } else {
            this.refreshData(page);
        }
    };

    public onSetPage = (event: any, page: number) => {
        return event.target.className === 'pf-c-form-control' || this.onPageChange(event, page, false);
    };

    public onPageInput = (event: any, page: number) => {
        return this.onPageChange(event, page, true);
    };

    public onPerPageSelect = (_event: any, perPage: number) => {
        let page = this.state.page;
        const total = this.props.reports.total;

        // If current page and perPage would request data beyond total, show last available page
        if (page * perPage > total) {
            page = Math.floor(total / perPage) + 1;
        }

        this.setState({ page, perPage });
        this.refreshData(page, perPage);
    };

    public renderNoResults() {
        return (
            <React.Fragment>
                <Card>
                    <CardBody>
                        <EmptyState variant={ EmptyStateVariant.full }>
                            <EmptyStateIcon icon={ SearchIcon } />
                            <Title headingLevel="h5" size="lg">No results found</Title>
                            <EmptyStateBody>
                                No results match the search criteria
                            </EmptyStateBody>
                        </EmptyState>
                    </CardBody>
                </Card>
            </React.Fragment>
        );
    }

    public renderResultsTable() {
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

    public handleSearchSubmit = (values: any) => {
        const filterText: string = values.filterText;
        this.setState({
            filterText: filterText.trim()
        });
        this.refreshData();
    };

    public renderSearchBox = () => {
        // Always return empty because every value is valid
        const searchBoxValidation = () => {
            return {};
        }

        return (
            <Formik
                initialValues={ { filterText: '' } }
                validate={ searchBoxValidation }
                onSubmit={ this.handleSearchSubmit }
            >
                {
                    ({
                        values,
                        handleChange,
                        handleBlur,
                        handleSubmit
                    }) =>
                        {
                            const customHandleChange = (_value: any, event: any) => {
                                handleChange(event);
                            };

                            return (
                                <Form onSubmit={ handleSubmit }>
                                    <InputGroup>
                                        <TextInput
                                            type="search"
                                            id="filterText"
                                            name="filterText"
                                            aria-label="search text input"
                                            onChange={ customHandleChange }
                                            onBlur={ handleBlur }
                                            value={ values.filterText }
                                            placeholder="Filter by name..."/>
                                        <Button type="submit" variant={ ButtonVariant.tertiary } aria-label="search button for search input">
                                            <SearchIcon />
                                        </Button>
                                    </InputGroup>
                                </Form>
                            );
                        }
                }
            </Formik>
        );
    };

    public render() {
        const { isFirstFetchReportsCall, page, perPage } = this.state;
        const { total } = this.props.reports;

        if (isFirstFetchReportsCall) {
            return (
                <ReportsPage>
                    <SkeletonTable colSize={ 3 } rowSize={ 10 }/>
                </ReportsPage>
            );
        }

        return (
            <ReportsPage>
                <TableToolbar className="pf-u-justify-content-space-between">
                    <ToolbarGroup>
                        <ToolbarItem className="pf-u-mr-xl">{ this.renderSearchBox() }</ToolbarItem>
                        <ToolbarItem className="pf-u-mr-md">
                            <Link to={ '/reports/upload' } className="pf-c-button pf-m-primary">Create</Link>
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
