import { connect } from 'react-redux';
import { GlobalState } from '../../models/state';
import DeleteDialogBase from './DeleteDialog';

const mapStateToProps = (state: GlobalState) => {
    const {
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

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteDialogBase);
