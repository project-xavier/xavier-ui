import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import InitialSavingsEstimation from './InitialSavingsEstimation';
import { GlobalState } from '../../../models/state';
import * as reportActions from '../../../actions/ReportActions';

const mapStateToProps = (state: GlobalState)  => {
    let {
        report,
        reportInitialSavingEstimation
    } = state.reportState;
    return {
        report,
        reportInitialSavingEstimation
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        fetchReportInitialSavingEstimation: reportActions.fetchReportInitialSavingEstimation
    }, dispatch);
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(InitialSavingsEstimation)
);
