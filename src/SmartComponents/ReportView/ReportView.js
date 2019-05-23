import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link, Redirect, withRouter } from 'react-router-dom';
import {
    Card,
    CardBody,
    Button
} from '@patternfly/react-core';
import {
    Spinner
} from '@red-hat-insights/insights-frontend-components';
import { ReportListPage } from '../../PresentationalComponents/ReportListPage/ReportListPage';
import LoadingState from '../../PresentationalComponents/LoadingState/LoadingState';
import { fetchReport } from '../../actions/ReportActions';
import { formatValue } from '../../Utilities/formatValue';
import '@patternfly/patternfly/patternfly-addons.css';

class ReportView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            id: props.match.params.id,
            report: null
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData() {
        let id = this.props.match.params.reportId;
        if (id) {
            this.props.fetchReport(id);
        }
    }

    render() {
        const { report } = this.props;
        let action = this.props.match.params.reportId && report ? report.id : 'Unknown report';

        if (report && !this.props.match.params.reportId) {
            return <Redirect to={ `/reports/${ report.id }` } />;
        }

        return (
            <ReportListPage title={ `Report ${action}` } showBreadcrumb={ false }>
                <LoadingState
                    loading={ this.props.loading }
                    placeholder={ <Spinner centered/> }>
                    <Card>
                        <CardBody>
                            {
                                report ? <div className="pf-c-content">
                                    <dl>
                                        <dt>Customer ID:</dt>
                                        <dd>{ report.customerId }</dd>
                                        <dt>File name:</dt>
                                        <dd>{ report.fileName }</dd>
                                        <dt>Number of hosts:</dt>
                                        <dd>{ report.numberOfHosts.toLocaleString() }</dd>
                                        <dt>Total disk space:</dt>
                                        <dd>{ report.totalDiskSpace.toLocaleString() } B</dd>
                                        <dt>Total price:</dt>
                                        <dd>{ formatValue(report.totalPrice, 'usd') }</dd>
                                        <dt>Create date:</dt>
                                        <dd>{ new Date(report.creationDate).toString() }</dd>
                                    </dl>
                                    <Button variant="secondary" component={ Link } to="/reports">Back</Button>
                                </div>
                                    : ''
                            }
                        </CardBody>
                    </Card>
                </LoadingState>
            </ReportListPage>
        );
    }
}

ReportView.propTypes = {
    match: PropTypes.object,
    report: PropTypes.object,
    loading: PropTypes.bool,
    fetchReport: PropTypes.func.isRequired
};

const mapStateToProps = (state)  => {
    let { report, loading } = state.reports;

    return {
        report,
        loading
    };
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        fetchReport
    }, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ReportView));
