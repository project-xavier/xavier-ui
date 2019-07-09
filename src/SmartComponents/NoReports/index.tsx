import { GlobalState } from '../../models/state';
import * as uploadActions from '../../actions/UploadActions';
import NoReports from './NoReports';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

const mapStateToProps = (state: GlobalState)  => {
    const {
        uploadState: {
            file
        }
    } = state;
    return {
        file
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
