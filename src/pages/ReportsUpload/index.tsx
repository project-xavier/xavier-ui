import React from 'react';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import {
    Button,
    Modal,
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
    EmptyStateSecondaryActions
} from '@patternfly/react-core';
import { VolumeIcon } from '@patternfly/react-icons';
import { Formik } from 'formik';
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
import { UploadForm } from './UploadForm';

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
            percentageOfHypervisorsMigratedOnYear2: Yup.number()
            .min(0, 'Vaaslue must be greater than or equal to 0')
            .max(100, 'Value must be less than or equal to 100')
            .required('Percentage of hypervisors migrated is mandatory'),
            percentageOfHypervisorsMigratedOnYear3: Yup.number()
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
