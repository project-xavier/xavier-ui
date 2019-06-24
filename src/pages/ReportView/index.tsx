import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Redirect, withRouter, Link } from 'react-router-dom';
import {
    Spinner
} from '@redhat-cloud-services/frontend-components';
import { fetchReport } from '../../actions/ReportActions';
import { RouterGlobalProps } from '../../models/router';
import { Report } from '../../models';
import { GlobalState } from '../../models/state';
import { ReportViewPage } from '../../PresentationalComponents/ReportViewPage';
import LoadingState from '../../PresentationalComponents/LoadingState/LoadingState';
import { Card, CardBody, Button } from '@patternfly/react-core';

interface StateToProps {
    error: string | null;
    report: Report | null;
    loading: boolean;
}

interface DispatchToProps {
    fetchReport: (reportId: number) => void;
}

interface Props extends StateToProps, DispatchToProps, RouterGlobalProps {
};

interface State {
    reportId: number;
};

export class ReportView extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            reportId: props.match.params.reportId
        };
    }

    componentDidMount(): void {
        const id: number = this.state.reportId;
        if (id) {
            this.props.fetchReport(id);
        }
    }

    render() {
        const { report, error } = this.props;
        const { reportId } = this.state;

        if (!reportId || error) {
            return <Redirect to={ `/reports` } />;
        }

        let action = !this.props.loading && report ? report.id : '';

        return (
            <ReportViewPage
                title={ `Report ${action}` }
                showBreadcrumb={ false }>
                <LoadingState
                    loading={ this.props.loading }
                    placeholder={ <Spinner centered/> }>
                    <Card>
                        <CardBody>
                            {
                                report ? (<div className="pf-c-content">
                                    <dl>
                                        <dt>Customer id:</dt>
                                        <dd>{ report.customerId }</dd>
                                        <dt>File name:</dt>
                                        <dd>{ report.fileName }</dd>
                                        <dt>Number of hosts:</dt>
                                        <dd>{ report.numberOfHosts.toLocaleString() }</dd>
                                        <dt>Total disk space:</dt>
                                        <dd>{ report.totalDiskSpace.toLocaleString() } B</dd>
                                        <dt>Total price:</dt>
                                        <dd>{ report.totalPrice }</dd>
                                        <dt>Creation date:</dt>
                                        <dd>{ new Date(report.creationDate).toUTCString() }</dd>
                                    </dl>
                                    <Button variant="secondary" component= { Link } to="/reports">Back</Button>
                                </div>
                                ) : (
                                    ''
                                )
                            }
                        </CardBody>
                    </Card>
                </LoadingState>
            </ReportViewPage>
        );
    }
}

const mapStateToProps = (state: GlobalState)  => {
    let { report, loading, error } = state.reportState;
    return {
        report,
        loading,
        error
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        fetchReport
    }, dispatch);
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ReportView));
