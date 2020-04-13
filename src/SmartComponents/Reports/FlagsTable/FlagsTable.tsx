import React from 'react';
import {
    Pagination,
    Bullseye,
    EmptyState,
    EmptyStateIcon,
    EmptyStateVariant,
    Title,
    EmptyStateBody
} from '@patternfly/react-core';
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
import { SearchIcon } from '@patternfly/react-icons';
import {
    SkeletonTable
} from '@redhat-cloud-services/frontend-components';
import debounce from 'lodash/debounce';
import { FlagModel, FlagAssessmentModel } from '../../../models';
import { ObjectFetchStatus } from '../../../models/state';
import { formatNumber } from '../../../Utilities/formatValue';
import { isNullOrUndefined } from '../../../Utilities/formUtils';
import { FetchErrorEmptyState } from '../../../PresentationalComponents/FetchErrorEmptyState';
import './FlagsTable.scss';

interface StateToProps {
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

export interface FlagsTableProps extends StateToProps, DispatchToProps {
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

export class FlagsTable extends React.Component<FlagsTableProps, State> {

    public changePage = debounce(() => {
        this.refreshData();
    }, 800);

    constructor(props: FlagsTableProps) {
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
                    transforms: []
                },
                {
                    title: 'In VMs',
                    key: 'vms',
                    props: { },
                    transforms: [ sortable ]
                }
            ],
            rows: [],
            sortBy: { }
        };
    }

    public componentDidMount() {
        const { allFlags, fetchAllFlagAssessments } = this.props;
        
        // Fetch Flag-Assessment column
        // Fetch all Flags just once and the reuse the value from redux
        if (!allFlags || allFlags.length === 0) {
            fetchAllFlagAssessments();
        }

        this.refreshData();
    }

    public componentDidUpdate(prevProps: FlagsTableProps) {
        if (prevProps.allFlags !== this.props.allFlags) {
            this.filtersInRowsAndCells();
        }
    }

    public refreshData = async (
        page: number = this.state.page,
        perPage: number = this.state.perPage,
        { direction, index } = this.state.sortBy
    ) => {
        const { reportId, fetchReportFlags } = this.props;

        const column = index ? this.state.columns[index].key : undefined;
        const orderDirection = direction ? direction : undefined;

        await fetchReportFlags(reportId, page, perPage, column, orderDirection);
        fetchReportFlags(reportId, page, perPage, column, orderDirection);
        this.filtersInRowsAndCells();
    }

    public filtersInRowsAndCells = () => {
        const { allFlags, reportFlags } = this.props;
        const items: FlagModel[] = reportFlags.items ? Object.values(reportFlags.items) : [];

        let rows: IRow[] = [];
        if (items.length > 0) {
            rows = items.map((row: FlagModel) => {
                let flagAssessmentModel = allFlags.find((element: FlagAssessmentModel) => {
                    return (element.flag === row.flag && element.osName === row.osName)
                });
                
                if (!flagAssessmentModel) {
                    flagAssessmentModel = allFlags.find((element: FlagAssessmentModel) => {
                        return (element.flag === row.flag && element.osName === '')
                    }); 
                }

                return {
                    cells: [
                        flagAssessmentModel ? flagAssessmentModel.flagLabel : row.flag,
                        flagAssessmentModel ? flagAssessmentModel.assessment : '',
                        row.osName ? row.osName : '',
                        !isNullOrUndefined(row.clusters) ? formatNumber(row.clusters, 0) : '',
                        !isNullOrUndefined(row.vms) ? formatNumber(row.vms, 0) : ''
                    ]
                };
            });
        }

        this.setState({ rows });
    }

    /**
     * Allways will reset the page to 1
     */
    public onSort = async (event: any, index: number, direction: any) => {
        const page = 1;
        const { reportId } = this.props;
        const { perPage } = this.state;

        const column = index ? this.state.columns[index].key : undefined;
        const orderDirection = direction ? direction : undefined;
        
        await this.props.fetchReportFlags(reportId, page, perPage, column, orderDirection);
        this.setState({
            page,
            sortBy: { index, direction }
        }, () => {
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
                <Bullseye>
                    <EmptyState variant={ EmptyStateVariant.full }>
                        <EmptyStateIcon icon={ SearchIcon } />
                        <Title headingLevel="h5" size="lg">No results found</Title>
                        <EmptyStateBody>
                            No results match the search criteria
                        </EmptyStateBody>
                    </EmptyState>
                </Bullseye>
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
            <SkeletonTable colSize={ 5 } rowSize={ 5 }/>
        );
    };

    public renderFetchError = () => {
        return (
            <FetchErrorEmptyState onRetry={this.refreshData} />
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
                { isFetchComplete ? this.renderTable() : this.renderTableSkeleton() }
            </React.Fragment>
        );
    }

}
