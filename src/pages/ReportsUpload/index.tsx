import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import ReportsUpload from './ReportsUpload';
import * as uploadActions from '../../actions/UploadActions';
import * as userActions from '../../actions/UserActions';
import { GlobalState } from '../../models/state';

const mapStateToProps = (state: GlobalState)  => {
    const {
        uploadState: {
            file,
            success,
            error,
            progress,
            uploading
        },
        userState: {
            user
        }
    } = state;
    return {
        user,
        file,
        success,
        error,
        progress,
        uploading
    };
};

const mapDispatchToProps = (dispatch: any) =>
    bindActionCreators({
        uploadRequest: uploadActions.uploadRequest,
        uploadProgress: uploadActions.uploadProgress,
        selectUploadFile: uploadActions.selectUploadFile,
        updateUser: userActions.updateUser
    }, dispatch);

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(ReportsUpload)
);
