import { GlobalState } from '../../models/state';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router';
import ReportView from './ReportView';
import { fetchReport } from '../../actions/ReportActions';
import { connect } from 'react-redux';

const mapStateToProps = (state: GlobalState)  => {
    let { report, loading, error } = state.reportState;
    return {
        report,
        loading,
        error
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({
        fetchReport
    }, dispatch);
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(ReportView)
);
