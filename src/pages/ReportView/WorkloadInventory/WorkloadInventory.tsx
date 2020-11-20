import React from 'react';
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
  Chip,
  ButtonVariant,
  Form,
  Tooltip,
} from '@patternfly/react-core';
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
  Visibility,
  truncate,
} from '@patternfly/react-table';
import { ErrorCircleOIcon, SearchIcon, FilterIcon, FlagIcon } from '@patternfly/react-icons';
import { SkeletonTable } from '@redhat-cloud-services/frontend-components/components/SkeletonTable';
import { TableToolbar } from '@redhat-cloud-services/frontend-components/components/TableToolbar';
import debounce from 'lodash/debounce';
import { Formik } from 'formik';
import { RouterGlobalProps } from '../../../models/router';
import { ReportWorkloadInventory, WorkloadInventoryReportFiltersModel } from '../../../models';
import { ObjectFetchStatus } from '../../../models/state';
import { extractFilenameFromContentDispositionHeaderValue } from '../../../Utilities/extractUtils';
import { WorkloadInventoryDetails } from './WorkloadInventoryDetails';
import './WorkloadInventory.scss';

interface StateToProps extends RouterGlobalProps {
  reportWorkloadInventory: {
    total: number;
    items: ReportWorkloadInventory[];
  };
  reportWorkloadInventoryFetchStatus: ObjectFetchStatus;
  reportWorkloadInventoryFilteredCSVFetchStatus: ObjectFetchStatus;
  reportWorkloadInventoryAvailableFilters: WorkloadInventoryReportFiltersModel | null;
  reportWorkloadInventoryAvailableFiltersFetchStatus: ObjectFetchStatus;
}

interface DispatchToProps {
  fetchReportWorkloadInventory: (
    reportId: number,
    page: number,
    perPage: number,
    orderBy: string | undefined,
    orderDirection: 'asc' | 'desc' | undefined,
    filterValue: Map<string, string[]>
  ) => any;
  fetchReportWorkloadInventoryFilteredCSV: (
    id: number,
    orderBy: string | undefined,
    orderDirection: 'asc' | 'desc' | undefined,
    filters: Map<string, string[]>
  ) => any;
  fetchReportWorkloadInventoryAvailableFilters: (reportId: number) => any;
}

interface Props extends StateToProps, DispatchToProps {
  reportId: number;
}

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
    name: string;
    value: FilterTypeKeyEnum;
  };
  filterValue: Map<FilterTypeKeyEnum, string[]>;
  secondaryFilterDropDownOpen: boolean;
}

interface FilterConfig {
  key: string;
  label: string;
  abbreviation?: string;
}

const filtersConfig = {
  provider: { key: 'provider', label: 'Provider' } as FilterConfig,
  datacenter: { key: 'datacenter', label: 'Datacenter' } as FilterConfig,
  cluster: { key: 'cluster', label: 'Cluster' } as FilterConfig,
  vmName: { key: 'vmName', label: 'VM name' } as FilterConfig,
  workload: { key: 'workload', label: 'Workload' } as FilterConfig,
  osName: { key: 'osName', label: 'Operating system type' } as FilterConfig,
  effort: { key: 'complexity', label: 'Effort' } as FilterConfig,
  recommendedTargetIMS: {
    key: 'recommendedTargetIMS',
    label: 'Recommended targets',
    abbreviation: 'Rec. Targets',
  } as FilterConfig,
  flagIMS: { key: 'flagIMS', label: 'Flags' } as FilterConfig,
};

enum FilterTypeKeyEnum {
  NONE = 'NONE',
  PROVIDER = 'PROVIDER',
  DATACENTER = 'DATACENTER',
  CLUSTER = 'CLUSTER',
  VM_NAME = 'VM_NAME',
  WORKLOAD = 'WORKLOAD',
  OS_NAME = 'OS_NAME',
  EFFORT = 'EFFORT',
  RECOMMENDED_TARGETS_IMS = 'RECOMMENDED_TARGETS_IMS',
  FLAGS_IMS = 'FLAGS_IMS',
}

const primaryFilters = [
  { name: filtersConfig.provider.label, value: FilterTypeKeyEnum.PROVIDER },
  { name: filtersConfig.datacenter.label, value: FilterTypeKeyEnum.DATACENTER },
  { name: filtersConfig.cluster.label, value: FilterTypeKeyEnum.CLUSTER },
  { name: filtersConfig.vmName.label, value: FilterTypeKeyEnum.VM_NAME },
  { name: filtersConfig.workload.label, value: FilterTypeKeyEnum.WORKLOAD },
  { name: filtersConfig.osName.label, value: FilterTypeKeyEnum.OS_NAME },
  { name: filtersConfig.effort.label, value: FilterTypeKeyEnum.EFFORT },
  {
    name: filtersConfig.recommendedTargetIMS.label,
    value: FilterTypeKeyEnum.RECOMMENDED_TARGETS_IMS,
  },
  { name: filtersConfig.flagIMS.label, value: FilterTypeKeyEnum.FLAGS_IMS },
];

const chipLabelsMap: Map<FilterTypeKeyEnum, string> = new Map([
  [FilterTypeKeyEnum.PROVIDER, filtersConfig.provider.label],
  [FilterTypeKeyEnum.DATACENTER, filtersConfig.datacenter.label],
  [FilterTypeKeyEnum.CLUSTER, filtersConfig.cluster.label],
  [FilterTypeKeyEnum.VM_NAME, filtersConfig.vmName.label],
  [FilterTypeKeyEnum.WORKLOAD, filtersConfig.workload.label],
  [FilterTypeKeyEnum.OS_NAME, filtersConfig.osName.label],
  [FilterTypeKeyEnum.EFFORT, filtersConfig.effort.label],
  [
    FilterTypeKeyEnum.RECOMMENDED_TARGETS_IMS,
    filtersConfig.recommendedTargetIMS.abbreviation || filtersConfig.recommendedTargetIMS.label,
  ],
  [FilterTypeKeyEnum.FLAGS_IMS, filtersConfig.flagIMS.label],
]);

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
          title: filtersConfig.provider.label,
          key: filtersConfig.provider.key,
          props: {
            className: 'vertical-align-middle',
          },
          cellFormatters: [expandable],
          transforms: [cellWidth(10)],
          cellTransforms: [truncate],
        },
        {
          title: filtersConfig.datacenter.label,
          key: filtersConfig.datacenter.key,
          props: {
            className: 'vertical-align-middle',
          },
          transforms: [cellWidth(15)],
          cellTransforms: [truncate],
        },
        {
          title: filtersConfig.cluster.label,
          key: filtersConfig.cluster.key,
          props: {
            className: 'vertical-align-middle',
          },
          transforms: [cellWidth(15)],
          cellTransforms: [truncate],
        },
        {
          title: filtersConfig.vmName.label,
          key: filtersConfig.vmName.key,
          props: {
            className: 'vertical-align-middle',
          },
          transforms: [sortable, cellWidth(15)],
          cellTransforms: [truncate],
        },
        {
          title: filtersConfig.workload.label,
          key: filtersConfig.workload.key,
          props: {
            className: 'vertical-align-middle',
          },
          transforms: [cellWidth(10)],
          cellTransforms: [truncate],
          columnTransforms: [classNames(Visibility.hiddenOnMd!, Visibility.visibleOnLg!)],
        },
        {
          title: filtersConfig.osName.label,
          key: filtersConfig.osName.key,
          props: {
            className: 'vertical-align-middle',
          },
          transforms: [sortable, cellWidth(15)],
          cellTransforms: [truncate],
          columnTransforms: [classNames(Visibility.hiddenOnMd!, Visibility.visibleOnLg!)],
        },
        {
          title: filtersConfig.effort.label,
          key: filtersConfig.effort.key,
          props: {
            className: 'vertical-align-middle',
          },
          transforms: [sortable, cellWidth(10)],
          cellTransforms: [truncate],
          columnTransforms: [classNames(Visibility.hiddenOnMd!, Visibility.visibleOnLg!)],
        },
        {
          title: filtersConfig.flagIMS.label,
          key: filtersConfig.flagIMS.key,
          props: {
            className: 'vertical-align-middle',
          },
          transforms: [cellWidth(10)],
          columnTransforms: [classNames(Visibility.hiddenOnMd!, Visibility.visibleOnLg!)],
        },
      ],
      rows: [],
      sortBy: {},
      filterDropDownOpen: false,
      secondaryFilterDropDownOpen: false,
      filterType: {
        name: 'Filter',
        value: FilterTypeKeyEnum.NONE,
      },
      filterValue: new Map(),
    };
  }

  public componentDidMount() {
    this.refreshData();
    this.refreshFilters();
  }

  public handleDownloadFilteredCSV = () => {
    const { sortBy, filterValue } = this.state;
    const { reportId, fetchReportWorkloadInventoryFilteredCSV } = this.props;

    const orderByColumn = sortBy.index ? this.state.columns[sortBy.index - 1].key : undefined;
    const orderDirection = sortBy.direction ? sortBy.direction : undefined;

    const mappedFilterValue = this.prepareFiltersToBeSended(filterValue);
    fetchReportWorkloadInventoryFilteredCSV(
      reportId,
      orderByColumn,
      orderDirection,
      mappedFilterValue
    ).then((response: any) => {
      const contentDispositionHeader = response.value.headers['content-disposition'];
      const fileName = extractFilenameFromContentDispositionHeaderValue(contentDispositionHeader);

      const downloadUrl = window.URL.createObjectURL(new Blob([response.value.data]));
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.setAttribute('download', fileName || 'workloadInventoryReport.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  };

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

    const orderByColumn = index ? this.state.columns[index - 1].key : undefined;
    const orderDirection = direction ? direction : undefined;

    const mappedFilterValue = this.prepareFiltersToBeSended(filterValue);
    fetchReportWorkloadInventory(
      reportId,
      page,
      perPage,
      orderByColumn,
      orderDirection,
      mappedFilterValue
    ).then(() => {
      this.filtersInRowsAndCells();
    });
  };

  public filtersInRowsAndCells = () => {
    const items: ReportWorkloadInventory[] = this.props.reportWorkloadInventory.items
      ? Object.values(this.props.reportWorkloadInventory.items)
      : [];

    let rows: any[][] = [];
    if (items.length > 0) {
      rows = items.reduce((a: any[], b: ReportWorkloadInventory, index: number) => {
        const workloads =
          b.workloads && b.workloads.length > 0 ? b.workloads.join(', ') : 'Not identified';

        a.push(
          {
            isOpen: false,
            cells: [
              {
                title: b.provider,
              },
              {
                title: b.datacenter,
              },
              {
                title: b.cluster,
              },
              {
                title: b.vmName,
              },
              {
                title: workloads,
              },
              {
                title: b.osName,
              },
              {
                title: b.complexity,
              },
              {
                title: (
                  <span>
                    <i>
                      <FlagIcon />
                    </i>
                    &nbsp;{b.flagsIMS.length}
                  </span>
                ),
              },
            ],
          },
          {
            parent: index * 2,
            fullWidth: false,
            cells: [
              {
                title: <WorkloadInventoryDetails reportWorkloadInventory={b} />,
              },
            ],
          }
        );
        return a;
      }, []);
    }

    this.setState({ rows });
  };

  /**
   * Allways will reset the page to 1
   */
  public onSort = (event: any, index: number, direction: any) => {
    const page = 1;

    const { reportId } = this.props;
    const { perPage, filterValue } = this.state;

    const column = index ? this.state.columns[index - 1].key : undefined;
    const orderDirection = direction ? direction : undefined;

    const mappedFilterValue = this.prepareFiltersToBeSended(filterValue);
    this.props
      .fetchReportWorkloadInventory(
        reportId,
        page,
        perPage,
        column,
        orderDirection,
        mappedFilterValue
      )
      .then(() => {
        this.setState({
          page,
          sortBy: { index, direction },
        });
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
    const page = 1;

    this.setState({ page, perPage });
    this.refreshData(page, perPage);
  };

  public onRowCollapse = (_event: any, rowKey: number, isOpen: boolean) => {
    const { rows } = this.state;

    rows[rowKey].isOpen = isOpen;
    this.setState({
      rows,
    });
  };

  public renderPagination = () => {
    const { page, perPage } = this.state;
    const { total } = this.props.reportWorkloadInventory;

    return (
      <Pagination
        itemCount={total}
        perPage={perPage}
        page={page}
        onSetPage={this.onSetPage}
        onPageInput={this.onPageInput}
        onPerPageSelect={this.onPerPageSelect}
      />
    );
  };

  public renderResultsTable = () => {
    const { rows, columns, sortBy } = this.state;

    return (
      <Table
        aria-label="Workload inventory"
        onCollapse={this.onRowCollapse}
        rows={rows}
        cells={columns}
        sortBy={sortBy}
        onSort={this.onSort}
        className="table-vertical-align-middle"
      >
        <TableHeader />
        <TableBody />
        <tfoot>
          <tr>
            <td colSpan={10}>{this.renderPagination()}</td>
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
            <EmptyState variant={EmptyStateVariant.full}>
              <EmptyStateIcon icon={SearchIcon} />
              <Title headingLevel="h5" size="lg">
                No results found
              </Title>
              <EmptyStateBody>No results match the search criteria</EmptyStateBody>
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
          const onDropdownItemClick = (event) => {
            this.onFilterTypeSelect(event, element.name, element.value);
          };

          return (
            <DropdownItem key={index} onClick={onDropdownItemClick}>
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
        value: filterValue,
      },
      filterDropDownOpen: false,
      // filterValue: filterType === this.state.filterType ? this.state.filterValue : ''
    });
  };

  public renderFilterInput = () => {
    const { filterType } = this.state;
    const { reportWorkloadInventoryAvailableFilters } = this.props;
    if (!reportWorkloadInventoryAvailableFilters) {
      return;
    }

    switch (filterType.value) {
      case FilterTypeKeyEnum.PROVIDER:
        return this.renderSecondaryFilterDropdown(
          filterType,
          reportWorkloadInventoryAvailableFilters.providers
        );
      case FilterTypeKeyEnum.DATACENTER:
        return this.renderSecondaryFilterDropdown(
          filterType,
          reportWorkloadInventoryAvailableFilters.datacenters
        );
      case FilterTypeKeyEnum.CLUSTER:
        return this.renderSecondaryFilterDropdown(
          filterType,
          reportWorkloadInventoryAvailableFilters.clusters
        );
      case FilterTypeKeyEnum.WORKLOAD:
        return this.renderSecondaryFilterDropdown(
          filterType,
          reportWorkloadInventoryAvailableFilters.workloads
        );
      case FilterTypeKeyEnum.EFFORT:
        return this.renderSecondaryFilterDropdown(
          filterType,
          reportWorkloadInventoryAvailableFilters.complexities
        );
      case FilterTypeKeyEnum.RECOMMENDED_TARGETS_IMS:
        return this.renderSecondaryFilterDropdown(
          filterType,
          reportWorkloadInventoryAvailableFilters.recommendedTargetsIMS
        );
      case FilterTypeKeyEnum.FLAGS_IMS:
        return this.renderSecondaryFilterDropdown(
          filterType,
          reportWorkloadInventoryAvailableFilters.flagsIMS
        );
      case FilterTypeKeyEnum.VM_NAME:
        return this.renderSecondaryFilterInputText(filterType);
      case FilterTypeKeyEnum.OS_NAME:
        return this.renderSecondaryFilterDropdown(
          filterType,
          reportWorkloadInventoryAvailableFilters.osNames
        );
      default:
        return (
          <TextInput
            type="text"
            aria-label="filter text input"
            readOnly={true}
            placeholder="Filter by..."
            value=""
          />
        );
    }
  };

  public onSecondaryFilterDropdownToggle = (isExpanded: boolean) => {
    this.setState({
      secondaryFilterDropDownOpen: isExpanded,
    });
  };

  public getMapValue = (
    key: FilterTypeKeyEnum,
    map: Map<FilterTypeKeyEnum, string[]>
  ): string[] => {
    if (!map.has(key)) {
      map.set(key, []);
    }
    return map.get(key) || [];
  };

  public prepareFiltersToBeSended = (filterValue: Map<FilterTypeKeyEnum, string[]>) => {
    const mappedFilterValue: Map<string, string[]> = new Map();
    filterValue.forEach((value: string[], key: FilterTypeKeyEnum) => {
      let keyFilter: string;
      switch (key) {
        case FilterTypeKeyEnum.PROVIDER:
          keyFilter = filtersConfig.provider.key;
          break;
        case FilterTypeKeyEnum.DATACENTER:
          keyFilter = filtersConfig.datacenter.key;
          break;
        case FilterTypeKeyEnum.CLUSTER:
          keyFilter = filtersConfig.cluster.key;
          break;
        case FilterTypeKeyEnum.WORKLOAD:
          keyFilter = filtersConfig.workload.key;
          break;
        case FilterTypeKeyEnum.EFFORT:
          keyFilter = filtersConfig.effort.key;
          break;
        case FilterTypeKeyEnum.RECOMMENDED_TARGETS_IMS:
          keyFilter = filtersConfig.recommendedTargetIMS.key;
          break;
        case FilterTypeKeyEnum.FLAGS_IMS:
          keyFilter = filtersConfig.flagIMS.key;
          break;
        case FilterTypeKeyEnum.VM_NAME:
          keyFilter = filtersConfig.vmName.key;
          break;
        case FilterTypeKeyEnum.OS_NAME:
          keyFilter = filtersConfig.osName.key;
          break;
        default:
          keyFilter = key;
      }
      mappedFilterValue.set(keyFilter, value);
    });
    return mappedFilterValue;
  };

  public applyFilterAndSearch = (filterValue: Map<FilterTypeKeyEnum, string[]>) => {
    this.setState({
      filterValue,
    });

    //
    const page = 1;
    const { reportId } = this.props;
    const { perPage } = this.state;
    const { direction, index } = this.state.sortBy;

    const column = index ? this.state.columns[index - 1].key : undefined;
    const orderDirection = direction ? direction : undefined;

    const mappedFilterValue = this.prepareFiltersToBeSended(filterValue);
    this.props
      .fetchReportWorkloadInventory(
        reportId,
        page,
        perPage,
        column,
        orderDirection,
        mappedFilterValue
      )
      .then(() => {
        this.setState({
          page,
        });
        this.filtersInRowsAndCells();
      });
  };

  public onSecondaryFilterDropdownSelect = (
    selection: string,
    filterType: { name: string; value: FilterTypeKeyEnum }
  ) => {
    const { filterValue } = this.state;

    const currentFilterSelections: string[] = this.getMapValue(filterType.value, filterValue);

    // determine newFilterValue
    const newFilterValue: Map<FilterTypeKeyEnum, string[]> = new Map(filterValue);

    const previousElement: string | undefined = currentFilterSelections.find(
      (elem: string) => elem === selection
    );
    if (previousElement) {
      newFilterValue.set(
        filterType.value,
        currentFilterSelections.filter((elem: string) => elem !== selection)
      );
    } else {
      newFilterValue.set(filterType.value, [...currentFilterSelections, selection]);
    }

    this.applyFilterAndSearch(newFilterValue);
  };

  public renderSecondaryFilterDropdown = (
    filterType: { name: string; value: FilterTypeKeyEnum },
    options: string[]
  ) => {
    const { secondaryFilterDropDownOpen, filterValue } = this.state;
    const selections: string[] = this.getMapValue(filterType.value, filterValue);

    if (options.length === 0) {
      const onEmptySelect = () => {
        return;
      };
      return (
        <Select
          variant={SelectVariant.single}
          aria-label={`Select ${filterType.name} Input`}
          onToggle={this.onSecondaryFilterDropdownToggle}
          onSelect={onEmptySelect}
          isOpen={secondaryFilterDropDownOpen}
          placeholderText={`Filter by ${filterType.name}`}
          aria-labelledby={filterType.name}
        >
          {[<SelectOption key="EmptyKey" value="No values available" />]}
        </Select>
      );
    }

    const onSelect = (event: React.MouseEvent | React.ChangeEvent, value: any) => {
      this.onSecondaryFilterDropdownSelect(value, filterType);
    };
    return (
      <Select
        variant={SelectVariant.checkbox}
        aria-label={`Select ${filterType.name} Input`}
        onToggle={this.onSecondaryFilterDropdownToggle}
        onSelect={onSelect}
        isOpen={secondaryFilterDropDownOpen}
        selections={selections}
        placeholderText={`Filter by ${filterType.name}`}
        aria-labelledby={filterType.name}
      >
        {options.map((val, index) => {
          return <SelectOption key={index} value={val} />;
        })}
      </Select>
    );
  };

  public renderSecondaryFilterInputText = (filterType: {
    name: string;
    value: FilterTypeKeyEnum;
  }) => {
    const { filterValue } = this.state;

    const onSubmit = (values: { filterText: string }, { resetForm }) => {
      const selection = values.filterText;
      const currentFilterSelections: string[] = this.getMapValue(filterType.value, filterValue);

      // determine newFilterValue
      const newFilterValue: Map<FilterTypeKeyEnum, string[]> = new Map(filterValue);

      const previousElement: string | undefined = currentFilterSelections.find(
        (elem: string) => elem === selection
      );
      if (!previousElement) {
        newFilterValue.set(filterType.value, [...currentFilterSelections, selection]);

        this.applyFilterAndSearch(newFilterValue);
      }

      resetForm();
    };

    return (
      <Formik initialValues={{ filterText: '' }} onSubmit={onSubmit}>
        {({ values, handleChange, handleBlur, handleSubmit }) => {
          const customHandleChange = (_value: any, event: any) => {
            handleChange(event);
          };

          return (
            <Form onSubmit={handleSubmit}>
              <TextInput
                type="search"
                name="filterText"
                aria-label="search text input"
                onChange={customHandleChange}
                onBlur={handleBlur}
                value={values.filterText}
                placeholder={`Filter by ${filterType.name}...`}
              />
              <Button type="submit" className="pf-u-hidden">
                Submit
              </Button>
            </Form>
          );
        }}
      </Formik>
    );
  };

  public deleteChipItem = (filterTypeKey: FilterTypeKeyEnum, element: string) => {
    const currentFilterValue = this.state.filterValue;
    const currentChipValues = this.getMapValue(filterTypeKey, this.state.filterValue);

    const newFilterValue = new Map(currentFilterValue);
    const newChipValues = currentChipValues.filter((e) => e !== element);
    newFilterValue.set(filterTypeKey, newChipValues);

    this.applyFilterAndSearch(newFilterValue);
  };

  public clearChips = () => {
    this.setState({
      filterType: {
        name: 'Filter',
        value: FilterTypeKeyEnum.NONE,
      },
    });
    this.applyFilterAndSearch(new Map());
  };

  public reportFilterChips = () => {
    const { filterValue } = this.state;

    const filterValueArray: Array<{ key: FilterTypeKeyEnum; value: string[] }> = [];
    filterValue.forEach((value: string[], key: FilterTypeKeyEnum) => {
      if (value.length > 0) {
        filterValueArray.push({
          key,
          value,
        });
      }
    });

    return (
      <React.Fragment>
        <ChipGroup>
          {filterValueArray.map((group) => {
            return (
              <ChipGroup key={group.key} categoryName={chipLabelsMap.get(group.key)}>
                {group.value.map((chip: string) => {
                  const onDeleteChipItem = () => {
                    this.deleteChipItem(group.key, chip);
                  };

                  return (
                    <Chip key={chip} onClick={onDeleteChipItem}>
                      {chip}
                    </Chip>
                  );
                })}
              </ChipGroup>
            );
          })}
        </ChipGroup>
        {filterValueArray.length > 0 && (
          <React.Fragment>
            &nbsp;
            <Button variant={ButtonVariant.link} onClick={this.clearChips}>
              Clear filters
            </Button>
          </React.Fragment>
        )}
      </React.Fragment>
    );
  };

  public renderWorkloadInventory = () => {
    const { reportWorkloadInventory } = this.props;

    return (
      <React.Fragment>
        {reportWorkloadInventory.total > 0 ? this.renderResultsTable() : this.renderNoResults()}
      </React.Fragment>
    );
  };

  public renderWorkloadInventorySkeleton = () => {
    return (
      <React.Fragment>
        <Stack hasGutter={true}>
          <StackItem isFilled={false}>
            <SkeletonTable colSize={9} rowSize={10} />
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
        <EmptyState variant={EmptyStateVariant.large}>
          <EmptyStateIcon icon={ErrorCircleOIcon} />
          <Title headingLevel="h5" size="lg">
            Error
          </Title>
          <EmptyStateBody>Something unexpected happend, please try again!</EmptyStateBody>
          <Button variant="primary" onClick={onRetryClick}>
            Retry
          </Button>
        </EmptyState>
      </Bullseye>
    );
  };

  public render() {
    const {
      reportWorkloadInventoryFetchStatus,
      reportWorkloadInventoryFilteredCSVFetchStatus,
    } = this.props;

    if (reportWorkloadInventoryFetchStatus.error) {
      return this.renderFetchError();
    }

    const isFetchComplete: boolean = reportWorkloadInventoryFetchStatus.status === 'complete';

    return (
      <React.Fragment>
        <TableToolbar
          className="pf-u-justify-content-space-between"
          style={{ display: 'flex', marginRight: 0, marginBottom: 0 }}
        >
          <ToolbarGroup>
            <ToolbarItem>{this.renderFilterTypeDropdown()}</ToolbarItem>
            <ToolbarItem className="pf-u-mr-md">{this.renderFilterInput()}</ToolbarItem>
            <ToolbarItem className="pf-u-mr-md">
              <Button
                variant={'primary'}
                onClick={this.handleDownloadFilteredCSV}
                isDisabled={reportWorkloadInventoryFilteredCSVFetchStatus.status === 'inProgress'}
              >
                {reportWorkloadInventoryFilteredCSVFetchStatus.status === 'inProgress'
                  ? 'Exporting CSV'
                  : 'Export as CSV'}
              </Button>
            </ToolbarItem>
          </ToolbarGroup>
          <ToolbarGroup>
            <ToolbarItem>{this.renderPagination()}</ToolbarItem>
          </ToolbarGroup>
        </TableToolbar>
        <TableToolbar
          className="pf-u-justify-content-space-between"
          style={{ display: 'flex', marginRight: 0, marginBottom: 0, marginTop: 0 }}
        >
          <ToolbarGroup>
            <ToolbarItem>{this.reportFilterChips()}</ToolbarItem>
          </ToolbarGroup>
        </TableToolbar>
        {isFetchComplete ? this.renderWorkloadInventory() : this.renderWorkloadInventorySkeleton()}
      </React.Fragment>
    );
  }
}

export default WorkloadInventory;
