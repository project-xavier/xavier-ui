import { connect } from 'react-redux';
import WorkloadInventory from './WorkloadInventory';
import { GlobalState } from '../../../models/state';
import * as reportActions from '../../../actions/ReportActions';

const mapStateToProps = (state: GlobalState) => {
  const {
    reportWorkloadInventory,
    reportWorkloadInventoryFetchStatus,
    reportWorkloadInventoryFilteredCSVFetchStatus,
    reportWorkloadInventoryAvailableFilters,
    reportWorkloadInventoryAvailableFiltersFetchStatus,
  } = state.reportState;
  return {
    reportWorkloadInventory,
    reportWorkloadInventoryFetchStatus,
    reportWorkloadInventoryFilteredCSVFetchStatus,
    reportWorkloadInventoryAvailableFilters,
    reportWorkloadInventoryAvailableFiltersFetchStatus,
  };
};

const mapDispatchToProps = {
  fetchReportWorkloadInventory: reportActions.fetchReportWorkloadInventory,
  fetchReportWorkloadInventoryFilteredCSV: reportActions.fetchReportWorkloadInventoryFilteredCSV,
  fetchReportWorkloadInventoryAvailableFilters:
    reportActions.fetchReportWorkloadInventoryAvailableFilters,
};

export default connect(mapStateToProps, mapDispatchToProps)(WorkloadInventory);
