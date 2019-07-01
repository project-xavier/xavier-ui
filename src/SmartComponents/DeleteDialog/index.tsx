import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { GlobalState } from '../../models/state';
// import * as dialogDeleteActions from '../../actions/DialogDeleteActions';
import DeleteDialogBase from './DeleteDialog';

const mapStateToProps = (state: GlobalState)  => {
    let {
        dialogDeleteState: {
            isOpen,
            isProcessing,
            isError,
            name,
            type,
            onDelete,
            onCancel
        }
    } = state;
    return {
        isOpen,
        isProcessing,
        isError,
        name,
        type,
        onDelete,
        onCancel
    };
};

const mapDispatchToProps = (dispatch: any) =>
    bindActionCreators({
        // openModal: dialogDeleteActions.openModal,
        // closeModal: dialogDeleteActions.closeModal,
        // processingModal: dialogDeleteActions.processingModal,
        // errorModal: dialogDeleteActions.errorModal
    }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(DeleteDialogBase);
