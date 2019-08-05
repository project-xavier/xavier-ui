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
    ISortBy,
    cellWidth,
    classNames,
    Visibility
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
    CardBody,
    Dropdown,
    DropdownToggle,
    DropdownItem,
    TextInput,
    DropdownPosition,
    Select,
    SelectVariant,
    SelectOption
} from '@patternfly/react-core';
import { ErrorCircleOIcon, SearchIcon, FilterIcon } from '@patternfly/react-icons';
import './WorkloadInventory.scss';
import { Report, ReportWorkloadInventory, WorkloadInventoryReportFiltersModel } from '../../../models';
import { ObjectFetchStatus } from '../../../models/state';
import ReportCard from '../../../PresentationalComponents/ReportCard';
import debounce from 'lodash/debounce';
import { formatValue } from '../../../Utilities/formatValue';
import { bytesToGb } from '../../../Utilities/unitConvertors';

interface StateToProps extends RouterGlobalProps {
    reportWorkloadInventory: {
        total: number;
        items: ReportWorkloadInventory[]
    };
    reportWorkloadInventoryFetchStatus: ObjectFetchStatus;
    reportWorkloadInventoryCSVFetchStatus: ObjectFetchStatus;
    reportWorkloadInventoryAvailableFilters: WorkloadInventoryReportFiltersModel;
    reportWorkloadInventoryAvailableFiltersFetchStatus: ObjectFetchStatus;
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
    fetchReportWorkloadInventoryAvailableFilters: (reportId: number) => any;
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
    filterDropDownOpen_1: boolean; // Level 1 filter dropdown
    filterDropDownOpen_2: boolean; // Level 2 filter dropdown
    filterType: string;
    filterTypeKey: FilterTypeKeyEnum;
    filterValue: string;
};

enum FilterTypeKeyEnum {
    NONE = "NONE",
    PROVIDER = "PROVIDER",
    DATACENTER = "DATACENTER",
    CLUSTER = "CLUSTER",
    VM_NAME = "VM_NAME",
    WORKLOAD = "WORKLOAD",
    OS_NAME = "OS_NAME",
    EFFORT = "EFFORT",
    RECOMMENDED_TARGETS_IMS = "RECOMMENDED_TARGETS_IMS",
    FLAGS_IMS = "FLAGS_IMS"
}

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
                    cellFormatters: [ expandable ],
                    transforms: [ cellWidth(10) ]
                },
                {
                    title: 'Datacenter',
                    key: 'datacenter',
                    props: {
                        className: 'vertical-align-middle'
                    },
                    transforms: [ cellWidth(10) ]
                },
                {
                    title: 'Cluster',
                    key: 'cluster',
                    props: {
                        className: 'vertical-align-middle'
                    },
                    transforms: [ cellWidth(10) ]
                },
                {
                    title: 'VM name',
                    key: 'vmName',
                    props: {
                        className: 'vertical-align-middle'
                    },
                    transforms: [ sortable, cellWidth(20) ]
                },
                {
                    title: 'Workload',
                    key: 'workload',
                    props: {
                        className: 'vertical-align-middle'
                    },
                    transforms: [ cellWidth(10) ],
                    columnTransforms: [classNames(Visibility.hiddenOnMd, Visibility.visibleOnLg)]
                },
                {
                    title: 'OS type',
                    key: 'osName',
                    props: {
                        className: 'vertical-align-middle'
                    },
                    transforms: [ sortable, cellWidth(10) ],
                    columnTransforms: [classNames(Visibility.hiddenOnMd, Visibility.visibleOnLg)]
                },
                {
                    title: 'Effort',
                    key: 'complexity',
                    props: {
                        className: 'vertical-align-middle'
                    },
                    transforms: [ sortable, cellWidth(10) ],
                    columnTransforms: [classNames(Visibility.hiddenOnMd, Visibility.visibleOnLg)]
                },
                {
                    title: 'Recommended targets',
                    key: 'recommendedTargetsIMS',
                    props: {
                        className: 'vertical-align-middle'
                    },
                    transforms: [ cellWidth(10) ],
                    columnTransforms: [classNames(Visibility.hiddenOnMd, Visibility.visibleOnLg)]
                },
                {
                    title: 'Flags IMS',
                    key: 'flagsIMS',
                    props: {
                        className: 'vertical-align-middle'
                    },
                    transforms: [ cellWidth(10) ],
                    columnTransforms: [classNames(Visibility.hiddenOnMd, Visibility.visibleOnLg)]
                }
            ],
            rows: [],
            sortBy: { },
            filterDropDownOpen_1: false,
            filterDropDownOpen_2: false,
            filterType: 'Filter',
            filterTypeKey: FilterTypeKeyEnum.NONE,
            filterValue: ''
        };
    }

    public componentDidMount() {
        this.refreshData();
        this.refreshFilters();
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

    public refreshFilters = () => {
        const { reportId, fetchReportWorkloadInventoryAvailableFilters } = this.props;
        fetchReportWorkloadInventoryAvailableFilters(reportId);
    };

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

    public renderFilterTypeDropdown = () => {
        const { filterDropDownOpen_1, filterType } = this.state;
        return (
            <Dropdown
                onToggle={this.onFilterDropDownToggle}
                position={DropdownPosition.left}
                className="topology-view-filter-dropdown"
                toggle={
                <DropdownToggle onToggle={this.onFilterDropDownToggle}>
                    <FilterIcon className="pf-u-mr-sm" />
                    {filterType}
                </DropdownToggle>
                }
                isOpen={filterDropDownOpen_1}
                dropdownItems={[
                <DropdownItem key="provider" onClick={e => this.onFilterTypeSelect(e, 'Provider', FilterTypeKeyEnum.PROVIDER)}>
                    Provider
                </DropdownItem>,
                <DropdownItem key="datacenter" onClick={e => this.onFilterTypeSelect(e, 'Datacenter', FilterTypeKeyEnum.DATACENTER)}>
                    Datacenter
                </DropdownItem>,
                <DropdownItem key="cluster" onClick={e => this.onFilterTypeSelect(e, 'Cluster', FilterTypeKeyEnum.CLUSTER)}>
                    Cluster
                </DropdownItem>,
                <DropdownItem key="vmName" onClick={e => this.onFilterTypeSelect(e, 'VM name', FilterTypeKeyEnum.VM_NAME)}>
                    VM name
                </DropdownItem>,
                <DropdownItem key="workload" onClick={e => this.onFilterTypeSelect(e, 'Workload', FilterTypeKeyEnum.WORKLOAD)}>
                    Workload
                </DropdownItem>,
                <DropdownItem key="osName" onClick={e => this.onFilterTypeSelect(e, 'OS type', FilterTypeKeyEnum.OS_NAME)}>
                    OS type
                </DropdownItem>,
                <DropdownItem key="complexity" onClick={e => this.onFilterTypeSelect(e, 'Effort', FilterTypeKeyEnum.EFFORT)}>
                    Effort
                </DropdownItem>,
                <DropdownItem key="recommendedTargetsIMS" onClick={e => this.onFilterTypeSelect(e, 'Recommended targets', FilterTypeKeyEnum.RECOMMENDED_TARGETS_IMS)}>
                    Recommended targets
                </DropdownItem>,
                <DropdownItem key="flagsIMS" onClick={e => this.onFilterTypeSelect(e, 'Flags IMS', FilterTypeKeyEnum.FLAGS_IMS)}>
                    Flags IMS
                </DropdownItem>
                ]}
            />
        );
    };
    
    onFilterDropDownToggle = (isOpen: boolean) => {
        this.setState({ filterDropDownOpen_1: isOpen });
    };

    onFilterTypeSelect = (e: any, filterType: string, filterTypeKey: FilterTypeKeyEnum) => {
        e.preventDefault();
        this.setState({
            filterType,
            filterTypeKey,
            filterDropDownOpen_1: false,
            filterValue: filterType === this.state.filterType ? this.state.filterValue : ''
        });
    };

    public renderFilterInput = () => {
        const { filterTypeKey } = this.state;
        const { reportWorkloadInventoryAvailableFilters } = this.props;

        switch(filterTypeKey) {
            case FilterTypeKeyEnum.PROVIDER:
                return this.renderFilterDropdowndLevel2('Provider', reportWorkloadInventoryAvailableFilters.providers);
            case FilterTypeKeyEnum.DATACENTER:
                return this.renderFilterDropdowndLevel2('Datacenter', reportWorkloadInventoryAvailableFilters.datacenters);
            case FilterTypeKeyEnum.CLUSTER:
                return this.renderFilterDropdowndLevel2('Cluster', reportWorkloadInventoryAvailableFilters.clusters);
        }
        return (
            <TextInput
                type="text"
                aria-label="filter text input"
            />
        );
    };

    onToggleFilterDropdownLevel2 = (isExpanded: boolean) => {
        this.setState({
            filterDropDownOpen_2: isExpanded
        });
    };

    public renderFilterDropdowndLevel2 = (filterName: string, options: string[]) => {
        const { filterDropDownOpen_2 } = this.state;
        return (
            <Select
                variant={SelectVariant.checkbox}
                aria-label="Select Input"
                onToggle={this.onToggleFilterDropdownLevel2}
                isExpanded={filterDropDownOpen_2}
                selections={[]}
                placeholderText={`Filter by ${filterName}`}
                ariaLabelledBy={filterName}
            >
                {options.map((val, index) => {
                    return <SelectOption key={index} value={val} />;
                })}
            </Select>
        );
    };

    public renderWorkloadInventory = () => {
        const { reportWorkloadInventory, reportWorkloadInventoryCSVFetchStatus } = this.props;

        return (
            <React.Fragment>
                <TableToolbar className="pf-u-justify-content-space-between">
                    <ToolbarGroup>
                        <ToolbarItem>{this.renderFilterTypeDropdown()}</ToolbarItem>
                        <ToolbarItem className="pf-u-mr-md">{this.renderFilterInput()}</ToolbarItem>
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
