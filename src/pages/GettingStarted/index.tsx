import { GlobalState } from '../../models/state';
import GettingStarted from './GettingStarted';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

const mapStateToProps = (state: GlobalState) => {
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
    )(GettingStarted)
);
