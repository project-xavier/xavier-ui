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
    CardBody,
    Dropdown,
    KebabToggle,
    DropdownItem
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
import { formatDate } from '../../Utilities/formatValue';

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
    fetchReportPayloadDownloadLink: (reportId: number) => any;
    addNotification(notification: any);
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
    renderInProgresFetchStatus: boolean;
    toggleReportsIDS: Set<number>;
};

const PULL_INTERVAL_TIME = 5000;

class Reports extends React.Component<Props, State> {

    public pullTimer: any;

    public refreshDataWithDedounce = debounce(() => {
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
            isFirstFetchReportsCall: true,
            renderInProgresFetchStatus: false,
            toggleReportsIDS: new Set()
        };
    }

    // React lyfe cycle methods

    public componentDidMount() {
        this.refreshData();
        this.resetRefreshDataTimer();
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

    //

    public setStateAndResetTimerAndSetRenderStatus = (state: any = {}) => {
        this.resetRefreshDataTimer();
        this.setState({
            ...state,
            renderInProgresFetchStatus: true
        });
    };

    // Pull timer config

    public resetRefreshDataTimer = () => {
        this.stopTimer();
        this.startTimer(this.refreshData);
    };

    public startTimer = (callback: (...args: any[]) => void) => {
        if (this.pullTimer) {
            clearInterval(this.pullTimer);
        }

        this.pullTimer = setInterval(callback, PULL_INTERVAL_TIME);
    };

    public stopTimer = () => {
        clearInterval(this.pullTimer);
    };

    // Table data management section

    public refreshData = (page: number = this.state.page, perPage: number = this.state.perPage, filterText: string = this.state.filterText) => {
        
        this.props.fetchReports(page, perPage, filterText).then(() => {
            this.filtersInRowsAndCells();

            // Change renderInProgresFetchStatus to false
            const { renderInProgresFetchStatus } = this.state;
            if (renderInProgresFetchStatus) {
                this.setState({
                    renderInProgresFetchStatus: false
                });
            }

            // Change isFirstFetchReportsCall to false
            const { isFirstFetchReportsCall } = this.state;
            if (isFirstFetchReportsCall) {
                this.setState({ isFirstFetchReportsCall: false });
            }
        });
    };

    public filtersInRowsAndCells = () => {
        const reports: Report[] = this.props.reports.items ? Object.values(this.props.reports.items) : [];

        let rows: Array<IRow | string[]> = [];
        if (reports.length > 0) {
            rows = reports.map((report) => ({
                cells: [
                    {
                        title: this.renderReportName(report)
                    },
                    {
                        title: this.renderReportStatus(report)
                    },
                    {
                        title: this.renderReportActions(report)
                    }
                ]
            }));
        }

        this.setState({ rows });
    };

    // Actions

    public handleReportKebabToggle = (report: Report, isOpen: boolean) => {
        const { toggleReportsIDS } = this.state;

        const newValue = new Set(toggleReportsIDS);
        if (isOpen) {
            newValue.add(report.id);
        }  else {
            newValue.delete(report.id);
        }
        this.setState({
            toggleReportsIDS: newValue
        }, () => {
            this.filtersInRowsAndCells();
        });
    };

    public handleDownloadReportPayload = (report: Report) => {
        const {fetchReportPayloadDownloadLink, addNotification} = this.props;

        // close kebab
        this.handleReportKebabToggle(report, false);
        

        fetchReportPayloadDownloadLink(report.id).then((response: any) => {
            if (response && response.value && response.value.data) {
                const data = response.value.data;
                if (data.downloadLink) {
                    const link = document.createElement('a');
                    link.href = data.downloadLink;
                    link.setAttribute('download', data.filename);
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                } else {
                    addNotification({
                        variant: 'danger',
                        title: 'Could not download payload file',
                        description: 'The retention period for the payload file has expired',
                        dismissable: true
                    });
                }
            } else {
                throw new Error("No valid response found");
            }
        });
    };

    public handleDeleteReport = (report: Report) => {
        const { deleteReport, showDeleteDialog, closeDeleteDialog } = this.props;

        showDeleteDialog({
            name: report.reportName,
            type: 'report',
            onDelete: () => {
                deleteReport(report.id, report.reportName).then(() => {
                    closeDeleteDialog();

                    this.setStateAndResetTimerAndSetRenderStatus();
                    this.refreshData();
                });
            },
            onCancel: () => {
                closeDeleteDialog();
            }
        });
    };

    public onPageChange = (event: any, page: number, shouldDebounce: boolean) => {
        this.setState({ page });

        this.setStateAndResetTimerAndSetRenderStatus();
        if (shouldDebounce) {
            this.refreshDataWithDedounce();
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
        const page = 1;

        this.setStateAndResetTimerAndSetRenderStatus({page, perPage});
        this.refreshData(page, perPage);
    };

    public handleSearchSubmit = (values: any) => {
        const page = 1;
        const filterText: string = values.filterText.trim();
        const {perPage} = this.state;

        this.setStateAndResetTimerAndSetRenderStatus({
            filterText,
            page
        });
        this.refreshData(page, perPage, filterText);
    };

    // Render section

    public renderReportName = (report: Report) => {
        switch (report.status) {
            case 'CREATED':
                return <Link to={ `/reports/${report.id}` }>{ report.reportName }</Link>;
            default:
                return <span>{ report.reportName }</span>;
        }
    };

    public renderReportStatus = (report: Report) => {
        switch (report.status) {
            case 'CREATED':
                return <p><OkIcon className="success" /> Report created - { formatDate(new Date(report.lastUpdate)) }</p>;
            case 'FAILED':
                return <p><ErrorCircleOIcon className="error" /> Report failed - { formatDate(new Date(report.lastUpdate)) }</p>;
            case 'IN_PROGRESS':
                return <p><InProgressIcon className="progress" /> Analyzing the upload file</p>;
            default:
                return null;
        }
    };

    public renderReportActions = (report: Report) => {
        const { toggleReportsIDS } = this.state;
        const isOpen = toggleReportsIDS.has(report.id);

        const onDelete = (_event: any): void => {
            this.handleDeleteReport(report);
        };

        const onDownload = (_event: any): void => {
            this.handleDownloadReportPayload(report);
        };

        const onKebabToggle = (newIsOpen: boolean) => {
            this.handleReportKebabToggle(report, newIsOpen);
        };

        const dropdownItems = [
            <DropdownItem key="download" component="button" onClick={onDownload}>Download</DropdownItem>,
            <DropdownItem key="delete" component="button" onClick={onDelete} style={{color: 'var(--pf-global--danger-color--100)'}}>Delete</DropdownItem>,
        ];

        const dropdown = (
            <Dropdown
                position={'right'}
                toggle={<KebabToggle onToggle={onKebabToggle} />}
                isOpen={isOpen}
                isPlain={true}
                dropdownItems={dropdownItems}
            />
        );

        switch (report.status) {
            case 'CREATED':
                return dropdown;
            case 'FAILED':
                return dropdown;
            case 'IN_PROGRESS':
                return '';
            default:
                return null;
        }
    };

    public renderNoResults = () => {
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
    };

    public renderResultsTable = () => {
        const { rows, columns } = this.state;

        return (
            <Table aria-label='Reports list'
                rows={ rows }
                cells={ columns }
                gridBreakPoint={ TableGridBreakpoint.gridMd } >
                <TableHeader />
                <TableBody />
                <tfoot>
                    <tr>
                        <td colSpan={ 10 }>
                            { this.renderPagination() }
                        </td>
                    </tr>
                </tfoot>
            </Table>
        );
    };

    public renderPagination = () => {
        const { reports } = this.props;
        const { page, perPage } = this.state;

        return (
            <Pagination
                itemCount={ reports.total }
                perPage={ perPage }
                page={ page }
                onSetPage={ this.onSetPage }
                onPageInput={ this.onPageInput }
                onPerPageSelect={ this.onPerPageSelect }
            />
        );
    };

    public renderResultsTableSkeleton = () => {
        return (
            <SkeletonTable colSize={ 3 } rowSize={ 10 }/>
        );
    };

    public renderSearchBox = () => {
        // Always return empty because every value is valid
        const searchBoxValidation = () => {
            return {};
        };

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
        const { isFirstFetchReportsCall, renderInProgresFetchStatus } = this.state;
        const { reports, reportsFetchStatus } = this.props;

        let toolbar: React.ReactNode;
        if (isFirstFetchReportsCall) {
            toolbar = '';
        } else {
            toolbar = (
                <TableToolbar className="pf-u-justify-content-space-between">
                    <ToolbarGroup>
                        <ToolbarItem className="pf-u-mr-xl">{ this.renderSearchBox() }</ToolbarItem>
                        <ToolbarItem className="pf-u-mr-md">
                            <Link to={ '/reports/upload' } className="pf-c-button pf-m-primary">Create</Link>
                        </ToolbarItem>
                    </ToolbarGroup>
                    <ToolbarGroup>
                        <ToolbarItem>
                            { this.renderPagination() }
                        </ToolbarItem>
                    </ToolbarGroup>
                </TableToolbar>
            );
        }

        let table: React.ReactNode;
        if (isFirstFetchReportsCall || (reportsFetchStatus.status === 'inProgress' && renderInProgresFetchStatus)) {
            table = this.renderResultsTableSkeleton();
        } else {
            table = reports.total > 0 ? this.renderResultsTable() : this.renderNoResults();
        }

        return (
            <ReportsPage>
                { toolbar }
                { table }
            </ReportsPage>
        );
    }
}

export default Reports;
