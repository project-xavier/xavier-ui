import { connect } from 'react-redux';
import WorkloadInventory from './WorkloadInventory';
import { GlobalState } from '../../../models/state';
import * as reportActions from '../../../actions/ReportActions';

const mapStateToProps = (state: GlobalState) => {
    const {
        reportWorkloadInventory,
        reportWorkloadInventoryFetchStatus,
        reportWorkloadInventoryCSVFetchStatus,
        reportWorkloadInventoryAvailableFilters,
        reportWorkloadInventoryAvailableFiltersFetchStatus
    } = state.reportState;
    return {
        reportWorkloadInventory,
        reportWorkloadInventoryFetchStatus,
        reportWorkloadInventoryCSVFetchStatus,
        reportWorkloadInventoryAvailableFilters,
        reportWorkloadInventoryAvailableFiltersFetchStatus
    };
};

const mapDispatchToProps = {
    fetchReportWorkloadInventory: reportActions.fetchReportWorkloadInventory,
    fetchReportWorkloadInventoryCSV: reportActions.fetchReportWorkloadInventoryCSV,
    fetchReportWorkloadInventoryAvailableFilters: reportActions.fetchReportWorkloadInventoryAvailableFilters
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WorkloadInventory);
