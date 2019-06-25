import { uploadFile } from '../api/upload';
import { GenericAction } from '../models/action';
import { Upload } from '../models';

export const ActionTypes = {
    UPLOAD_REQUEST: 'UPLOAD_REQUEST',
    UPLOAD_PROGRESS: 'UPLOAD_PROGRESS',
    SELECT_UPLOAD_FILE: 'SELECT_UPLOAD_FILE'
};

export const uploadRequest = (upload: Upload, config = {}): GenericAction => {
    const formData = new FormData();
    formData.append('file', upload.file, upload.file.name);
    formData.append('reportName', upload.reportName);

    if (upload.reportDescription) {
        formData.append('reportDescription', upload.reportDescription);
    }

    if (upload.yearOverYearGrowthRatePercentage) {
        formData.append('yearOverYearGrowthRatePercentage', upload.yearOverYearGrowthRatePercentage.toString());
    }

    if (upload.percentageOfHypervisorsMigratedOnYear1) {
        formData.append('percentageOfHypervisorsMigratedOnYear1', upload.percentageOfHypervisorsMigratedOnYear1.toString());
    }

    if (upload.percentageOfHypervisorsMigratedOnYear2) {
        formData.append('percentageOfHypervisorsMigratedOnYear2', upload.percentageOfHypervisorsMigratedOnYear2.toString());
    }

    if (upload.percentageOfHypervisorsMigratedOnYear1) {
        formData.append('percentageOfHypervisorsMigratedOnYear3', upload.percentageOfHypervisorsMigratedOnYear3.toString());
    }

    return {
        type: ActionTypes.UPLOAD_REQUEST,
        payload: uploadFile(formData, config),
        meta: {
            file: upload.file,
            notifications: {
                rejected: {
                    variant: 'danger',
                    title: `Failed to upload file`
                }
            }
        }
    };
};

export const uploadProgress = (progress: number): GenericAction => ({
    type: ActionTypes.UPLOAD_PROGRESS,
    payload: {
        progress
    }
});

export const selectUploadFile = (file: File): GenericAction => ({
    type: ActionTypes.SELECT_UPLOAD_FILE,
    payload: {
        file
    }
});
