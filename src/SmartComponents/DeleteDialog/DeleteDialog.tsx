import { Button, Modal } from '@patternfly/react-core';
import React from 'react';

interface Props {
  onDelete: () => void;
  onCancel: any;
  isOpen: boolean;
  isProcessing: boolean;
  isError: boolean;
  name: string;
  type: string;
}

interface State { }

class DeleteDialogBase extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        const {
            type,
            name,
            onDelete,
            onCancel,
            isOpen,
            isProcessing,
            isError
        } = this.props;

        return (
            <Modal
                isSmall
                title={ `Delete ${name}` }
                onClose={ onCancel }
                isOpen={ isOpen }
                actions={ [
                    <Button
                        key="cancel"
                        isDisabled={ isProcessing }
                        variant="secondary"
                        onClick={ onCancel }
                    >
                        No, I would like to keep it
                    </Button>,
                    <Button
                        key="confirm"
                        isDisabled={ isProcessing }
                        variant="danger"
                        onClick={ onDelete }
                    >
                        Yes, please delete this { `${type}` }
                    </Button>
                ] }
            >
                { isError
                    ? `Ops! There was a problem while deleting the ${type}.`
                    : `Are you sure you want to delete this ${type}? This action will remove any data related to this ${type} permanently.` }
            </Modal>
        );
    }

}

export default DeleteDialogBase;
