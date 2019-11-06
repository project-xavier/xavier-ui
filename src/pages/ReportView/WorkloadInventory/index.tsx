import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import WorkloadInventory from './WorkloadInventory';
import { GlobalState } from '../../../models/state';
import * as reportActions from '../../../actions/ReportActions';

const mapStateToProps = (state: GlobalState) => {
    const {
        reportWorkloadInventory,
        reportWorkloadInventoryFetchStatus,
        reportWorkloadInventoryAllCSVFetchStatus,
        reportWorkloadInventoryFilteredCSVFetchStatus,
        reportWorkloadInventoryAvailableFilters,
        reportWorkloadInventoryAvailableFiltersFetchStatus
    } = state.reportState;
    return {
        reportWorkloadInventory,
        reportWorkloadInventoryFetchStatus,
        reportWorkloadInventoryAllCSVFetchStatus,
        reportWorkloadInventoryFilteredCSVFetchStatus,
        reportWorkloadInventoryAvailableFilters,
        reportWorkloadInventoryAvailableFiltersFetchStatus
    };
};

const mapDispatchToProps = {
    fetchReportWorkloadInventory: reportActions.fetchReportWorkloadInventory,
    fetchReportWorkloadInventoryCSV: reportActions.fetchReportWorkloadInventoryAllCSV,
    fetchReportWorkloadInventoryFilteredCSV: reportActions.fetchReportWorkloadInventoryFilteredCSV,
    fetchReportWorkloadInventoryAvailableFilters: reportActions.fetchReportWorkloadInventoryAvailableFilters
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(WorkloadInventory)
);
