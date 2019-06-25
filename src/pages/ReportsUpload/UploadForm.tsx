import React, { createRef } from 'react';
import {
    FormikState,
    FormikValues,
    FormikActions,
    FormikHandlers
} from 'formik';
import {
    Form,
    FormGroup,
    InputGroup,
    TextInput,
    Button,
    ButtonVariant,
    Gallery,
    GalleryItem,
    InputGroupText,
    Stack,
    StackItem,
    ActionGroup
} from '@patternfly/react-core';
import Dropzone from 'react-dropzone';

interface UploadFormProps extends FormikState<FormikValues>, FormikActions<FormikValues>, FormikHandlers {
    file: File;
    onFileSelected: Function;
    handleCancel: (e: any) => any;
}

export class UploadForm extends React.Component<UploadFormProps, { }> {

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
