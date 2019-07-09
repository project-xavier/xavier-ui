import { connect } from 'react-redux';
import Reports from './Reports';
import { withRouter } from 'react-router';
import { GlobalState } from '../../models/state';
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

const mapDispatchToProps = {
    fetchReports: reportActions.fetchReports
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(Reports)
);
