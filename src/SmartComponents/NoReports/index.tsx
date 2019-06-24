import React, { createRef } from 'react';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import {
    Button,
    Bullseye,
    EmptyStateBody,
    EmptyStateVariant,
    EmptyState,
    Title
} from '@patternfly/react-core';
// import {
//     CubesIcon
// } from '@patternfly/react-icons';
import * as uploadActions from '../../actions/UploadActions';
import { GlobalState } from '../../models/state';
import { RouterGlobalProps } from '../../models/router';
import ProcessImprovementSvg from '../../PresentationalComponents/Icons/process-improvement.svg';
import './Reports.scss';

interface StateToProps {
    file: File | null
}

interface DispatchToProps {
    selectUploadFile: (file: File) => any;
}

interface Props extends StateToProps, DispatchToProps, RouterGlobalProps {
};

interface State {
};

export class NoReports extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    onDrop = (files: File[]) => {
        this.props.selectUploadFile(files[0]);
        this.props.history.push('/reports/upload');
    };

    render() {
        const dropzoneRef: any = createRef();
        const openFileDialog = () => {
            if (dropzoneRef.current) {
                dropzoneRef.current.open();
            }
        };

        return (
            <Bullseye>
                <EmptyState variant={ EmptyStateVariant.full }>
                    <div className="pf-c-empty-state__icon" style={ { opacity: 0.6 } }>
                        <ProcessImprovementSvg height="80px" />
                    </div>
                    <Title size="lg">Let Red Hat Migration Analytics suggest ways to optimize your environment</Title>
                    <EmptyStateBody>
                                See how you can optimize your virtual environment by
                                uploading a Red Hat CloudForms generated inventory file
                                and then letting Red Hat Migration Analytics create
                                reports showing how you can save money and optimize
                                workloads - whether by migrating virtual machines or
                                migrating application to RHEL.
                    </EmptyStateBody>
                    <Dropzone
                        onDrop={ this.onDrop }
                        ref={ dropzoneRef }
                        noClick noKeyboard
                        multiple={ false }
                        accept={ [ 'application/zip', 'application/json' ] }
                    >
                        { ({ getRootProps, getInputProps }) => {
                            return (
                                <div { ...getRootProps({ className: 'dropzone' }) }>
                                    <input { ...getInputProps() } />
                                    <Button
                                        type="button"
                                        variant="primary"
                                        onClick={ openFileDialog }>
                                        Get Started
                                    </Button>
                                </div>
                            );
                        } }
                    </Dropzone>
                </EmptyState>
            </Bullseye>
        );
    }
}

const mapStateToProps = (state: GlobalState)  => {
    let {
        uploadState: {
            file
        }
    } = state;
    return {
        file
    };
};

const mapDispatchToProps = (dispatch: any) =>
    bindActionCreators({
        selectUploadFile: uploadActions.selectUploadFile
    }, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NoReports));
