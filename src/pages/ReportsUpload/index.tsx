import React, { createRef } from 'react';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
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
    ButtonVariant,
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
    EmptyStateSecondaryActions,
    Gallery,
    GalleryItem,
    Stack,
    StackItem
} from '@patternfly/react-core';
import { VolumeIcon } from '@patternfly/react-icons';
import Dropzone from 'react-dropzone';
import { Formik, FormikState, FormikActions, FormikHandlers } from 'formik';
import * as Yup from 'yup';
import * as uploadActions from '../../actions/UploadActions';
import { GlobalState } from '../../models/state';
import { RouterGlobalProps } from '../../models/router';
import {
    Main,
    PageHeader,
    PageHeaderTitle
} from '@redhat-cloud-services/frontend-components';
import { Upload } from '../../models';
import './ReportsUpload.scss';

interface FormValues {
    file: string;
    reportName: string;
    reportDescription: string;
    yearOverYearGrowthRatePercentage: number;
    percentageOfHypervisorsMigratedOnYear1: number;
    percentageOfHypervisorsMigratedOnYear2: number;
    percentageOfHypervisorsMigratedOnYear3: number;
    percentageOfHypervisorsMigratedSum: number // Sum of year1, year2, and year3
}

interface StateToProps {
    file: File;
    success: boolean | null;
    error: string | null;
    progress: number;
    uploading: boolean
}

interface DispatchToProps {
    uploadProgress: (progress: number) => void;
    uploadRequest: (upload: Upload, config: {}) => void;
    selectUploadFile: (file: File) => void;
}

interface Props extends StateToProps, DispatchToProps, RouterGlobalProps {
}

interface State {
    showForm: boolean;
    timeoutToRedirect: number;
}

export class ReportsUpload extends React.Component<Props, State> {

    redirectTimer: any;
    beforeUnloadHandler: any;

    initialFormValue: FormValues;

    constructor(props: Props) {
        super(props);

        this.state = {
            showForm: true,
            timeoutToRedirect: 3
        };

        this.initialFormValue = {
            file: '',
            reportName: '',
            reportDescription: '',
            yearOverYearGrowthRatePercentage: 5,
            percentageOfHypervisorsMigratedOnYear1: 50,
            percentageOfHypervisorsMigratedOnYear2: 30,
            percentageOfHypervisorsMigratedOnYear3: 10,
            percentageOfHypervisorsMigratedSum: 90
        };

        this.redirectTimer = null;
    }

    componentDidMount() {
        this.beforeUnloadHandler = window.addEventListener('beforeunload', (event) => {
            if (this.props.uploading) {
                event.preventDefault();
                return event.returnValue = 'Are you sure you want to close? The upload has not finished yet';
            }

            return event;
        });
    }

    componentWillUnmount() {
        removeEventListener('beforeunload', this.beforeUnloadHandler);
    }

    /**
     * Called by "Close modal" or by the "Cancel button"
     */
    handleCloseModel = () => {
        if (!this.props.uploading) {
            this.props.history.push('/reports');
        }
    };

    actionsOnUploadSuccess = () => {
        const { timeoutToRedirect } = this.state;

        this.startRedirectTimer();

        if (this.state.timeoutToRedirect === 0) {
            this.props.history.push('/reports');
        }

        return (
            <Button type="button" variant={ ButtonVariant.primary } onClick={ this.handleCloseModel }> Closing in { timeoutToRedirect } </Button>
        );
    }

    startRedirectTimer = () => {
        if (this.redirectTimer === null && this.state.timeoutToRedirect > 0) {
            this.redirectTimer = setInterval(this.redirectCountDown, 1000);
        }
    }

    redirectCountDown = () => {
        let timeoutToRedirect = this.state.timeoutToRedirect - 1;
        this.setState({
            timeoutToRedirect
        });

        if (timeoutToRedirect === 0) {
            clearInterval(this.redirectTimer);
        }
    }

    handleFormSubmit = (values: FormValues) => {
        this.setState({
            showForm: false
        });

        const upload: Upload = {
            file: this.props.file,
            reportName: values.reportName,
            reportDescription: values.reportDescription,
            yearOverYearGrowthRatePercentage: values.yearOverYearGrowthRatePercentage,
            percentageOfHypervisorsMigratedOnYear1: values.percentageOfHypervisorsMigratedOnYear1,
            percentageOfHypervisorsMigratedOnYear2: values.percentageOfHypervisorsMigratedOnYear2,
            percentageOfHypervisorsMigratedOnYear3: values.percentageOfHypervisorsMigratedOnYear3
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

    onFileSelected = (files: File[]): void => {
        this.props.selectUploadFile(files[0]);
    };

    validateForm = (values: FormValues) => {
        const validationSchema = this.getValidationSchema(values);
        try {
            validationSchema.validateSync(values, { abortEarly: false });
            return {};
        } catch (error) {
            return this.getErrorsFromValidationError(error);
        }
    }

    getValidationSchema = (values: FormValues) => {
        return Yup.object().shape({
            file: Yup.string()
            .required('File is mandatory'),
            reportName: Yup.string()
            .min(3, 'Report name must contain at least 3 characters ')//reproduce
            .max(250, 'Report name must contain fewer than 250 characters')
            .required('Report name is mandatory'),
            reportDescription: Yup.string()
            .max(250, 'Report description must contain fewer than 250 characters'),
            yearOverYearGrowthRatePercentage: Yup.number()
            .min(0, 'Value must be greater than or equal to 0')
            .required('Growth rate percentage is mandatory'),
            percentageOfHypervisorsMigratedOnYear1: Yup.number()
            .min(0, 'Value must be greater than or equal to 0')
            .max(100, 'Value must be less than or equal to 100')
            .required('Percentage of hypervisors migrated is mandatory'),
            percentageOasfHypervisorsMigratedOnYear2: Yup.number()
            .min(0, 'Vaaslue must be greater than or equal to 0')
            .max(100, 'Value must be less than or equal to 100')
            .required('Percentage of hypervisors migrated is mandatory'),
            percentageOasfHypervisorsMigratedOnYear3: Yup.number()
            .min(0, 'Value must be greater than or equal to 0')
            .max(100, 'Value must be less than or equal to 100')
            .required('Percentage of hypervisors migrated is mandatory'),
            percentageOfHypervisorsMigratedSum: Yup.number()
            .min(0, 'Value must be greater than or equal to 0')
            .max(100, 'Value must be less than or equal to 100')
            .test('validSum', 'The total percentage must not exceed 100', () => {
                const sum = values.percentageOfHypervisorsMigratedOnYear1 +
                    values.percentageOfHypervisorsMigratedOnYear2 +
                    values.percentageOfHypervisorsMigratedOnYear3;
                return sum >= 0 && sum <= 100;
            })
        });
    }

    getErrorsFromValidationError = (validationError: any) => {
        const FIRST_ERROR = 0;
        return validationError.inner.reduce((errors: any, error: any) => {
            return {
                ...errors,
                [error.path]: error.errors[FIRST_ERROR]
            };
        }, {});
    }

    progress() {
        return (
            <Bullseye>
                <EmptyState variant={ EmptyStateVariant.full }>
                    <EmptyStateIcon icon={ VolumeIcon } />
                    <Title headingLevel={ TitleLevel.h5 } size="lg">
                        Upload
                    </Title>
                    <div className="pf-c-empty-state__body">
                        <Progress
                            value={ this.props.progress }
                            measureLocation={ ProgressMeasureLocation.outside }
                            variant={ this.props.error ? ProgressVariant.danger : ProgressVariant.info }
                        />
                    </div>
                    <EmptyStateBody>
                        {
                            this.props.success ?
                                'Finished successfully. We will redirect you to the next page.' :
                                'Your file is been uploaded, the process can take some time.'
                        }
                    </EmptyStateBody>
                    <EmptyStateSecondaryActions>
                        {
                            this.props.success ? this.actionsOnUploadSuccess() : ''
                        }
                    </EmptyStateSecondaryActions>
                </EmptyState>
            </Bullseye>
        );
    }

    form() {
        return (
            <Formik
                initialValues={ this.initialFormValue }
                validate={  this.validateForm }
                onSubmit={ this.handleFormSubmit }
            >
                {
                    props => <UploadForm
                        onFileSelected={ this.onFileSelected }
                        file={ this.props.file }
                        handleCancel={ this.handleCloseModel }
                        { ...props } />
                }
            </Formik>
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
                        onClose={ this.handleCloseModel }
                        ariaDescribedById="Report options"
                        actions={ [] }
                    >
                        { this.state.showForm ? this.form() : this.progress() }
                    </Modal>
                </Main>
            </React.Fragment>
        );
    }
}

interface UploadFormProps extends FormikState<FormValues>, FormikActions<FormValues>, FormikHandlers {
    file: File;
    onFileSelected: Function;
    handleCancel: (e: any) => any;
}

class UploadForm extends React.Component<UploadFormProps, { }> {

    constructor(props: UploadFormProps) {
        super(props);
    }

    componentDidMount() {
        this.updateFieldValues();
    }

    componentDidUpdate(prevProps: any) {
        if (prevProps.file !== this.props.file) {
            this.updateFieldValues();
        }
    }

    updateFieldValues() {
        if (this.props.file) {
            const fileName = this.props.file.name;
            setTimeout(() => {
                this.props.setFieldValue('file', fileName);
                if (!this.props.values.reportName) {
                    this.props.setFieldValue('reportName', fileName);
                }
            }, 0);
        }
    }

    render() {
        const {
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting
        } = this.props;

        const dropzoneRef: any = createRef();
        const openFileDialog = () => {
            if (dropzoneRef.current) {
                dropzoneRef.current.open();
            }
        };

        return (
            <Form onSubmit={ handleSubmit }>
                <FormGroup
                    isRequired
                    label="Inventory data file"
                    fieldId="file"
                    helperTextInvalid={ errors.file }
                    isValid={
                        (errors.file && touched.file) ? false : true
                    }
                >
                    <Dropzone
                        onDrop={ (files: File[]) => {
                            this.props.onFileSelected(files);
                        } }
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
                                                value={ values.file }
                                                isValid={
                                                    (errors.file && touched.file) ? false : true
                                                } />
                                            <Button
                                                variant={ ButtonVariant.secondary }
                                                aria-label="Browse a file to upload"
                                                onClick={ openFileDialog }
                                            >
                                                Browse
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
                    helperTextInvalid={ errors.reportName }
                    isValid={
                        (errors.reportName && touched.reportName) ? false : true
                    }
                >
                    <TextInput
                        isRequired
                        type="text"
                        id="reportName"
                        name="reportName"
                        aria-describedby="Report name"
                        onChange={ (_value, event) => handleChange(event) }
                        onBlur={ handleBlur }
                        value={ values.reportName }
                        isValid={
                            (errors.reportName && touched.reportName) ? false : true
                        }
                    />
                </FormGroup>
                <FormGroup
                    label="Report description"
                    fieldId="reportDescription"
                    helperTextInvalid={ errors.reportDescription }
                    isValid={ (errors.reportDescription && touched.reportDescription) ? false : true }
                >
                    <TextInput
                        type="text"
                        id="reportDescription"
                        name="reportDescription"
                        aria-describedby="Report description"
                        onChange={ (_value, event) => handleChange(event) }
                        onBlur={ handleBlur }
                        value={ values.reportDescription }
                        isValid={
                            (errors.reportDescription && touched.reportDescription) ? false : true
                        }
                    />
                </FormGroup>
                <FormGroup
                    isRequired
                    label="Year-over-year growth rate for new hypervisors"
                    fieldId="yearOverYearGrowthRatePercentage"
                    helperTextInvalid={ errors.yearOverYearGrowthRatePercentage }
                    isValid={
                        (errors.yearOverYearGrowthRatePercentage && touched.yearOverYearGrowthRatePercentage) ? false : true
                    }
                >
                    <Gallery>
                        <GalleryItem>
                            <InputGroup>
                                <TextInput
                                    isRequired
                                    id="yearOverYearGrowthRatePercentage"
                                    type="number"
                                    name="yearOverYearGrowthRatePercentage"
                                    aria-describedby="Year-over-year growth rate for new hypervisors"
                                    className="pf-u-text-align-right"
                                    onChange={ (_value, event) => handleChange(event) }
                                    onBlur={ handleBlur }
                                    value={ values.yearOverYearGrowthRatePercentage }
                                    isValid={
                                        (errors.yearOverYearGrowthRatePercentage && touched.yearOverYearGrowthRatePercentage) ? false : true
                                    }
                                />
                                <InputGroupText>%</InputGroupText>
                            </InputGroup>
                        </GalleryItem>
                    </Gallery>
                </FormGroup>
                <Stack gutter="sm" className="pf-sm-gutter">
                    <StackItem isFilled={ false }>
                        <FormGroup
                            label="Percentage of hypervisors migrated each year"
                            fieldId="percentageOfHypervisorsMigratedOnYear1"
                            helperTextInvalid={ errors.percentageOfHypervisorsMigratedOnYear1 || errors.percentageOfHypervisorsMigratedSum }
                            isValid={
                                (errors.percentageOfHypervisorsMigratedOnYear1 && touched.percentageOfHypervisorsMigratedOnYear1) ||
                                (errors.percentageOfHypervisorsMigratedSum) ? false : true
                            }
                        >
                            <Gallery>
                                <GalleryItem>
                                    <InputGroup>
                                        <InputGroupText>Year 1</InputGroupText>
                                        <TextInput
                                            isRequired
                                            id="percentageOfHypervisorsMigratedOnYear1"
                                            type="number"
                                            name="percentageOfHypervisorsMigratedOnYear1"
                                            aria-label="Percentage of hypervisors migrated on year 1"
                                            className="pf-u-text-align-right"
                                            onChange={ (_value, event) => handleChange(event) }
                                            onBlur={ handleBlur }
                                            value={ values.percentageOfHypervisorsMigratedOnYear1 }
                                            isValid={
                                                (errors.percentageOfHypervisorsMigratedOnYear1
                                                    && touched.percentageOfHypervisorsMigratedOnYear1) ? false : true
                                            }
                                        />
                                        <InputGroupText>%</InputGroupText>
                                    </InputGroup>
                                </GalleryItem>
                            </Gallery>
                        </FormGroup>
                    </StackItem>
                    <StackItem isFilled={ false }>
                        <FormGroup
                            label=""
                            fieldId=""
                            helperTextInvalid={ errors.percentageOfHypervisorsMigratedOnYear2 || errors.percentageOfHypervisorsMigratedSum }
                            isValid={
                                (errors.percentageOfHypervisorsMigratedOnYear2 && touched.percentageOfHypervisorsMigratedOnYear2) ||
                                (errors.percentageOfHypervisorsMigratedSum) ? false : true
                            }
                        >
                            <Gallery>
                                <GalleryItem>
                                    <InputGroup>
                                        <InputGroupText>Year 2</InputGroupText>
                                        <TextInput
                                            isRequired
                                            id="percentageOfHypervisorsMigratedOnYear2"
                                            type="number"
                                            name="percentageOfHypervisorsMigratedOnYear2"
                                            aria-label="Percentage of hypervisors migrated on year 2"
                                            className="pf-u-text-align-right"
                                            onChange={ (_value, event) => handleChange(event) }
                                            onBlur={ handleBlur }
                                            value={ values.percentageOfHypervisorsMigratedOnYear2 }
                                            isValid={
                                                (errors.percentageOfHypervisorsMigratedOnYear2
                                                    && touched.percentageOfHypervisorsMigratedOnYear2) ? false : true
                                            }
                                        />
                                        <InputGroupText>%</InputGroupText>
                                    </InputGroup>
                                </GalleryItem>
                            </Gallery>
                        </FormGroup>
                    </StackItem>
                    <StackItem isFilled={ false }>
                        <FormGroup
                            label=""
                            fieldId=""
                            helperTextInvalid={ errors.percentageOfHypervisorsMigratedOnYear3 || errors.percentageOfHypervisorsMigratedSum }
                            isValid={
                                (errors.percentageOfHypervisorsMigratedOnYear3 && touched.percentageOfHypervisorsMigratedOnYear3) ||
                                (errors.percentageOfHypervisorsMigratedSum) ? false : true
                            }
                        >
                            <Gallery>
                                <GalleryItem>
                                    <InputGroup>
                                        <InputGroupText>Year 3</InputGroupText>
                                        <TextInput
                                            isRequired
                                            id="percentageOfHypervisorsMigratedOnYear3"
                                            type="number"
                                            name="percentageOfHypervisorsMigratedOnYear3"
                                            aria-label="Percentage of hypervisors migrated on year 3"
                                            className="pf-u-text-align-right"
                                            onChange={ (_value, event) => handleChange(event) }
                                            onBlur={ handleBlur }
                                            value={ values.percentageOfHypervisorsMigratedOnYear3 }
                                            isValid={
                                                (errors.percentageOfHypervisorsMigratedOnYear3
                                                    && touched.percentageOfHypervisorsMigratedOnYear3) ? false : true
                                            }
                                        />
                                        <InputGroupText>%</InputGroupText>
                                    </InputGroup>
                                </GalleryItem>
                            </Gallery>
                        </FormGroup>
                    </StackItem>
                </Stack>

                <ActionGroup>
                    <Button variant="primary" type="submit" isDisabled={ isSubmitting } disabled={ isSubmitting }>Create report</Button>
                    <Button variant="secondary" type="button" onClick={ this.props.handleCancel }>Cancel</Button>
                </ActionGroup>
            </Form>
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
        uploadProgress: uploadActions.uploadProgress,
        selectUploadFile: uploadActions.selectUploadFile
    }, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ReportsUpload));
