import { connect } from 'react-redux';
import InitialSavingsEstimation from './InitialSavingsEstimation';
import { GlobalState } from '../../../models/state';
import * as reportActions from '../../../actions/ReportActions';

const mapStateToProps = (state: GlobalState) => {
  const {
    report,
    reportInitialSavingEstimation,
    reportInitialSavingEstimationFetchStatus,
  } = state.reportState;
  return {
    report,
    reportInitialSavingEstimation,
    reportInitialSavingEstimationFetchStatus,
  };
};

const mapDispatchToProps = {
  fetchReportInitialSavingEstimation: reportActions.fetchReportInitialSavingEstimation,
};

export default connect(mapStateToProps, mapDispatchToProps)(InitialSavingsEstimation);
