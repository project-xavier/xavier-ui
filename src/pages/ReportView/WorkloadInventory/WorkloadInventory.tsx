import React from 'react';
import { RouterGlobalProps } from '../../../models/router';
import {
    TableToolbar,
    Skeleton,
    SkeletonTable
} from '@redhat-cloud-services/frontend-components';
import {
    expandable,
    Table,
    TableHeader,
    TableBody,
    ICell,
    IRow,
    sortable,
    ISortBy
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
import './WorkloadInventory.scss';
import { Report, ReportWorkloadInventory } from '../../../models';
import { ObjectFetchStatus } from '../../../models/state';
import ReportCard from '../../../PresentationalComponents/ReportCard';
import debounce from 'lodash/debounce';
import { formatValue } from '../../../Utilities/formatValue';
import { bytesToGb } from '../../../Utilities/unitConvertors';

interface StateToProps extends RouterGlobalProps {
    report: Report;
    reportWorkloadInventory: {
        total: number;
        items: ReportWorkloadInventory[]
    };
    reportWorkloadInventoryFetchStatus: ObjectFetchStatus;
    reportWorkloadInventoryCSVFetchStatus: ObjectFetchStatus;
}

interface DispatchToProps {
    fetchReportWorkloadInventory: (
        reportId: number,
        page: number,
        perPage: number,
        orderBy: string | undefined,
        orderDirection: 'asc' | 'desc' | undefined
    ) => any;
    fetchReportWorkloadInventoryCSV:(reportId: number) => any;
}

interface Props extends StateToProps, DispatchToProps {
    reportId: number;
};

interface Row extends IRow {
    isOpen?: boolean;
}

interface Column extends ICell {
    key: string;
    cellFormatters?: any;
    transforms?: any;
}

interface State {
    page: number;
    perPage: number;
    columns: Column[];
    rows: Row[];
    sortBy: ISortBy;
};

class WorkloadInventory extends React.Component<Props, State> {

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
                    title: 'Provider',
                    key: 'provider',
                    props: {
                        className: 'vertical-align-middle'
                    },
                    cellFormatters: [ expandable ]
                },
                {
                    title: 'Datacenter',
                    key: 'datacenter',
                    props: {
                        className: 'vertical-align-middle'
                    }
                },
                {
                    title: 'Cluster',
                    key: 'cluster',
                    props: {
                        className: 'vertical-align-middle'
                    }
                },
                {
                    title: 'VMware',
                    key: 'vmName',
                    props: {
                        className: 'vertical-align-middle'
                    },
                    transforms: [ sortable ]
                },
                {
                    title: 'Workload',
                    key: 'workload',
                    props: {
                        className: 'vertical-align-middle'
                    }
                },
                {
                    title: 'OS type',
                    key: 'osName',
                    props: {
                        className: 'vertical-align-middle'
                    },
                    transforms: [ sortable ]
                },
                {
                    title: 'Efford',
                    key: 'complexity',
                    props: {
                        className: 'vertical-align-middle'
                    },
                    transforms: [ sortable ]
                },
                {
                    title: 'Recomended targets',
                    key: 'recommendedTargetsIMS',
                    props: {
                        className: 'vertical-align-middle'
                    }
                },
                {
                    title: 'Flag IMS',
                    key: 'flagsIMS',
                    props: {
                        className: 'vertical-align-middle'
                    }
                }
            ],
            rows: [],
            sortBy: { }
        };
    }

    public componentDidMount() {
        this.refreshData();
    }

    public handleDownloadCSV = () => {
         const {reportId, fetchReportWorkloadInventoryCSV} = this.props;
         fetchReportWorkloadInventoryCSV(reportId).then((response: any) => {
            const downloadUrl = window.URL.createObjectURL(new Blob([response.value.data]));
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.setAttribute('download', 'workloadInventoryReport.csv');
            document.body.appendChild(link);
            link.click();
            link.remove();
         });
    }

    public refreshData = (
        page: number = this.state.page,
        perPage: number = this.state.perPage,
        { direction, index } = this.state.sortBy
    ) => {
        const { reportId, fetchReportWorkloadInventory } = this.props;

        const column = index ? this.state.columns[index].key : undefined;
        const orderDirection = direction ? direction : undefined;
        fetchReportWorkloadInventory(reportId, page, perPage, column, orderDirection).then(() => {
            this.filtersInRowsAndCells();
        });
    }

    public filtersInRowsAndCells = () => {
        const items: ReportWorkloadInventory[] = this.props.reportWorkloadInventory.items
            ? Object.values(this.props.reportWorkloadInventory.items) : [];

        let rows: any[][] = [];
        if (items.length > 0) {
            rows = items.reduce((a: any[], b: ReportWorkloadInventory, index: number) => {
                a.push(
                    {
                        isOpen: false,
                        cells: [
                            b.provider,
                            b.datacenter,
                            b.cluster,
                            b.vmName,
                            {
                                title: <span>
                                    {
                                        b.workloads.map((val: string, workloadIndex: number) => {
                                            return (
                                                <span key={ workloadIndex }>{ val }<br/></span>
                                            );
                                        })
                                    }</span>
                            },
                            b.osName,
                            b.complexity,
                            {
                                title: <span>
                                    {
                                        b.recommendedTargetsIMS.map((val: string, targetsIndex: number) => {
                                            return (
                                                <span key={ targetsIndex }>{ val }<br/></span>
                                            );
                                        })
                                    }</span>
                            },
                            {
                                title: <span>
                                    {
                                        b.flagsIMS.map((val: string, flagIndex: number) => {
                                            return (
                                                <span key={ flagIndex }>{ val }<br/></span>
                                            );
                                        })
                                    }</span>
                            }
                        ]
                    },
                    {
                        parent: index * 2,
                        fullWidth: false,
                        cells: [{
                            title: <div className="pf-c-content"><dl>
                                <dt>Disk space (GB)</dt>
                                <dd>{ formatValue(bytesToGb(b.diskSpace), 'gb', { fractionDigits: 1 }) }</dd>
                                <dt>Memory (GB)</dt>
                                <dd>{ formatValue(bytesToGb(b.memory), 'gb', { fractionDigits: 1 }) }</dd>
                                <dt>CPU cores</dt>
                                <dd>{ b.cpuCores.toLocaleString() }</dd>
                                <dt>Operating system description</dt>
                                <dd>{ b.osDescription }</dd>
                            </dl></div>
                        }]
                    }
                );
                return a;
            }, []);
        }

        this.setState({ rows });
    }

    public onSort = (event: any, index: number, direction: any) => {
        const { reportId } = this.props;
        const { page, perPage } = this.state;

        const column = index ? this.state.columns[index-1].key : undefined;
        const orderDirection = direction ? direction : undefined;
        this.props.fetchReportWorkloadInventory(reportId, page, perPage, column, orderDirection).then(() => {
            this.setState({sortBy: { index, direction }});
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
        const total = this.props.reportWorkloadInventory.total;

        // If current page and perPage would request data beyond total, show last available page
        if (page * perPage > total) {
            page = Math.floor(total / perPage) + 1;
        }

        this.setState({ page, perPage });
        this.refreshData(page, perPage);
    };

    public onRowCollapse = (_event: any, rowKey: number, isOpen: boolean) => {
        const { rows } = this.state;

        rows[rowKey].isOpen = isOpen;
        this.setState({
            rows
        });
    }

    public renderPagination = () => {
        const { page, perPage } = this.state;
        const { total } = this.props.reportWorkloadInventory;

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
                aria-label='Workload inventory'
                onCollapse={ this.onRowCollapse }
                rows={ rows }
                cells={ columns }
                sortBy={ sortBy }
                onSort={ this.onSort }
                className="table-vertical-align-middle"
            >
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

    public renderWorkloadInventory = () => {
        const { reportWorkloadInventory, reportWorkloadInventoryCSVFetchStatus } = this.props;

        return (
            <React.Fragment>
                <TableToolbar className="pf-u-justify-content-space-between">
                    <ToolbarGroup>
                        <ToolbarItem className="pf-u-mr-xl">
                            { /* <InputGroup>
                                <TextInput
                                    type="search"
                                    id="filterText"
                                    name="filterText"
                                    aria-label="search text input"
                                    placeholder="Filter by name..."
                                />
                                <Button type="submit" variant={ ButtonVariant.tertiary } aria-label="search button for search input">
                                    <SearchIcon />
                                </Button>
                            </InputGroup> */ }
                        </ToolbarItem>
                        <ToolbarItem className="pf-u-mr-md">
                            <Button
                                variant={"primary"}
                                onClick={this.handleDownloadCSV}
                                isDisabled={reportWorkloadInventoryCSVFetchStatus.status==='inProgress'}
                            >
                                {
                                    reportWorkloadInventoryCSVFetchStatus.status==='inProgress' ?
                                        'Exporting CSV' : 'Export as CSV'
                                }
                            </Button>
                        </ToolbarItem>
                    </ToolbarGroup>
                    <ToolbarGroup>
                        <ToolbarItem>
                            { this.renderPagination() }
                        </ToolbarItem>
                    </ToolbarGroup>
                </TableToolbar>
                { (reportWorkloadInventory. total > 0 ? this.renderResultsTable() : this.renderNoResults()) }
            </React.Fragment>
        );
    };

    public renderWorkloadInventorySkeleton = () => {
        return (
            <React.Fragment>
                <Stack gutter='md'>
                    <StackItem isFilled={ false }>
                        <ReportCard
                            title={ <Skeleton size="sm" /> }
                        >
                            <SkeletonTable colSize={ 9 } rowSize={ 10 }/>
                        </ReportCard>
                    </StackItem>
                </Stack>
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
        const { reportWorkloadInventoryFetchStatus } = this.props;

        if (reportWorkloadInventoryFetchStatus.error) {
            return this.renderFetchError();
        }

        const isFetchComplete: boolean = reportWorkloadInventoryFetchStatus.status === 'complete';

        return (
            <React.Fragment>
                { isFetchComplete ? this.renderWorkloadInventory() : this.renderWorkloadInventorySkeleton() }
            </React.Fragment>
        );
    }

}

export default WorkloadInventory;
