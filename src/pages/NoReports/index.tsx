import { GlobalState } from '../../models/state';
import * as uploadActions from '../../actions/UploadActions';
import NoReports from './NoReports';
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
    selectUploadFile: uploadActions.selectUploadFile
};

export default withRouter(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(NoReports)
);
