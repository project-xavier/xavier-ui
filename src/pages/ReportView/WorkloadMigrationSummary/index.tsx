import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import WorkloadMigrationSummary from './WorkloadMigrationSummary';
import { GlobalState } from '../../../models/state';
import * as reportActions from '../../../actions/ReportActions';

const mapStateToProps = (state: GlobalState)  => {
    let {
        report,
        reportMigrationSummary
    } = state.reportState;
    return {
        report,
        reportMigrationSummary
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        fetchReportWorkloadMigrationSummary: reportActions.fetchReportWorkloadMigrationSummary
    }, dispatch);
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(WorkloadMigrationSummary)
);
