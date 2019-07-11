import { Report } from '../Report';

/**
 * The fields of this interface should match the /store/index.js
 */
export interface GlobalState {
    reportState: ReportState,
    uploadState: UploadState
}

export interface ReportState {
    /**
     * The error when fetch report/reports fails
     */
    error: string | null;

    /**
     * True when loading a list of reports or a single one
     */
    loading: boolean;

    /**
     * A Single report
     */
    report: Report | null;

    /**
     * List of reports
     */
    reports: Report[];

    /**
     * Total number of elements of reports
     */
    total: number;
}

export interface UploadState {
    /**
     * The file that is been uploaded
     */
    file: File | null,

    /**
     * True if the upload finished successfully
     */
    success: boolean | null,

    /**
     * The error message after a failure
     */
    error: string | null,

    /**
     * The current status of the upload
     */
    progress: number,

    /**
     * True if the upload started
     */
    uploading: boolean
}