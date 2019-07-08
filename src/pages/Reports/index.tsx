import { connect } from 'react-redux';
import Reports from './Reports';
import { withRouter } from 'react-router';
import { GlobalState } from '../../models/state';
import { bindActionCreators } from 'redux';
import  * as reportActions from '../../actions/ReportActions';

const mapStateToProps = (state: GlobalState)  => {
    const {
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
        fetchReports: reportActions.fetchReports
    }, dispatch);

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Reports)
);
