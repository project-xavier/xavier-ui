import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import InitialSavingsEstimation from './InitialSavingsEstimation';
import { GlobalState } from '../../../models/state';
import * as reportActions from '../../../actions/ReportActions';

const mapStateToProps = (state: GlobalState) => {
    const {
        report,
        reportInitialSavingEstimation,
        reportInitialSavingEstimationFetchStatus
    } = state.reportState;
    return {
        report,
        reportInitialSavingEstimation,
        reportInitialSavingEstimationFetchStatus
    };
};

const mapDispatchToProps = {
    fetchReportInitialSavingEstimation: reportActions.fetchReportInitialSavingEstimation
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(InitialSavingsEstimation)
);
