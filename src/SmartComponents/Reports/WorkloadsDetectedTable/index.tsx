import { connect } from 'react-redux';
import { WorkloadsDetectedTable } from './WorkloadsDetectedTable';
import { GlobalState } from '../../../models/state';
import * as reportActions from '../../../actions/ReportActions';

const mapStateToProps = (state: GlobalState) => {
  const { reportWorkloadsDetected, reportWorkloadsDetectedFetchStatus } = state.reportState;
  return {
    reportWorkloadsDetected,
    reportWorkloadsDetectedFetchStatus,
  };
};

const mapDispatchToProps = {
  fetchReportWorkloadsDetected: reportActions.fetchReportWorkloadsDetected,
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkloadsDetectedTable);
