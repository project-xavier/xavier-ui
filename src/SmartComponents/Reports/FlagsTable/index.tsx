import { connect } from 'react-redux';
import FlagsTable from './FlagsTable';
import { GlobalState } from '../../../models/state';
import * as reportActions from '../../../actions/ReportActions';
import * as mappingActions from '../../../actions/MappingsActions';

const mapStateToProps = (state: GlobalState) => {
    const {
        reportFlags,
        reportFlagsFetchStatus
    } = state.reportState;
    const {
        flagAssessment: {
            allFlags,
            allFlagsFetchStatus
        }
    } = state.mappingsState;
    return {
        reportFlags,
        reportFlagsFetchStatus,
        allFlags,
        allFlagsFetchStatus
    };
};

const mapDispatchToProps = {
    fetchReportFlags: reportActions.fetchReportFlags,
    fetchAllFlagAssessments: mappingActions.fetchAllFlagAssessments
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FlagsTable);
