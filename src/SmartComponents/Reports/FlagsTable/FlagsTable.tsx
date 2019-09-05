import React from 'react';
import { RouterGlobalProps } from '../../../models/router';
import {
    TableToolbar,
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
    Card,
    CardBody
} from '@patternfly/react-core';
import { ErrorCircleOIcon, SearchIcon } from '@patternfly/react-icons';
import { FlagModel, FlagAssessmentModel, FlagAssessmentOSModel } from '../../../models';
import { ObjectFetchStatus } from '../../../models/state';
import debounce from 'lodash/debounce';
import { formatNumber } from '../../../Utilities/formatValue';
import './FlagsTable.scss';
import { isNullOrUndefined } from '../../../Utilities/formUtils';

interface StateToProps extends RouterGlobalProps {
    reportFlags: {
        total: number;
        items: FlagModel[]
    };
    reportFlagsFetchStatus: ObjectFetchStatus;
    allFlags: FlagAssessmentModel[],
    allFlagsFetchStatus: ObjectFetchStatus;
}

interface DispatchToProps {
    fetchReportFlags: (
        reportId: number,
        page: number,
        perPage: number,
        orderBy: string | undefined,
        orderDirection: 'asc' | 'desc' | undefined
    ) => any;
    fetchAllFlagAssessments: () => any;
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

class FlagsTable extends React.Component<Props, State> {

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
                    title: 'Flags',
                    key: 'flag',
                    props: { },
                    transforms: [ sortable ]
                },
                {
                    title: 'Assessment',
                    key: 'assessment',
                    props: { },
                    transforms: [ ]
                },
                {
                    title: 'OS',
                    key: 'osName',
                    props: { },
                    transforms: [ cellWidth('10'), sortable ]
                },
                {
                    title: 'In Clusters',
                    key: 'clusters',
                    props: { },
                    transforms: [ cellWidth('10') ]
                },
                {
                    title: 'In VMs',
                    key: 'vms',
                    props: { },
                    transforms: [ cellWidth('10'), sortable ]
                }
            ],
            rows: [],
            sortBy: { }
        };
    }

    public componentDidMount() {
        // Fetch Flag-Assessment column
        const { allFlags, fetchAllFlagAssessments } = this.props;
        if (allFlags && allFlags.length === 0) {
            fetchAllFlagAssessments();
        }

        this.refreshData();
    }

    public componentDidUpdate(prevProps: Props) {
        if (prevProps.allFlags !== this.props.allFlags) {
            this.filtersInRowsAndCells();
        }
    }

    public refreshData = (
        page: number = this.state.page,
        perPage: number = this.state.perPage,
        { direction, index } = this.state.sortBy
    ) => {
        const { reportId, fetchReportFlags } = this.props;

        const column = index ? this.state.columns[index].key : undefined;
        const orderDirection = direction ? direction : undefined;
        fetchReportFlags(reportId, page, perPage, column, orderDirection).then(() => {
            this.filtersInRowsAndCells();
        });
    }

    public filtersInRowsAndCells = () => {
        const { allFlags, reportFlags } = this.props;
        const items: FlagModel[] = reportFlags.items ? Object.values(reportFlags.items) : [];

        let rows: any[][] = [];
        if (items.length > 0) {
            const flagAssessmentMap = new Map(allFlags.map(element => [element.flag, element]));

            rows = items.map((row: FlagModel) => {
                const flagAssessmentModel: FlagAssessmentModel | undefined = flagAssessmentMap.get(row.flag);
                let flagAssessmentOSModel: FlagAssessmentOSModel | undefined;
                if (flagAssessmentModel) {
                    const flagAssessmentOSModels = flagAssessmentModel.flagAssessmentOSModels;
                    flagAssessmentOSModel = flagAssessmentOSModels.find(element => {
                        return (element.osName || '').toLowerCase() === row.osName.toLowerCase()
                    });
                    if (!flagAssessmentOSModel) {
                        flagAssessmentOSModel = flagAssessmentOSModels.find(element => {
                            return element.osName === undefined || element.osName === null || element.osName === '';
                        })
                    }
                }
                return [
                    flagAssessmentModel ? flagAssessmentModel.label : row.flag,
                    flagAssessmentOSModel ? flagAssessmentOSModel.assessment : '',
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
        this.props.fetchReportFlags(reportId, page, perPage, column, orderDirection).then(() => {
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
        const total = this.props.reportFlags.total;

        // If current page and perPage would request data beyond total, show last available page
        if (page * perPage > total) {
            page = Math.floor(total / perPage) + 1;
        }

        this.setState({ page, perPage });
        this.refreshData(page, perPage);
    };

    public renderPagination = () => {
        const { page, perPage } = this.state;
        const { total } = this.props.reportFlags;

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
                    <tr className="flags-table-footer">
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
        const { reportFlags } = this.props;

        return (
            <React.Fragment>
                { (reportFlags.total > 0 ? this.renderResultsTable() : this.renderNoResults()) }
            </React.Fragment>
        );
    };

    public renderTableSkeleton = () => {
        return (
            <React.Fragment>
                <SkeletonTable colSize={ 5 } rowSize={ 5 }/>
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
        const { reportFlagsFetchStatus } = this.props;

        if (reportFlagsFetchStatus.error) {
            return this.renderFetchError();
        }

        const isFetchComplete: boolean = reportFlagsFetchStatus.status === 'complete';

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

export default FlagsTable;
