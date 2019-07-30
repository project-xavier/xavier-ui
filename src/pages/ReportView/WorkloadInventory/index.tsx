import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import WorkloadInventory from './WorkloadInventory';
import { GlobalState } from '../../../models/state';
import * as reportActions from '../../../actions/ReportActions';

const mapStateToProps = (state: GlobalState) => {
    const {
        report,
        reportWorkloadInventory,
        reportWorkloadInventoryFetchStatus,
        reportWorkloadInventoryCSVFetchStatus
    } = state.reportState;
    return {
        report,
        reportWorkloadInventory,
        reportWorkloadInventoryFetchStatus,
        reportWorkloadInventoryCSVFetchStatus
    };
};

const mapDispatchToProps = {
    fetchReportWorkloadInventory: reportActions.fetchReportWorkloadInventory,
    fetchReportWorkloadInventoryCSV: reportActions.fetchReportWorkloadInventoryCSV
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(WorkloadInventory)
);
