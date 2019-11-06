import { connect } from 'react-redux';
import Reports from './Reports';
import { withRouter } from 'react-router';
import { GlobalState } from '../../models/state';
import  * as reportActions from '../../actions/ReportActions';
import  * as dialogDeleteActions from '../../actions/DialogDeleteActions';

const mapStateToProps = (state: GlobalState)  => {
    const {
        reportState: {
            reports,
            reportsFetchStatus
        }
    } = state;
    return {
        reports,
        reportsFetchStatus
    };
};

const mapDispatchToProps = {
    fetchReports: reportActions.fetchReports,
    deleteReport: reportActions.deleteReport,
    showDeleteDialog: dialogDeleteActions.openModal,
    closeDeleteDialog: dialogDeleteActions.closeModal,
    fetchReportPayloadFile: reportActions.fetchReportPayloadFile,
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Reports)
);
