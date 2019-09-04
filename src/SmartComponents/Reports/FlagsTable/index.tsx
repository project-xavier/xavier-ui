import { connect } from 'react-redux';
import FlagsTable from './FlagsTable';
import { GlobalState } from '../../../models/state';
import * as reportActions from '../../../actions/ReportActions';

const mapStateToProps = (state: GlobalState) => {
    const {
        reportFlags,
        reportFlagsFetchStatus
    } = state.reportState;
    return {
        reportFlags,
        reportFlagsFetchStatus
    };
};

const mapDispatchToProps = {
    fetchReportFlags: reportActions.fetchReportFlags
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FlagsTable);
