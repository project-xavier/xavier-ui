import './UploadFiles.scss';
import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter, Link } from 'react-router-dom';
import {
    FolderOpenIcon
} from '@patternfly/react-icons';
import {
    Card,
    CardBody,
    Button,
    CardFooter,
    Progress,
    ProgressVariant,
    Stack,
    StackItem,
    FormGroup,
    TextInput,
    Form
} from '@patternfly/react-core';

import Dropzone from 'react-dropzone';
import UploadFilesPage from '../../PresentationalComponents/UploadFilesPage/UploadFilesPage';
import {
    uploadRequest,
    uploadProgress,
    uploadClear
} from '../../actions/UploadActions';
import { RouterGlobalProps } from '../../models/router';
import { GlobalState } from '../../models/state';
import { Upload } from '../../models/Upload';

interface Props extends RouterGlobalProps {
    uploadProgress: (file: File, progress: number) => void;
    uploadRequest: (customerId: string, file: File, config: {}) => void;
    uploadClear: () => void;
    uploads: Upload[];
};

interface State {
    customerId: string;
};

export class UploadFiles extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.onDrop = this.onDrop.bind(this);
        this.clearUploads();

        // TODO replace this to start using the customerId within the session
        this.state = {
            customerId: '123456'
        };
    }

    onDrop(files: File[]): void {
        this.startUpload(files);
    };

    startUpload(files: File[]): void {
        files.forEach((file) => {
            const config = {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                },
                onUploadProgress: (progressEvent: any) => {
                    const progress: number = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                    this.props.uploadProgress(file, progress);
                }
            };

            const customerId: string = this.state.customerId;
            this.props.uploadRequest(customerId, file, config);
        });
    }

    clearUploads(): void {
        this.props.uploadClear();
    }

    render() {
        const showDropZone: boolean = this.props.uploads.length === 0;
        const uploading: boolean = this.props.uploads.some((element) => element.uploading);

        const dropzoneRef: any = createRef();
        const openDialog = () => {
            if (dropzoneRef.current) {
                dropzoneRef.current.open();
            }
        };

        return (
            <UploadFilesPage
                title='Upload'
                showBreadcrumb={ false }>
                <Card>
                    <CardBody>
                        {
                            showDropZone ?
                                <div>
                                    <Dropzone
                                        onDrop={ this.onDrop }
                                        ref={ dropzoneRef }
                                        noClick noKeyboard
                                        multiple={ false }
                                        accept={ [ 'application/zip', 'application/json' ] }
                                    >
                                        { ({ getRootProps, getInputProps }) => {
                                            return (
                                                <div className="container">
                                                    <div { ...getRootProps({ className: 'dropzone' }) }>
                                                        <input { ...getInputProps() } />
                                                        <FolderOpenIcon className="pf-c-title pf-m-4xl" />
                                                        <p className="pf-c-title pf-m-3xl">Drag a file here</p>
                                                        <p className="pf-c-title">- or -</p>
                                                        <Button
                                                            type="button"
                                                            variant="tertiary"
                                                            onClick={ openDialog }>
                                                            Select a file from your computer
                                                        </Button>
                                                    </div>
                                                </div>
                                            );
                                        } }
                                    </Dropzone>
                                    <br/>
                                    <Form isHorizontal className="pf-l-level">
                                        <FormGroup
                                            label="Customer id"
                                            isRequired
                                            fieldId="horizontal-form-name"
                                        >
                                            <TextInput
                                                value={ this.state.customerId }
                                                isRequired
                                                type="text"
                                                id="horizontal-form-name"
                                                aria-describedby="horizontal-form-name-helper"
                                                name="horizontal-form-name"
                                            />
                                        </FormGroup>
                                    </Form>
                                </div>
                                :
                                <Stack gutter="md">
                                    {
                                        this.props.uploads.map((upload) => {
                                            return (
                                                <StackItem isMain key={ upload.file.name }>
                                                    <Progress
                                                        value={ upload.progress }
                                                        title={ upload.error
                                                            ? `${upload.file.name}: ${upload.error}`
                                                            : `Uploading: ${upload.file.name}` }
                                                        variant={ upload.error
                                                            ? ProgressVariant.danger
                                                            : ProgressVariant.info } />
                                                </StackItem>
                                            );
                                        })
                                    }
                                </Stack>
                        }
                    </CardBody>
                    <CardFooter>
                        { (showDropZone || uploading) ?
                            <Button variant="tertiary" component={ Link } to="/reports">Cancel</Button> :
                            <Button variant="primary" component={ Link } to="/reports">Next</Button>
                        }
                    </CardFooter>
                </Card>
            </UploadFilesPage>
        );
    }
}

const mapStateToProps = (state: GlobalState)  => {
    let { uploads: { uploads }} = state;
    return {
        uploads
    };
};

const mapDispatchToProps = (dispatch: any) =>
    bindActionCreators({
        uploadRequest,
        uploadProgress,
        uploadClear
    }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UploadFiles));
