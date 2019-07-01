import { connect } from 'react-redux';
import Reports from './Reports';
import { withRouter } from 'react-router';
import { GlobalState } from '../../models/state';
import { bindActionCreators } from 'redux';
import  * as reportActions from '../../actions/ReportActions';
import  * as dialogDeleteActions from '../../actions/DialogDeleteActions';

const mapStateToProps = (state: GlobalState)  => {
    let {
        reportState: {
            reports,
            loading,
            error,
            total
        }
    } = state;
    return {
        reports,
        loading,
        error,
        total
    };
};

const mapDispatchToProps = (dispatch: any) =>
    bindActionCreators({
        fetchReports: reportActions.fetchReports,
        deleteReport: reportActions.deleteReport,
        showDeleteDialog: dialogDeleteActions.openModal,
        closeDeleteDialog: dialogDeleteActions.closeModal
    }, dispatch);

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Reports)
);
