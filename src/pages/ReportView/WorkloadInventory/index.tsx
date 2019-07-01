import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import WorkloadInventory from './WorkloadInventory';
import { GlobalState } from '../../../models/state';

const mapStateToProps = (state: GlobalState)  => {
    let { report } = state.reportState;
    return {
        report
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return bindActionCreators({

    }, dispatch);
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(WorkloadInventory)
);
