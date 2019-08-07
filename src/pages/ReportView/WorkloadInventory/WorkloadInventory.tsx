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
    SelectOption,
    ChipGroup,
    ChipGroupToolbarItem,
    Chip
} from '@patternfly/react-core';
import { ErrorCircleOIcon, SearchIcon, FilterIcon } from '@patternfly/react-icons';
import './WorkloadInventory.scss';
import { ReportWorkloadInventory, WorkloadInventoryReportFiltersModel } from '../../../models';
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
        orderDirection: 'asc' | 'desc' | undefined,
        filterValue: Map<FilterTypeKeyEnum, string[]>
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
    filterDropDownOpen: boolean;
    filterType: {
        name: string,
        value: FilterTypeKeyEnum
    };
    filterValue: Map<FilterTypeKeyEnum, string[]>;
    secondaryFilterDropDownOpen: boolean;
};

enum FilterTypeKeyEnum {
    NONE = "NONE",
    PROVIDER = "provider",
    DATACENTER = "datacenter",
    CLUSTER = "cluster",
    VM_NAME = "vmName",
    WORKLOAD = "workload",
    OS_NAME = "osName",
    EFFORT = "complexity",
    RECOMMENDED_TARGETS_IMS = "recommendedTargetIMS",
    FLAGS_IMS = "flagIMS"
}

const chipLabelsMap: Map<FilterTypeKeyEnum, string> = new Map([
    [FilterTypeKeyEnum.PROVIDER, "Provider"],
    [FilterTypeKeyEnum.DATACENTER, "Datacenter"],
    [FilterTypeKeyEnum.CLUSTER, "Cluster"],
    [FilterTypeKeyEnum.VM_NAME, "Vm name"],
    [FilterTypeKeyEnum.WORKLOAD, "Workload"],
    [FilterTypeKeyEnum.OS_NAME, "OS name"],
    [FilterTypeKeyEnum.EFFORT, "Effort"],
    [FilterTypeKeyEnum.RECOMMENDED_TARGETS_IMS, "Rec. Targets"],
    [FilterTypeKeyEnum.FLAGS_IMS, "flags IMS"],
]);

const primaryFilters = [
    { name: 'Provider', value: FilterTypeKeyEnum.PROVIDER },
    { name: 'Datacenter', value: FilterTypeKeyEnum.DATACENTER },
    { name: 'Cluster', value: FilterTypeKeyEnum.CLUSTER },
    { name: 'Vm name', value: FilterTypeKeyEnum.VM_NAME },
    { name: 'Workload', value: FilterTypeKeyEnum.WORKLOAD },
    { name: 'Os name', value: FilterTypeKeyEnum.OS_NAME },
    { name: 'Effort', value: FilterTypeKeyEnum.EFFORT },
    { name: 'Recommended targets', value: FilterTypeKeyEnum.RECOMMENDED_TARGETS_IMS },
    { name: 'Flags IMS', value: FilterTypeKeyEnum.FLAGS_IMS }
];

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
                    transforms: [ cellWidth('10') ]
                },
                {
                    title: 'Datacenter',
                    key: 'datacenter',
                    props: {
                        className: 'vertical-align-middle'
                    },
                    transforms: [ cellWidth('10') ]
                },
                {
                    title: 'Cluster',
                    key: 'cluster',
                    props: {
                        className: 'vertical-align-middle'
                    },
                    transforms: [ cellWidth('10') ]
                },
                {
                    title: 'VM name',
                    key: 'vmName',
                    props: {
                        className: 'vertical-align-middle'
                    },
                    transforms: [ sortable, cellWidth('20') ]
                },
                {
                    title: 'Workload',
                    key: 'workload',
                    props: {
                        className: 'vertical-align-middle'
                    },
                    transforms: [ cellWidth('10') ],
                    columnTransforms: [classNames(Visibility.hiddenOnMd, Visibility.visibleOnLg)]
                },
                {
                    title: 'OS type',
                    key: 'osName',
                    props: {
                        className: 'vertical-align-middle'
                    },
                    transforms: [ sortable, cellWidth('10') ],
                    columnTransforms: [classNames(Visibility.hiddenOnMd, Visibility.visibleOnLg)]
                },
                {
                    title: 'Effort',
                    key: 'complexity',
                    props: {
                        className: 'vertical-align-middle'
                    },
                    transforms: [ sortable, cellWidth('10') ],
                    columnTransforms: [classNames(Visibility.hiddenOnMd, Visibility.visibleOnLg)]
                },
                {
                    title: 'Recommended targets',
                    key: 'recommendedTargetsIMS',
                    props: {
                        className: 'vertical-align-middle'
                    },
                    transforms: [ cellWidth('10') ],
                    columnTransforms: [classNames(Visibility.hiddenOnMd, Visibility.visibleOnLg)]
                },
                {
                    title: 'Flags IMS',
                    key: 'flagsIMS',
                    props: {
                        className: 'vertical-align-middle'
                    },
                    transforms: [ cellWidth('10') ],
                    columnTransforms: [classNames(Visibility.hiddenOnMd, Visibility.visibleOnLg)]
                }
            ],
            rows: [],
            sortBy: { },
            filterDropDownOpen: false,
            secondaryFilterDropDownOpen: false,
            filterType: {
                name: 'Filter',
                value: FilterTypeKeyEnum.NONE,
            },
            filterValue: new Map()
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
        { direction, index } = this.state.sortBy,
        filterValue: Map<FilterTypeKeyEnum, string[]> = this.state.filterValue
    ) => {
        const { reportId, fetchReportWorkloadInventory } = this.props;

        const column = index ? this.state.columns[index-1].key : undefined;
        const orderDirection = direction ? direction : undefined;
        fetchReportWorkloadInventory(reportId, page, perPage, column, orderDirection, filterValue).then(() => {
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
    };

    public onSort = (event: any, index: number, direction: any) => {
        const { reportId } = this.props;
        const { page, perPage, filterValue } = this.state;

        const column = index ? this.state.columns[index-1].key : undefined;
        const orderDirection = direction ? direction : undefined;
        this.props.fetchReportWorkloadInventory(reportId, page, perPage, column, orderDirection, filterValue).then(() => {
            this.setState({sortBy: { index, direction }});
            this.filtersInRowsAndCells();
        });
    };

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
        const { filterDropDownOpen, filterType } = this.state;
        return (
            <Dropdown
                onToggle={this.onFilterDropDownToggle}
                position={DropdownPosition.left}
                className="topology-view-filter-dropdown"
                toggle={
                <DropdownToggle onToggle={this.onFilterDropDownToggle}>
                    <FilterIcon className="pf-u-mr-sm" />
                    {filterType.name}
                </DropdownToggle>
                }
                isOpen={filterDropDownOpen}
                dropdownItems={primaryFilters.map((element, index) => {
                    return (
                        <DropdownItem key={index} onClick={e => this.onFilterTypeSelect(e, element.name, element.value)}>
                            {element.name}
                        </DropdownItem>
                    );
                })}
            />
        );
    };
    
    public onFilterDropDownToggle = (isOpen: boolean) => {
        this.setState({ filterDropDownOpen: isOpen });
    };

    public onFilterTypeSelect = (e: any, filterName: string, filterValue: FilterTypeKeyEnum) => {
        e.preventDefault();
        this.setState({
            filterType: {
                name: filterName,
                value: filterValue
            },
            filterDropDownOpen: false,
            // filterValue: filterType === this.state.filterType ? this.state.filterValue : ''
        });
    };

    public renderFilterInput = () => {
        const { filterType } = this.state;
        const { reportWorkloadInventoryAvailableFilters } = this.props;

        switch(filterType.value) {
            case FilterTypeKeyEnum.PROVIDER:
                return this.renderSecondaryFilterDropdownd(filterType, reportWorkloadInventoryAvailableFilters.providers);
            case FilterTypeKeyEnum.DATACENTER:
                return this.renderSecondaryFilterDropdownd(filterType, reportWorkloadInventoryAvailableFilters.datacenters);
            case FilterTypeKeyEnum.CLUSTER:
                return this.renderSecondaryFilterDropdownd(filterType, reportWorkloadInventoryAvailableFilters.clusters);
            case FilterTypeKeyEnum.WORKLOAD:
                return this.renderSecondaryFilterDropdownd(filterType, reportWorkloadInventoryAvailableFilters.workloads);
            case FilterTypeKeyEnum.EFFORT:
                return this.renderSecondaryFilterDropdownd(filterType, reportWorkloadInventoryAvailableFilters.complexities);
            case FilterTypeKeyEnum.RECOMMENDED_TARGETS_IMS:
                return this.renderSecondaryFilterDropdownd(filterType, reportWorkloadInventoryAvailableFilters.recommendedTargetsIMS);
            case FilterTypeKeyEnum.FLAGS_IMS:
                return this.renderSecondaryFilterDropdownd(filterType, reportWorkloadInventoryAvailableFilters.flagsIMS);
            case FilterTypeKeyEnum.VM_NAME:
                return this.renderSecondaryFilterInputText(filterType);
            case FilterTypeKeyEnum.OS_NAME:
                return this.renderSecondaryFilterInputText(filterType);
            default:
                return (
                    <TextInput
                        type="text"
                        aria-label="filter text input"
                        readOnly={true}
                        placeholder="Select a filter..."
                    />
                );
        }
    };

    public onSecondaryFilterDropdownToggle = (isExpanded: boolean) => {
        this.setState({
            secondaryFilterDropDownOpen: isExpanded
        });
    };

    public getMapValue = (key: FilterTypeKeyEnum, map: Map<FilterTypeKeyEnum, string[]>): string[] => {
        if (!map.has(key)) {
            map.set(key, []);
        }
        return map.get(key);
    };

    public applyFilterAndSearch = (filterValue: Map<FilterTypeKeyEnum, string[]>) => {
        this.setState({
            filterValue
        });

        // 
        const page = 1;
        const { reportId } = this.props;
        const { perPage } = this.state;
        const { direction, index } = this.state.sortBy;

        const column = index ? this.state.columns[index-1].key : undefined;
        const orderDirection = direction ? direction : undefined;

        this.props.fetchReportWorkloadInventory(reportId, page, perPage, column, orderDirection, filterValue).then(() => {
            this.setState({
                page
            });
            this.filtersInRowsAndCells();
        });
    };

    public onSecondaryFilterDropdownSelect = (selection: string, filterType: { name: string, value: FilterTypeKeyEnum }) => {
        const { filterValue } = this.state;
        
        const currentFilterSelections: string[] = this.getMapValue(filterType.value, filterValue);
        
        // determine newFilterValue
        const newFilterValue: Map<FilterTypeKeyEnum, string[]> = new Map(filterValue);

        const previousElement: string | undefined = currentFilterSelections.find((elem: string) => elem === selection);
        if (previousElement) {
            newFilterValue.set(filterType.value, currentFilterSelections.filter((elem: string) => elem !== selection));
        } else {
            newFilterValue.set(filterType.value, [
                ...currentFilterSelections,
                selection
            ]);
        }

        this.applyFilterAndSearch(newFilterValue);
    };

    public renderSecondaryFilterDropdownd = (filterType: { name: string, value: FilterTypeKeyEnum }, options: string[]) => {
        const { secondaryFilterDropDownOpen, filterValue } = this.state;
        let selections: string[] = this.getMapValue(filterType.value, filterValue);

        return (
            <Select
                variant={SelectVariant.checkbox}
                aria-label={`Select ${filterType.name} Input`}
                onToggle={this.onSecondaryFilterDropdownToggle}
                onSelect={(e, selection) => this.onSecondaryFilterDropdownSelect(selection, filterType)}
                isExpanded={secondaryFilterDropDownOpen}
                selections={selections}
                placeholderText={`Filter by ${filterType.name}`}
                ariaLabelledBy={filterType.name}
            >
                {options.map((val, index) => {
                    return <SelectOption key={index} value={val} />;
                })}
            </Select>
        );
    };

    public renderSecondaryFilterInputText = (filterType: { name: string, value: FilterTypeKeyEnum }) => {
        const { filterValue } = this.state;
        
        const onKeyDown = (e: any) => {
            if (e.key === 'Enter') {
                const selection = e.target.value;
                const currentFilterSelections: string[] = this.getMapValue(filterType.value, filterValue);
                
                // determine newFilterValue
                const newFilterValue: Map<FilterTypeKeyEnum, string[]> = new Map(filterValue);
                
                const previousElement: string | undefined = currentFilterSelections.find((elem: string) => elem === selection);
                if (!previousElement) {
                    newFilterValue.set(filterType.value, [
                        ...currentFilterSelections,
                        selection
                    ]);

                    this.applyFilterAndSearch(newFilterValue);
                }
            }
        };

        return (
            <TextInput
                type="search"
                aria-label="filter text input"
                placeholder={`Filter by ${filterType.name}...`}
                onKeyDown={onKeyDown}
            />
        );
    };

    deleteChipItem = (filterTypeKey: FilterTypeKeyEnum, element: string) => {
        const currentFilterValue = this.state.filterValue;
        const currentChipValues = this.getMapValue(filterTypeKey, this.state.filterValue);

        const newFilterValue = new Map(currentFilterValue);
        const newChipValues = currentChipValues.filter((e) => e !== element);
        newFilterValue.set(filterTypeKey, newChipValues);
        
        this.applyFilterAndSearch(newFilterValue);
    };

    public reportFilterChips = () => {
        const { filterValue } = this.state;

        const filterValueArray: Array<{key: FilterTypeKeyEnum, value: string[]}> = [];
        filterValue.forEach((value: string[], key: FilterTypeKeyEnum) => {
            if (value.length > 0) {
                filterValueArray.push({
                    key,
                    value
                });
            }
        });

        return (
            <ChipGroup withToolbar>
                { filterValueArray.map((group) => (
                    <ChipGroupToolbarItem key={group.key} categoryName={chipLabelsMap.get(group.key)}>
                        { group.value.map((chip: string) => (
                            <Chip key={chip} onClick={() => this.deleteChipItem(group.key, chip)}>
                                {chip}
                            </Chip>
                        ))}
                    </ChipGroupToolbarItem>
                ))}
            </ChipGroup>
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
                <TableToolbar className="pf-u-justify-content-space-between">
                    <ToolbarGroup>
                        <ToolbarItem>
                            { this.reportFilterChips() }
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
