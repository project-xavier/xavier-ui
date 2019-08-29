import React from 'react';
import { RouterGlobalProps } from '../../../models/router';
import {
    TableToolbar,
    Skeleton,
    SkeletonTable
} from '@redhat-cloud-services/frontend-components';
import {
    Table,
    TableHeader,
    TableBody,
    ICell,
    IRow,
    sortable,
    ISortBy,
    cellWidth,
    TableVariant
} from '@patternfly/react-table';
import {
    ToolbarGroup,
    ToolbarItem,
    Pagination,
    Button,
    Bullseye,
    EmptyState,
    EmptyStateIcon,
    EmptyStateVariant,
    Title,
    TitleLevel,
    EmptyStateBody,
    Stack,
    StackItem,
    Card,
    CardBody
} from '@patternfly/react-core';
import { ErrorCircleOIcon, SearchIcon } from '@patternfly/react-icons';
import { WorkloadModel } from '../../../models';
import { ObjectFetchStatus } from '../../../models/state';
import debounce from 'lodash/debounce';
import { formatNumber } from '../../../Utilities/formatValue';
import './WorkloadsDetectedTable.scss';
import { isNullOrUndefined } from '../../../Utilities/formUtils';

interface StateToProps extends RouterGlobalProps {
    reportWorkloadsDetected: {
        total: number;
        items: WorkloadModel[]
    };
    reportWorkloadsDetectedFetchStatus: ObjectFetchStatus;
}

interface DispatchToProps {
    fetchReportWorkloadsDetected: (
        reportId: number,
        page: number,
        perPage: number,
        orderBy: string | undefined,
        orderDirection: 'asc' | 'desc' | undefined
    ) => any;
}

interface Props extends StateToProps, DispatchToProps {
    reportId: number;
};

interface Column extends ICell {
    key: string;
    cellFormatters?: any;
    transforms?: any;
}

interface State {
    page: number;
    perPage: number;
    columns: Column[];
    rows: IRow[];
    sortBy: ISortBy;
};

class WorkloadsDetectedTable extends React.Component<Props, State> {

    public changePage = debounce(() => {
        this.refreshData();
    }, 800);

    constructor(props: Props) {
        super(props);
        this.state = {
            page: 1,
            perPage: 10,
            columns: [
                {
                    title: 'Workloads',
                    key: 'workload',
                    props: { },
                    transforms: [ cellWidth('25'), sortable ]
                },
                {
                    title: 'OS',
                    key: 'osName',
                    props: { },
                    transforms: [ cellWidth('25'), sortable ]
                },
                {
                    title: 'In Clusters',
                    key: 'clusters',
                    props: { },
                    transforms: [ cellWidth('25') ]
                },
                {
                    title: 'VMs',
                    key: 'vms',
                    props: { },
                    transforms: [ cellWidth('25'), sortable ]
                }
            ],
            rows: [],
            sortBy: { }
        };
    }

    public componentDidMount() {
        this.refreshData();
    }

    public refreshData = (
        page: number = this.state.page,
        perPage: number = this.state.perPage,
        { direction, index } = this.state.sortBy
    ) => {
        const { reportId, fetchReportWorkloadsDetected } = this.props;

        const column = index ? this.state.columns[index - 1].key : undefined;
        const orderDirection = direction ? direction : undefined;
        fetchReportWorkloadsDetected(reportId, page, perPage, column, orderDirection).then(() => {
            this.filtersInRowsAndCells();
        });
    }

    public filtersInRowsAndCells = () => {
        const items: WorkloadModel[] = this.props.reportWorkloadsDetected.items
            ? Object.values(this.props.reportWorkloadsDetected.items) : [];

        let rows: any[][] = [];
        if (items.length > 0) {
            rows = items.map((row: WorkloadModel) => {
                return [
                    row.workload ? row.workload : '',
                    row.osName ? row.osName : '',
                    !isNullOrUndefined(row.clusters) ? formatNumber(row.clusters, 0) : '',
                    !isNullOrUndefined(row.vms) ? formatNumber(row.vms, 0) : ''
                ];
            });
        }

        this.setState({ rows });
    }

    /**
     * Allways will reset the page to 1
     */
    public onSort = (event: any, index: number, direction: any) => {
        const page = 1;
        const { reportId } = this.props;
        const { perPage } = this.state;

        const column = index ? this.state.columns[index].key : undefined;
        const orderDirection = direction ? direction : undefined;
        this.props.fetchReportWorkloadsDetected(reportId, page, perPage, column, orderDirection).then(() => {
            this.setState({
                page,
                sortBy: { index, direction }
            });
            this.filtersInRowsAndCells();
        });
    }

    public onPageChange = (_event: any, page: number, shouldDebounce: boolean) => {
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
        const total = this.props.reportWorkloadsDetected.total;

        // If current page and perPage would request data beyond total, show last available page
        if (page * perPage > total) {
            page = Math.floor(total / perPage) + 1;
        }

        this.setState({ page, perPage });
        this.refreshData(page, perPage);
    };

    public renderPagination = () => {
        const { page, perPage } = this.state;
        const { total } = this.props.reportWorkloadsDetected;

        return (
            <Pagination
                itemCount={ total }
                perPage={ perPage }
                page={ page }
                onSetPage={ this.onSetPage }
                onPageInput={ this.onPageInput }
                onPerPageSelect={ this.onPerPageSelect }
            />
        );
    };

    public renderResultsTable = () => {
        const { rows, columns, sortBy } = this.state;

        return (
            <Table
                aria-label='Workloads detected'
                cells={ columns }
                rows={ rows }
                sortBy={ sortBy }
                onSort={ this.onSort }
                variant={ TableVariant.compact }
                borders={ false }
            >
                <TableHeader />
                <TableBody />
                <tfoot>
                    <tr className="workloads-detected-table-footer">
                        <td colSpan={ 10 }>
                            { this.renderPagination() }
                        </td>
                    </tr>
                </tfoot>
            </Table>
        );
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

    public renderTable = () => {
        const { reportWorkloadsDetected } = this.props;

        return (
            <React.Fragment>
                { (reportWorkloadsDetected.total > 0 ? this.renderResultsTable() : this.renderNoResults()) }
            </React.Fragment>
        );
    };

    public renderTableSkeleton = () => {
        return (
            <React.Fragment>
                <SkeletonTable colSize={ 4 } rowSize={ 5 }/>
            </React.Fragment>
        );
    };

    public renderFetchError = () => {
        const onRetryClick = () => {
            this.refreshData();
        };

        return (
            <Bullseye>
                <EmptyState variant={ EmptyStateVariant.large }>
                    <EmptyStateIcon icon={ ErrorCircleOIcon } />
                    <Title headingLevel={ TitleLevel.h5 } size="lg">
                        Error
                    </Title>
                    <EmptyStateBody>
                        Something unexpected happend, please try again!
                    </EmptyStateBody>
                    <Button variant="primary" onClick={ onRetryClick }>Retry</Button>
                </EmptyState>
            </Bullseye>
        );
    };

    public render() {
        const { reportWorkloadsDetectedFetchStatus } = this.props;

        if (reportWorkloadsDetectedFetchStatus.error) {
            return this.renderFetchError();
        }

        const isFetchComplete: boolean = reportWorkloadsDetectedFetchStatus.status === 'complete';

        return (
            <React.Fragment>
                <TableToolbar className="pf-u-justify-content-space-between">
                    <ToolbarGroup>
                        <ToolbarItem className="pf-u-mr-xl"/>
                    </ToolbarGroup>
                    <ToolbarGroup>
                        <ToolbarItem>
                            { this.renderPagination() }
                        </ToolbarItem>
                    </ToolbarGroup>
                </TableToolbar>
                { isFetchComplete ? this.renderTable() : this.renderTableSkeleton() }
            </React.Fragment>
        );
    }

}

export default WorkloadsDetectedTable;
