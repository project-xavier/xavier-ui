import { GlobalState } from '../../models/state';
import { bindActionCreators } from 'redux';
import * as uploadActions from '../../actions/UploadActions';
import GettingStarted from './GettingStarted';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

const mapStateToProps = (state: GlobalState)  => {
    let {
        uploadState: {
            file
        },
        userState: {
            user
        }
    } = state;
    return {
        file,
        user
    };
};

const mapDispatchToProps = (dispatch: any) =>
    bindActionCreators({
        selectUploadFile: uploadActions.selectUploadFile
    }, dispatch);

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(GettingStarted)
);
