import { Report } from '../Report';
import { Upload } from '../Upload';

export interface GlobalState {
    reports: ReportState,
    uploads: UploadState
}

export interface ReportState {
    error: string | null;
    total: number;
    report: Report | null;
    reports: Report[];
    loading: boolean;
}

export interface UploadState {
    uploads: Upload[]
}