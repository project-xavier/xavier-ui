import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import UserRoute from './UserRoute';
import { GlobalState } from '../../models/state';
import * as userActions from '../../actions/UserActions';

const mapStateToProps = (state: GlobalState)  => {
    let {
        userState: {
            user,
            error,
            loading
        }
    } = state;
    return {
        user,
        error,
        loading
    };
};

const mapDispatchToProps = (dispatch: any) =>
    bindActionCreators({
        fetchUser: userActions.fetchUser
    }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(UserRoute);
