import React, { createRef } from 'react';
import { bindActionCreators } from 'redux';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import {
    Button,
    Modal,
    Form,
    FormGroup,
    TextInput,
    ActionGroup,
    InputGroup,
    InputGroupText,
    Grid,
    GridItem,
    ButtonVariant,
    Split,
    SplitItem,
    Stack,
    StackItem,
    Bullseye,
    EmptyState,
    EmptyStateVariant,
    EmptyStateIcon,
    Title,
    EmptyStateBody,
    ProgressMeasureLocation,
    Progress,
    TitleLevel,
    ProgressVariant,
    EmptyStateSecondaryActions
} from '@patternfly/react-core';
import { EditIcon, CubesIcon } from '@patternfly/react-icons';
import * as uploadActions from '../../actions/UploadActions';
import { GlobalState } from '../../models/state';
import { RouterGlobalProps } from '../../models/router';
import {
    Main,
    PageHeader,
    PageHeaderTitle
} from '@redhat-cloud-services/frontend-components';
import { Upload } from '../../models';
import Dropzone from 'react-dropzone';

interface StateToProps {
    file: File | null;
    success: boolean | null;
    error: string | null;
    progress: number;
    uploading: boolean
}

interface DispatchToProps {
    uploadProgress: (progress: number) => void;
    uploadRequest: (upload: Upload, config: {}) => void;
}

interface Props extends StateToProps, DispatchToProps, RouterGlobalProps {
};

interface State {
    submitted: boolean,

    file?: File | null,
    reportName?: string,
    reportDescription?: string | null,
    yearOverYearGrowthRatePercentage?: number | null,
    percentageOfHypervisorsMigratedOnYear1?: number | null,
    percentageOfHypervisorsMigratedOnYear2?: number | null,
    percentageOfHypervisorsMigratedOnYear3?: number | null
};

export class ReportsUpload extends React.Component<Props, State> {

    selectFileButtonRef: any;

    constructor(props: Props) {
        super(props);
        this.state = {
            submitted: false,

            file: this.props.file,
            reportName: this.props.file ? this.props.file.name : '',
            reportDescription: '',
            yearOverYearGrowthRatePercentage: 5,
            percentageOfHypervisorsMigratedOnYear1: 50,
            percentageOfHypervisorsMigratedOnYear2: 30,
            percentageOfHypervisorsMigratedOnYear3: 10
        };
        this.handleModalToggle = this.handleModalToggle.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.onDrop = this.onDrop.bind(this);
    }

    handleModalToggle () {
        this.props.history.push('/reports');
    };

    handleInputChange(value: string, event: any) {
        const target = event.target;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit(event: any) {
        event.preventDefault();
        this.setState({
            submitted: true
        });

        const upload: Upload = {
            ... this.state
        };

        const config = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            onUploadProgress: (progressEvent: any) => {
                const progress: number = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                this.props.uploadProgress(progress);
            }
        };

        this.props.uploadRequest(upload, config);
    }

    progress() {
        return (
            <Bullseye>
                <EmptyState variant={ EmptyStateVariant.full }>
                    <EmptyStateIcon icon={ CubesIcon } />
                    <Title headingLevel={ TitleLevel.h5 } size="lg">
                        Empty State
                    </Title>
                    <div className="pf-c-empty-state__body">
                        <Progress
                            value={ this.props.progress }
                            measureLocation={ ProgressMeasureLocation.outside }
                            variant={ this.props.error ? ProgressVariant.danger : ProgressVariant.info }
                        />
                    </div>
                    <EmptyStateBody>
                        Your file is been uploaded, the process can take some time.
                    </EmptyStateBody>
                    <EmptyStateSecondaryActions>
                        {
                            this.props.success && <Button
                                variant={ ButtonVariant.primary }
                                component={ Link }
                                to={ '/reports' }>
                                Close
                            </Button>
                        }
                    </EmptyStateSecondaryActions>
                </EmptyState>
            </Bullseye>
        );
    }

    onDrop(files: File[]): void {
        this.setState({
            file: files[0],
            reportName: files[0].name
        });
    };

    form() {
        const dropzoneRef: any = createRef();
        const openDialog = () => {
            if (dropzoneRef.current) {
                dropzoneRef.current.open();
            }
        };

        return (
            <Form onSubmit={ this.handleSubmit }>
                <FormGroup
                    fieldId="file"
                    label=""
                >
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
                                        <InputGroup>
                                            <TextInput
                                                id="file"
                                                name="file"
                                                type="text"
                                                aria-label="Select a File"
                                                value={ this.state.file ? this.state.file.name : '' } />
                                            <Button
                                                variant={ ButtonVariant.tertiary }
                                                aria-label="search button for search input"
                                                onClick={ openDialog }
                                            >
                                                <EditIcon />
                                            </Button>
                                        </InputGroup>
                                    </div>
                                </div>
                            );
                        } }
                    </Dropzone>
                </FormGroup>
                <FormGroup
                    isRequired
                    label="Report name"
                    fieldId="reportName"
                >
                    <TextInput
                        isRequired
                        type="text"
                        id="reportName"
                        name="reportName"
                        aria-describedby="Report name"
                        value={ this.state.reportName }
                        onChange={ this.handleInputChange }
                    />
                </FormGroup>
                <FormGroup
                    label="Report description"
                    fieldId="reportDescription"
                >
                    <TextInput
                        isRequired
                        type="text"
                        id="reportDescription"
                        name="reportDescription"
                        aria-describedby="Report description"
                        value={ this.state.reportDescription }
                        onChange={ this.handleInputChange }
                    />
                </FormGroup>
                <FormGroup
                    isRequired
                    label="Year-over-year growth rate for new hypervisors"
                    fieldId="yearOverYearGrowthRatePercentage"
                >
                    <Grid>
                        <GridItem span={ 2 }>
                            <InputGroup>
                                <TextInput
                                    isRequired
                                    type="number"
                                    id="yearOverYearGrowthRatePercentage"
                                    name="yearOverYearGrowthRatePercentage"
                                    value={ this.state.yearOverYearGrowthRatePercentage }
                                    onChange={ this.handleInputChange }
                                />
                                <InputGroupText>%</InputGroupText>
                            </InputGroup>
                        </GridItem>
                    </Grid>
                </FormGroup>
                <FormGroup
                    label="Percentage of hypervisors migrated each year"
                    fieldId=""
                >
                    <Split>
                        <SplitItem isFilled={ false }>
                            <Stack gutter="sm">
                                <StackItem isFilled={ false }>
                                    <InputGroup>
                                        <InputGroupText>Year 1</InputGroupText>
                                        <TextInput
                                            isRequired
                                            type="number"
                                            id="percentageOfHypervisorsMigratedOnYear1"
                                            name="percentageOfHypervisorsMigratedOnYear1"
                                            aria-label="Percentage of hypervisors migrated on year 1"
                                            value={ this.state.percentageOfHypervisorsMigratedOnYear1 }
                                            onChange={ this.handleInputChange }
                                        />
                                        <InputGroupText>%</InputGroupText>
                                    </InputGroup>
                                </StackItem>
                                <StackItem isFilled={ false }>
                                    <InputGroup>
                                        <InputGroupText>Year 2</InputGroupText>
                                        <TextInput
                                            isRequired
                                            type="number"
                                            id="percentageOfHypervisorsMigratedOnYear2"
                                            name="percentageOfHypervisorsMigratedOnYear2"
                                            aria-label="Percentage of hypervisors migrated on year 2"
                                            value={ this.state.percentageOfHypervisorsMigratedOnYear2 }
                                            onChange={ this.handleInputChange }
                                        />
                                        <InputGroupText>%</InputGroupText>
                                    </InputGroup>
                                </StackItem>
                                <StackItem isFilled={ false }>
                                    <InputGroup>
                                        <InputGroupText>Year 3</InputGroupText>
                                        <TextInput
                                            isRequired
                                            type="number"
                                            id="percentageOfHypervisorsMigratedOnYear3"
                                            name="percentageOfHypervisorsMigratedOnYear3"
                                            aria-label="Percentage of hypervisors migrated on year 3"
                                            value={ this.state.percentageOfHypervisorsMigratedOnYear3 }
                                            onChange={ this.handleInputChange }
                                        />
                                        <InputGroupText>%</InputGroupText>
                                    </InputGroup>
                                </StackItem>
                            </Stack>
                        </SplitItem>
                    </Split>
                </FormGroup>
                <ActionGroup>
                    <Button variant="primary" type="submit">Create report</Button>
                    <Button variant="secondary" component={ Link } to={ '/reports' }>Cancel</Button>
                </ActionGroup>
            </Form>
        );
    }

    render() {
        return (
            <React.Fragment>
                <PageHeader>
                    <PageHeaderTitle title='Reports' />
                </PageHeader>
                <Main>
                    <Modal
                        title='Report options'
                        isLarge
                        isOpen={ true }
                        onClose={ this.handleModalToggle }
                        ariaDescribedById="no-header-example"
                        actions={ [] }
                    >
                        { this.state.submitted ? this.progress() : this.form() }
                    </Modal>
                </Main>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: GlobalState)  => {
    let {
        uploadState: {
            file,
            success,
            error,
            progress,
            uploading
        }
    } = state;
    return {
        file,
        success,
        error,
        progress,
        uploading
    };
};

const mapDispatchToProps = (dispatch: any) =>
    bindActionCreators({
        uploadRequest: uploadActions.uploadRequest,
        uploadProgress: uploadActions.uploadProgress
    }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ReportsUpload));
