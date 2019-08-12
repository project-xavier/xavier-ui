import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import WorkloadMigrationSummary from './WorkloadSummary';
import { GlobalState } from 'src/models/state';
import * as reportActions from '../../../actions/ReportActions';

const mapStateToProps = (state: GlobalState)  => {
    const {
        reportWorkloadSummary,
        reportWorkloadSummaryFetchStatus
    } = state.reportState;
    return {
        reportWorkloadSummary,
        reportWorkloadSummaryFetchStatus
    };
};

const mapDispatchToProps = {
    fetchReportWorkloadSummary: reportActions.fetchReportWorkloadSummary
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(WorkloadMigrationSummary)
);
