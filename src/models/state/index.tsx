import { Report, ReportWorkloadMigrationSummary, ReportInitialSavingEstimation } from '../Report';
import { User } from '../User';

/**
 * The fields of this interface should match the /store/index.js
 */
export interface GlobalState {
    reportState: ReportState,
    uploadState: UploadState,
    userState: UserState,
    dialogDeleteState: DialogDeleteState
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
    reportMigrationSummary: ReportWorkloadMigrationSummary | null;
    reportInitialSavingEstimation: ReportInitialSavingEstimation | null;

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

export interface UserState {
    user: User | null;
    error: string | null;
    loading: boolean;
}

export interface DialogDeleteState {
    isOpen: boolean;
    isProcessing: boolean;
    isError: boolean;
    name: string;
    type: string;
    onDelete: () => any;
    onCancel: () => any;
  };
