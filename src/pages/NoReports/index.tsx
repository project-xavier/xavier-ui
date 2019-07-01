import { GlobalState } from '../../models/state';
import { bindActionCreators } from 'redux';
import * as uploadActions from '../../actions/UploadActions';
import NoReports from './NoReports';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

const mapStateToProps = (state: GlobalState)  => {
    let {
        userState: {
            user
        }
    } = state;
    return {
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
    )(NoReports)
);
