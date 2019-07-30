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
    IRow
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
import { Link } from 'react-router-dom';
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
}

interface DispatchToProps {
    fetchReportWorkloadInventory: (
        reportId: number,
        page: number,
        perPage: number
    ) => any;
}

interface Props extends StateToProps, DispatchToProps {
    reportId: number;
};

interface State {
    page: number;
    perPage: number;
    columns: Array<ICell | string>;
    rows: Array<IRow | string[]>;
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
                    title: 'Provider/Datacenter/Cluster',
                    cellFormatters: [ expandable ],
                    props: {
                        className: 'vertical-align-middle'
                    }
                },
                {
                    title: 'VMware',
                    props: {
                        className: 'vertical-align-middle'
                    }
                },
                {
                    title: 'Workload',
                    props: {
                        className: 'vertical-align-middle'
                    }
                },
                {
                    title: 'OS type',
                    props: {
                        className: 'vertical-align-middle'
                    }
                },
                {
                    title: 'Risk IMS',
                    props: {
                        className: 'vertical-align-middle'
                    }
                },
                {
                    title: 'Recomended targets',
                    props: {
                        className: 'vertical-align-middle'
                    }
                },
                {
                    title: 'Flag IMS',
                    props: {
                        className: 'vertical-align-middle'
                    }
                }
            ],
            rows: []
        };
    }

    public componentDidMount() {
        this.refreshData();
    }

    public refreshData = (
        page: number = this.state.page,
        perPage: number = this.state.perPage
    ) => {
        const { reportId, fetchReportWorkloadInventory } = this.props;
        fetchReportWorkloadInventory(reportId, page, perPage).then(() => {
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
                            {
                                title: <span>
                                    <span>{ b.provider }<br/></span>
                                    <span>{ b.datacenter }<br/></span>
                                    <span>{ b.cluster }<br/></span>
                                </span>
                            },
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
        const { rows, columns } = this.state;

        return (
            <Table
                aria-label='Workload inventory'
                onCollapse={ this.onRowCollapse }
                rows={ rows }
                cells={ columns }
            >
                <TableHeader />
                <TableBody />
                <tfoot>
                    <tr>
                        <td colSpan={ 8 }>
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
        const total = 10;

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
                            <Link to={ '/reports/upload' } className="pf-c-button pf-m-primary">Export as CSV</Link>
                        </ToolbarItem>
                    </ToolbarGroup>
                    <ToolbarGroup>
                        <ToolbarItem>
                            { this.renderPagination() }
                        </ToolbarItem>
                    </ToolbarGroup>
                </TableToolbar>
                { (total > 0 ? this.renderResultsTable() : this.renderNoResults()) }
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
                            <SkeletonTable colSize={ 7 } rowSize={ 10 }/>
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
