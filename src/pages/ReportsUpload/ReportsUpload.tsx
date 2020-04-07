import React from 'react';
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
import { Link } from 'react-router-dom';
import Axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { RouterGlobalProps } from '../../models/router';
import {
    Main,
    PageHeader,
    PageHeaderTitle
} from '@redhat-cloud-services/frontend-components';
import { Upload, User } from '../../models';
import './ReportsUpload.scss';
import UploadForm from './UploadForm';
import { validateForm } from '../../Utilities/formUtils';

interface FormValues {
    file: File | undefined;
    reportName: string;
    reportDescription: string;
    yearOverYearGrowthRatePercentage: number;
    percentageOfHypervisorsMigratedOnYear1: number;
    percentageOfHypervisorsMigratedOnYear2: number;
    percentageOfHypervisorsMigratedOnYear3: number;
    percentageOfHypervisorsMigratedSum: number // Sum of year1, year2, and year3
}

interface StateToProps {
    user: User | null;
    file: File | null;
    success: boolean | null;
    error: string | null;
    progress: number;
    uploading: boolean
}

interface DispatchToProps {
    uploadProgress: (progress: number) => void;
    uploadRequest: (upload: Upload, config: {}) => void;
    selectUploadFile: (file: File) => void;
    resetUploadFile: () => void;
    updateUser: (user: User) => void;
}

export interface Props extends StateToProps, DispatchToProps, RouterGlobalProps {
}

interface State {
    showForm: boolean;
    timeoutToRedirect: number;
    cancelUploadSource: any;
}

const initialFormValue: FormValues = {
    file: undefined,
    reportName: '',
    reportDescription: '',
    yearOverYearGrowthRatePercentage: 5,
    percentageOfHypervisorsMigratedOnYear1: 50,
    percentageOfHypervisorsMigratedOnYear2: 30,
    percentageOfHypervisorsMigratedOnYear3: 20,
    percentageOfHypervisorsMigratedSum: 90
};

const formValidationSchema = (values: FormValues) => {
    return Yup.object().shape({
        file: Yup.mixed()
        .required('File is mandatory')
        .test('validFileSize', 'File size must not exceed 1GB', () => {
            if (values.file) {
                const fileSize = values.file.size;
                return fileSize > 0 && fileSize <= 1073741824;
            }

            // If there is no file then 'validFileSize' is valid
            return true;
        }),
        reportName: Yup.string().trim()
        .min(3, 'Report name must contain at least 3 characters ')
        .max(250, 'Report name must contain fewer than 250 characters')
        .required('Report name is mandatory'),
        reportDescription: Yup.string().trim()
        .max(250, 'Report description must contain fewer than 250 characters'),
        yearOverYearGrowthRatePercentage: Yup.number()
        .typeError('Invalid number')
        .min(0, 'Value must be greater than or equal to 0')
        .max(99999, 'Value must be less than or equal to 99999')
        .required('Growth rate percentage is mandatory'),
        percentageOfHypervisorsMigratedOnYear1: Yup.number()
        .typeError('Invalid number')
        .min(0, 'Value must be greater than or equal to 0')
        .max(100, 'Value must be less than or equal to 100')
        .required('Percentage of hypervisors migrated is mandatory'),
        percentageOfHypervisorsMigratedOnYear2: Yup.number()
        .typeError('Invalid number')
        .min(0, 'Value must be greater than or equal to 0')
        .max(100, 'Value must be less than or equal to 100')
        .required('Percentage of hypervisors migrated is mandatory'),
        percentageOfHypervisorsMigratedOnYear3: Yup.number()
        .typeError('Invalid number')
        .min(0, 'Value must be greater than or equal to 0')
        .max(100, 'Value must be less than or equal to 100')
        .required('Percentage of hypervisors migrated is mandatory'),
        percentageOfHypervisorsMigratedSum: Yup.number()
        .typeError('Invalid number')
        .min(0, 'Value must be greater than or equal to 0')
        .max(100, 'Value must be less than or equal to 100')
        .test('validSum', 'The total percentage must not exceed 100', () => {
            const sum = values.percentageOfHypervisorsMigratedOnYear1 +
                values.percentageOfHypervisorsMigratedOnYear2 +
                values.percentageOfHypervisorsMigratedOnYear3;
            return sum >= 0 && sum <= 100;
        })
    });
};

class ReportsUpload extends React.Component<Props, State> {

    public redirectTimer: any;
    public beforeUnloadHandler: any;

    constructor(props: Props) {
        super(props);

        this.state = {
            showForm: true,
            timeoutToRedirect: 3,
            cancelUploadSource: Axios.CancelToken.source()
        };

        this.redirectTimer = null;
    }

    public componentDidMount() {
        this.beforeUnloadHandler = window.addEventListener('beforeunload', (event) => {
            if (this.props.uploading) {
                event.preventDefault();
                return event.returnValue = 'Are you sure you want to close? The upload has not finished yet';
            }

            return event;
        });
    }

    public componentDidUpdate(_prevProps: Props, prevState: State) {
        if (this.props.success && prevState.timeoutToRedirect !== 0 && this.state.timeoutToRedirect === 0) {
            this.props.history.push('/reports');
        }
    }

    public componentWillUnmount() {
        // Remove handler
        window.removeEventListener('beforeunload', this.beforeUnloadHandler);

        // Clear timer
        if (this.redirectTimer) {
            clearInterval(this.redirectTimer);
        }

        // Reset upload file redux stage
        this.props.resetUploadFile();
    }

    /**
     * Called by "Close modal" or by the "Cancel button"
     */
    public handleCloseModel = () => {
        const { uploading, user } = this.props;

        if (!uploading) {
            if (user && user.firstTimeCreatingReports) {
                this.props.history.push('/getting-started');
            } else {
                this.props.history.push('/reports');
            }
        }
    };

    public actionsOnUploadSuccess = () => {
        const { timeoutToRedirect } = this.state;

        this.startRedirectTimer();

        return (
            <Button type="button" variant={ ButtonVariant.primary } onClick={ this.handleCloseModel }> Closing in { timeoutToRedirect } </Button>
        );
    };

    public startRedirectTimer = () => {
        if (this.redirectTimer === null && this.state.timeoutToRedirect > 0) {
            this.redirectTimer = setInterval(this.redirectCountDown, 1000);
        }
    };

    public redirectCountDown = () => {
        const timeoutToRedirect = this.state.timeoutToRedirect - 1;
        this.setState({
            timeoutToRedirect
        });
    };

    public handleFormSubmit = (values: FormValues) => {
        this.setState({
            showForm: false
        });

        if (!this.props.file) {
            throw Error('No file for handling submit');
        }

        const upload: Upload = {
            file: this.props.file,
            reportName: values.reportName.trim(),
            reportDescription: values.reportDescription ? values.reportDescription.trim() : '',
            yearOverYearGrowthRatePercentage: values.yearOverYearGrowthRatePercentage,
            percentageOfHypervisorsMigratedOnYear1: values.percentageOfHypervisorsMigratedOnYear1,
            percentageOfHypervisorsMigratedOnYear2: values.percentageOfHypervisorsMigratedOnYear2,
            percentageOfHypervisorsMigratedOnYear3: values.percentageOfHypervisorsMigratedOnYear3
        };

        const config = {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            },
            cancelToken: this.state.cancelUploadSource.token,
            onUploadProgress: (progressEvent: any) => {
                const progress: number = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                this.props.uploadProgress(progress);
            }
        };

        this.props.uploadRequest(upload, config);
    };

    public handleCancelUpload = () => {
        this.state.cancelUploadSource.cancel('Upload canceled by the user.');
    };

    public onFileSelected = (files: File[]): void => {
        const selectedFile = files[0];
        if (selectedFile) {
            this.props.selectUploadFile(selectedFile);
        }
    };

    public renderProgress() {
        let title: string;
        let secondaryAction;
        if (this.props.error) {
            title = 'An error ocurred while uploading your file';
            secondaryAction = (
                <Link to={ '/reports/upload' } className="pf-c-button pf-m-secondary" target="_self">Retry</Link>
            );
        } else {
            if (this.props.success) {
                title = 'Upload finished successfully';
                secondaryAction = this.actionsOnUploadSuccess();
            } else {
                title = 'Upload in progress';
                secondaryAction = (
                    <Button onClick={ this.handleCancelUpload } variant={ ButtonVariant.link }>Cancel</Button>
                );
            }
        }

        return (
            <Bullseye>
                <EmptyState variant={ EmptyStateVariant.full }>
                    <EmptyStateIcon icon={ VolumeIcon } />
                    <Title headingLevel={ TitleLevel.h5 } size="lg">{ title }</Title>
                    <div className="pf-c-empty-state__body">
                        <Progress
                            value={ this.props.progress }
                            measureLocation={ ProgressMeasureLocation.outside }
                            variant={ this.props.error ? ProgressVariant.danger : ProgressVariant.info }
                        />
                    </div>
                    <EmptyStateBody>
                        Please, wait until your file is uploaded. Then we will redirect you to the next page.
                    </EmptyStateBody>
                    <EmptyStateSecondaryActions>
                        { secondaryAction }
                    </EmptyStateSecondaryActions>
                </EmptyState>
            </Bullseye>
        );
    }

    public renderForm() {
        const validate = (values: any): void => {
            return validateForm(values, formValidationSchema);
        };

        return (
            <Formik
                initialValues={ initialFormValue }
                validate={ validate }
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

    public render() {
        const { success, user } = this.props;
        const { showForm } = this.state;
        if (success && user && user.firstTimeCreatingReports) {
            const { updateUser } = this.props;
            updateUser({ firstTimeCreatingReports: false });
        }

        return (
            <React.Fragment>
                <PageHeader>
                    <PageHeaderTitle title='Reports' />
                </PageHeader>
                <Main>
                    <Modal
                        title='Report options'
                        isSmall={ showForm }
                        isLarge={ !showForm }
                        isOpen={ true }
                        onClose={ this.handleCloseModel }
                        ariaDescribedById="Report options"
                        actions={ [] }
                    >
                        { this.state.showForm ? this.renderForm() : this.renderProgress() }
                    </Modal>
                </Main>
            </React.Fragment>
        );
    }
}

export default ReportsUpload;
