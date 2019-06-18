import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { fetchReport } from '../../../actions/ReportActions';
import { RouterGlobalProps } from '../../../models/router';
import { GlobalState } from '../../../models/state';

interface StateToProps extends RouterGlobalProps {
}

interface DispatchToProps {
    fetchReport: (reportId: number) => void;
}

interface Props extends StateToProps, DispatchToProps {
};

interface State {
    reportId: number;
};

export class WorkloadInventory extends React.Component<Props, State> {

    render() {
        return (
            <p>inventory</p>
        );
    }
}

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

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(WorkloadInventory));
