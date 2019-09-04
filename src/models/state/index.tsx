import {
    Report,
    ReportWorkloadSummary,
    ReportInitialSavingEstimation,
    ReportWorkloadInventory,
    WorkloadModel,
    FlagModel,
    WorkloadInventoryReportFiltersModel
} from '../Report';
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

export interface ObjectFetchStatus {
    error: string | null;
    status: 'none' | 'inProgress' | 'complete';
}

export interface ReportState {
    report: Report | null;
    reportFetchStatus: ObjectFetchStatus;

    reports: {
        total: number;
        items: Report[];
    };
    reportsFetchStatus: ObjectFetchStatus;

    reportWorkloadSummary: ReportWorkloadSummary | null;
    reportWorkloadSummaryFetchStatus: ObjectFetchStatus;
    reportWorkloadsDetected: {
        total: number;
        items: WorkloadModel[]
    };
    reportWorkloadsDetectedFetchStatus: ObjectFetchStatus;
    reportFlags: {
        total: number;
        items: FlagModel[]
    };
    reportFlagsFetchStatus: ObjectFetchStatus;

    reportInitialSavingEstimation: ReportInitialSavingEstimation | null;
    reportInitialSavingEstimationFetchStatus: ObjectFetchStatus;

    reportWorkloadInventory: {
        total: number;
        items: ReportWorkloadInventory[]
    };
    reportWorkloadInventoryFetchStatus: ObjectFetchStatus;
    reportWorkloadInventoryCSVFetchStatus: ObjectFetchStatus;

    reportWorkloadInventoryAvailableFilters: WorkloadInventoryReportFiltersModel | null;
    reportWorkloadInventoryAvailableFiltersFetchStatus: ObjectFetchStatus;
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
    userFetchStatus: ObjectFetchStatus;
}

export type DialogDeleteState = Readonly<{
    isOpen: boolean;
    isProcessing: boolean;
    isError: boolean;
    name: string;
    type: string;
    onDelete: () => void;
    onCancel: () => void;
}>;
