import { GlobalState } from '../../models/state';
import * as uploadActions from '../../actions/UploadActions';
import GettingStarted from './GettingStarted';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

const mapStateToProps = (state: GlobalState) => {
    const {
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

const mapDispatchToProps = {
    selectUploadFile: uploadActions.selectUploadFile
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(GettingStarted)
);
