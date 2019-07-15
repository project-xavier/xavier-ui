import { connect } from 'react-redux';
import NoReports from './NoReports';
import { withRouter } from 'react-router';
import { GlobalState } from '../../models/state';

const mapStateToProps = (state: GlobalState)  => {
    const {
        userState: {
            user
        }
    } = state;
    return {
        user
    };
};

const mapDispatchToProps = {
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(NoReports)
);
