import { FormikValues } from 'formik';

export const getErrorsFromValidationError = (validationError: any) => {
    const FIRST_ERROR = 0;
    return validationError.inner.reduce((errors: any, error: any) => {
        return {
            ...errors,
            [error.path]: error.errors[FIRST_ERROR]
        };
    }, {});
};

export const validateForm = (values: FormikValues, validationSchemaFn: (values: FormikValues) => any) => {
    const validationSchema = validationSchemaFn(values);
    try {
        validationSchema.validateSync(values, { abortEarly: false });
        return {};
    } catch (error) {
        return getErrorsFromValidationError(error);
    }
};
