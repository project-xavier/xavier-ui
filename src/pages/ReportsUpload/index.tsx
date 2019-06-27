import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import ReportsUpload from './ReportsUpload';
import * as uploadActions from '../../actions/UploadActions';
import { GlobalState } from '../../models/state';

const mapStateToProps = (state: GlobalState)  => {
    const {
        uploadState: {
            file,
            success,
            error,
            progress,
            uploading
        }
    } = state;
    return {
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
        selectUploadFile: uploadActions.selectUploadFile
    }, dispatch);

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(ReportsUpload)
);
