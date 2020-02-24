import { connect } from 'react-redux';
import Reports from './Reports';
import { withRouter } from 'react-router';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications';
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
    addNotification,
    fetchReports: reportActions.fetchReports,
    deleteReport: reportActions.deleteReport,
    showDeleteDialog: dialogDeleteActions.openModal,
    closeDeleteDialog: dialogDeleteActions.closeModal,
    fetchReportPayloadDownloadLink: reportActions.fetchReportPayloadDownloadLink
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Reports)
);
