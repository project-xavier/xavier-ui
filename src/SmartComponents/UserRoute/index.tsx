import { connect } from 'react-redux';
import UserRoute from './UserRoute';
import { GlobalState } from '../../models/state';
import * as userActions from '../../actions/UserActions';

const mapStateToProps = (state: GlobalState) => {
    const {
        userState: {
            user,
            userFetchStatus
        }
    } = state;
    return {
        user,
        userFetchStatus
    };
};

const mapDispatchToProps = {
    fetchUser: userActions.fetchUser
};

export default connect(mapStateToProps, mapDispatchToProps)(UserRoute);
