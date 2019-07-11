import { GlobalState } from '../../models/state';
import { withRouter } from 'react-router';
import ReportView from './ReportView';
import { fetchReport } from '../../actions/ReportActions';
import { connect } from 'react-redux';

const mapStateToProps = (state: GlobalState)  => {
    const { report, loading, error } = state.reportState;
    return {
        report,
        loading,
        error
    };
};

const mapDispatchToProps = {
    fetchReport
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(ReportView)
);
