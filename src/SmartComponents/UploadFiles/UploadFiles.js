import './UploadFiles.scss';
import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
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

class UploadFiles extends Component {

    constructor(props) {
        super(props);
        this.onDrop = this.onDrop.bind(this);
        this.clearUploads();

        this.state = {
            customerId: '123456'
        };
    }

    onDrop(files) {
        this.startUpload(files);
    };

    startUpload(files) {
        files.forEach((file) => {
            const config = {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                },
                onUploadProgress: progressEvent => {
                    const progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                    this.props.uploadProgress(file, progress);
                }
            };

            const customerId = this.state.customerId;
            this.props.uploadRequest(customerId, file, config);
        });
    }

    clearUploads() {
        this.props.uploadClear();
    }

    render() {
        const showDropZone = this.props.uploads.length === 0;
        const uploading = this.props.uploads.some((element) => element.success === null);

        const dropzoneRef = createRef();
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
                                                    <div tabIndex="1" { ...getRootProps({ className: 'dropzone' }) }>
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
                                            label="Customer ID"
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
                                                <StackItem key={ upload.file.name }>
                                                    <Progress
                                                        value={ upload.progress }
                                                        title={ upload.error
                                                            ? `${upload.file.name}: ${upload.error}`
                                                            : `Uploading: ${upload.file.name}` }
                                                        variant={ upload.error
                                                            ? ProgressVariant.danger
                                                            : ProgressVariant.primary } />
                                                </StackItem>
                                            );
                                        })
                                    }
                                </Stack>
                        }
                    </CardBody>
                    <CardFooter>
                        { (showDropZone || uploading) ?
                            <Link to="/reports">
                                <Button variant="tertiary">Cancel</Button>
                            </Link> :
                            <Link to="/reports">
                                <Button variant="primary">Next</Button>
                            </Link>
                        }
                    </CardFooter>
                </Card>
            </UploadFilesPage>
        );
    }
}

UploadFiles.propTypes = {
    uploadRequest: PropTypes.func.isRequired,
    uploadProgress: PropTypes.func.isRequired,
    uploadClear: PropTypes.func.isRequired,
    uploads: PropTypes.array.isRequired
};

const mapStateToProps = ({ uploads: { uploads }}) => ({
    uploads
});

const mapDispatchToProps = (dispatch) =>
    bindActionCreators({
        uploadRequest,
        uploadProgress,
        uploadClear
    }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UploadFiles));
