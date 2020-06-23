import React from 'react';
import {
    FormikState,
    FormikValues,
    FormikHandlers} from 'formik';
import {
    Form,
    FormGroup,
    InputGroup,
    TextInput,
    Button,
    ButtonVariant,
    InputGroupText,
    Stack,
    StackItem,
    ActionGroup,
    Grid,
    GridItem
} from '@patternfly/react-core';
import Dropzone from 'react-dropzone';
import './UploadForm.scss';
import { getFilenameWithoutExtensions } from '../../Utilities/extractUtils';

export interface UploadFormProps extends FormikState<FormikValues>, FormikHandlers {
    file: File | null;
    onFileSelected: (files: File[]) => void;
    handleCancel: (e: any) => any;

    isValid: boolean;
    handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void;
    setFieldValue(field: keyof FormikValues & string, value: any, shouldValidate?: boolean): void;
    handleBlur(e: React.FocusEvent<any>): void;
    handleChange(e: React.ChangeEvent<any>): void;
}

class UploadForm extends React.Component<UploadFormProps, { }> {

    constructor(props: UploadFormProps) {
        super(props);
    }

    public componentDidMount() {
        this.updateFieldValues();
    }

    public componentDidUpdate(prevProps: any) {
        if (prevProps.file !== this.props.file) {
            this.updateFieldValues();
        }
    }

    public updateFieldValues() {
        if (this.props.file) {
            const file: File = this.props.file;
            setTimeout(() => {
                this.props.setFieldValue('file', file);
                if (!this.props.values.reportName) {
                    const fileNameWithoutExtension = getFilenameWithoutExtensions(file.name);
                    this.props.setFieldValue('reportName', fileNameWithoutExtension);
                }
            }, 0);
        }
    }

    public render() {
        const {
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting
        } = this.props;

        const onDrop = (files: File[]): void => {
            this.props.onFileSelected(files);
        };
        const customHandleChange = (_value: any, event: any) => {
            handleChange(event);
        };

        return (
            <Form onSubmit={ handleSubmit }>
                <FormGroup
                    isRequired={true}
                    label="Inventory data file"
                    fieldId="file"
                    helperTextInvalid={ errors.file }
                    validated={
                        (errors.file) ? "error" : "default"
                    }
                >
                    <Dropzone
                        onDrop={ onDrop }
                        noClick={ true }
                        noKeyboard={ true }
                        multiple={ false }
                    >
                        { ({ getRootProps, getInputProps, open }) => {
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
                                                value={ values.file ? values.file.name : '' }
                                                validated={
                                                    (errors.file && touched.file) ? "error" : "default"
                                                } />
                                            <Button
                                                variant={ ButtonVariant.secondary }
                                                aria-label="Browse a file to upload"
                                                onClick={ open }
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
                    isRequired={true}
                    label="Report name"
                    fieldId="reportName"
                    helperTextInvalid={ errors.reportName }
                    validated={
                        (errors.reportName && touched.reportName) ? "error" : "default"
                    }
                >
                    <TextInput
                        isRequired={true}
                        type="text"
                        id="reportName"
                        name="reportName"
                        aria-describedby="Report name"
                        onChange={ customHandleChange }
                        onBlur={ handleBlur }
                        value={ values.reportName }
                        validated={
                            (errors.reportName && touched.reportName) ? "error" : "default"
                        }
                    />
                </FormGroup>
                <FormGroup
                    label="Report description"
                    fieldId="reportDescription"
                    helperTextInvalid={ errors.reportDescription }
                    validated={ (errors.reportDescription && touched.reportDescription) ? "error" : "default" }
                >
                    <TextInput
                        type="text"
                        id="reportDescription"
                        name="reportDescription"
                        aria-describedby="Report description"
                        onChange={ customHandleChange }
                        onBlur={ handleBlur }
                        value={ values.reportDescription }
                        validated={
                            (errors.reportDescription && touched.reportDescription) ? "error" : "default"
                        }
                    />
                </FormGroup>
                <FormGroup
                    isRequired={true}
                    label="Year-over-year growth rate for new hypervisors"
                    fieldId="yearOverYearGrowthRatePercentage"
                    helperTextInvalid={ errors.yearOverYearGrowthRatePercentage }
                    validated={
                        (errors.yearOverYearGrowthRatePercentage && touched.yearOverYearGrowthRatePercentage) ? "error" : "default"
                    }
                >
                    <Grid md={3}>
                        <GridItem>
                            <InputGroup>
                                <TextInput
                                    isRequired={true}
                                    id="yearOverYearGrowthRatePercentage"
                                    type="number"
                                    name="yearOverYearGrowthRatePercentage"
                                    aria-describedby="Year-over-year growth rate for new hypervisors"
                                    className="pf-u-text-align-right"
                                    onChange={ customHandleChange }
                                    onBlur={ handleBlur }
                                    value={ values.yearOverYearGrowthRatePercentage }
                                    validated={
                                        (errors.yearOverYearGrowthRatePercentage && touched.yearOverYearGrowthRatePercentage) ? "error" : "default"
                                    }
                                />
                                <InputGroupText>%</InputGroupText>
                            </InputGroup>
                        </GridItem>
                    </Grid>
                </FormGroup>
                {/* Add  pf-sm-gutter manually until https://github.com/patternfly/patternfly-react/issues/4062 is solved*/}
                <Stack hasGutter={true} className="pf-sm-gutter">
                    <StackItem isFilled={ false }>
                        <label className="pf-c-form__label">
                            <span className="pf-c-form__label-text">Percentage of hypervisors migrated each year</span>
                        </label>
                    </StackItem>
                    <StackItem isFilled={ false } className="upload-form-subform-margin-left">
                        <FormGroup
                            label="Year1"
                            fieldId="percentageOfHypervisorsMigratedOnYear1"
                            helperTextInvalid={ errors.percentageOfHypervisorsMigratedOnYear1 || errors.percentageOfHypervisorsMigratedSum }
                            validated={
                                (errors.percentageOfHypervisorsMigratedOnYear1 && touched.percentageOfHypervisorsMigratedOnYear1) ||
                                (errors.percentageOfHypervisorsMigratedSum) ? "error" : "default"
                            }
                        >
                            <Grid md={3}>
                                <GridItem>
                                    <InputGroup>
                                        <TextInput
                                            isRequired={true}
                                            id="percentageOfHypervisorsMigratedOnYear1"
                                            type="number"
                                            name="percentageOfHypervisorsMigratedOnYear1"
                                            aria-label="Percentage of hypervisors migrated on year 1"
                                            className="pf-u-text-align-right"
                                            onChange={ customHandleChange }
                                            onBlur={ handleBlur }
                                            value={ values.percentageOfHypervisorsMigratedOnYear1 }
                                            validated={
                                                (errors.percentageOfHypervisorsMigratedOnYear1
                                                    && touched.percentageOfHypervisorsMigratedOnYear1) ? "error" : "default"
                                            }
                                        />
                                        <InputGroupText>%</InputGroupText>
                                    </InputGroup>
                                </GridItem>
                            </Grid>
                        </FormGroup>
                    </StackItem>
                    <StackItem isFilled={ false } className="upload-form-subform-margin-left">
                        <FormGroup
                            label="Year 2"
                            fieldId="percentageOfHypervisorsMigratedOnYear2"
                            helperTextInvalid={ errors.percentageOfHypervisorsMigratedOnYear2 || errors.percentageOfHypervisorsMigratedSum }
                            validated={
                                (errors.percentageOfHypervisorsMigratedOnYear2 && touched.percentageOfHypervisorsMigratedOnYear2) ||
                                (errors.percentageOfHypervisorsMigratedSum) ? "error" : "default"
                            }
                        >
                            <Grid md={3}>
                                <GridItem>
                                    <InputGroup>
                                        <TextInput
                                            isRequired={true}
                                            id="percentageOfHypervisorsMigratedOnYear2"
                                            type="number"
                                            name="percentageOfHypervisorsMigratedOnYear2"
                                            aria-label="Percentage of hypervisors migrated on year 2"
                                            className="pf-u-text-align-right"
                                            onChange={ customHandleChange }
                                            onBlur={ handleBlur }
                                            value={ values.percentageOfHypervisorsMigratedOnYear2 }
                                            validated={
                                                (errors.percentageOfHypervisorsMigratedOnYear2
                                                    && touched.percentageOfHypervisorsMigratedOnYear2) ? "error" : "default"
                                            }
                                        />
                                        <InputGroupText>%</InputGroupText>
                                    </InputGroup>
                                </GridItem>
                            </Grid>
                        </FormGroup>
                    </StackItem>
                    <StackItem isFilled={ false } className="upload-form-subform-margin-left">
                        <FormGroup
                            label="Year 3"
                            fieldId="percentageOfHypervisorsMigratedOnYear3"
                            helperTextInvalid={ errors.percentageOfHypervisorsMigratedOnYear3 || errors.percentageOfHypervisorsMigratedSum }
                            validated={
                                (errors.percentageOfHypervisorsMigratedOnYear3 && touched.percentageOfHypervisorsMigratedOnYear3) ||
                                (errors.percentageOfHypervisorsMigratedSum) ? "error" : "default"
                            }
                        >
                            <Grid md={3}>
                                <GridItem>
                                    <InputGroup>
                                        <TextInput
                                            isRequired={true}
                                            id="percentageOfHypervisorsMigratedOnYear3"
                                            type="number"
                                            name="percentageOfHypervisorsMigratedOnYear3"
                                            aria-label="Percentage of hypervisors migrated on year 3"
                                            className="pf-u-text-align-right"
                                            onChange={ customHandleChange }
                                            onBlur={ handleBlur }
                                            value={ values.percentageOfHypervisorsMigratedOnYear3 }
                                            validated={
                                                (errors.percentageOfHypervisorsMigratedOnYear3
                                                    && touched.percentageOfHypervisorsMigratedOnYear3) ? "error" : "default"
                                            }
                                        />
                                        <InputGroupText>%</InputGroupText>
                                    </InputGroup>
                                </GridItem>
                            </Grid>
                        </FormGroup>
                    </StackItem>
                </Stack>

                <ActionGroup>
                    <Button variant="primary" type="submit" isDisabled={ isSubmitting } disabled={ isSubmitting }>
                        Create report
                    </Button>
                    <Button variant="secondary" type="button" onClick={ this.props.handleCancel }>Cancel</Button>
                </ActionGroup>
            </Form>
        );
    }
}

export default UploadForm;
