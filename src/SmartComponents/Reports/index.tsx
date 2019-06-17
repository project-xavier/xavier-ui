import React, { createRef } from 'react';
import { bindActionCreators } from 'redux';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
    TableToolbar
} from '@redhat-cloud-services/frontend-components';
import {
    Button,
    ToolbarGroup,
    ToolbarItem,
    Bullseye,
    EmptyStateIcon,
    EmptyStateBody,
    EmptyStateVariant,
    EmptyState,
    Title
} from '@patternfly/react-core';
import {
    Table,
    TableHeader,
    TableBody,
    TableGridBreakpoint,
    IRow,
    ICell
} from '@patternfly/react-table';
import ReportListPage from '../../PresentationalComponents/ReportListPage/ReportListPage';
import LoadingState from '../../PresentationalComponents/LoadingState/LoadingState';
import  * as reportActions from '../../actions/ReportActions';
import * as uploadActions from '../../actions/UploadActions';
import { Report } from '../../models';
import { GlobalState } from '../../models/state';
import { RouterGlobalProps } from '../../models/router';
import './ReportList.scss';
import Dropzone from 'react-dropzone';
import { CubesIcon } from '@patternfly/react-icons';

interface StateToProps {
    total: number;
    error: string | null;
    loading: boolean;
    reports: Report[];

    file: File | null
}

interface DispatchToProps {
    fetchReports: () => any;
    selectUploadFile: (file: File) => any;
}

interface Props extends StateToProps, DispatchToProps, RouterGlobalProps {
};

interface State {
    columns: Array<ICell | String>;
    rows: Array<IRow | Array<String>>
};

export class Reports extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            columns: [
                { title: 'Report Id', props: {}},
                { title: 'Customer Id', props: {}},
                {
                    title: 'File name',
                    props: {
                        className: 'pf-u-text-align-center'
                    }
                },
                ''
            ],
            rows: []
        };
        this.onFileSelected = this.onFileSelected.bind(this);
    }

    componentDidMount(): void {
        this.refreshData();
    }

    refreshData(): void {
        this.props.fetchReports().then(() =>
            this.filtersInRowsAndCells()
        );
    }

    filtersInRowsAndCells(): void {
        const reports: Report[] = Object.values(this.props.reports);

        let rows: any[][] = [];
        if (reports.length > 0) {
            rows = reports.map(({ id, customerId, fileName }) => (
                [
                    { title: id },
                    { title: customerId },
                    { title: fileName },
                    {
                        title: <Button variant='primary' component={ Link } to={ `/reports/${id}` }>View</Button>
                    }
                ]
            ));
        }

        this.setState({ rows });
    }

    onFileSelected(files: File[]): void {
        this.props.selectUploadFile(files[0]);
        this.props.history.push('/reports/upload');
    };

    noResults() {
        const dropzoneRef: any = createRef();
        const openFileDialog = () => {
            if (dropzoneRef.current) {
                dropzoneRef.current.open();
            }
        };

        return (
            <Bullseye>
                <EmptyState variant={ EmptyStateVariant.full }>
                    <p>
                        <EmptyStateIcon icon={ CubesIcon } />
                    </p>
                    <Title size="lg">Let Red Hat Migration Analytics suggest ways to optimize your environment</Title>
                    <EmptyStateBody>
                                See how you can optimize your virtual environment by
                                uploading a Red Hat CloudForms generated inventory file
                                and then letting Red Hat Migration Analytics create
                                reports showing how you can save money and optimize
                                workloads - whether by migrating virtual machines or
                                migrating application to RHEL.
                    </EmptyStateBody>
                    <Dropzone
                        onDrop={ this.onFileSelected }
                        ref={ dropzoneRef }
                        noClick noKeyboard
                        multiple={ false }
                        accept={ [ 'application/zip', 'application/json' ] }
                    >
                        { ({ getRootProps, getInputProps }) => {
                            return (
                                <div { ...getRootProps({ className: 'dropzone' }) }>
                                    <input { ...getInputProps() } />
                                    <Button
                                        type="button"
                                        variant="primary"
                                        onClick={ openFileDialog }>
                                        Upload
                                    </Button>
                                </div>
                            );
                        } }
                    </Dropzone>
                </EmptyState>
            </Bullseye>
        );
    }

    resultsTable() {
        const { rows, columns } = this.state;

        return (
            <React.Fragment>
                { <TableToolbar>
                    <ToolbarGroup>
                        <ToolbarItem>
                            <Button component={ Link } to={ '/upload' }>Upload</Button>
                        </ToolbarItem>
                    </ToolbarGroup>
                </TableToolbar> }
                <Table aria-label='Reports list'
                    rows={ rows }
                    cells={ columns }
                    gridBreakPoint={ TableGridBreakpoint.gridMd } >
                    <TableHeader />
                    <TableBody />
                </Table>
            </React.Fragment>
        );
    }

    render() {
        const { loading, total } = this.props;

        return (
            <ReportListPage
                title='Reports'
                showBreadcrumb={ false }>
                <LoadingState
                    loading={ loading }
                    placeholder={ '' } >
                    { total > 0 ? this.resultsTable() : this.noResults() }
                </LoadingState>
            </ReportListPage>
        );
    }
}

const mapStateToProps = (state: GlobalState)  => {
    let {
        reportState: {
            reports,
            loading,
            error,
            total
        },
        uploadState: {
            file
        }
    } = state;
    return {
        reports,
        loading,
        error,
        total,
        file
    };
};

const mapDispatchToProps = (dispatch: any) =>
    bindActionCreators({
        fetchReports: reportActions.fetchReports,
        selectUploadFile: uploadActions.selectUploadFile
    }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Reports));
