import { Report } from './Report';
import { Upload } from './Upload';

export interface GlobalState {
    reports: {
        report: Report,
        reports: Report[];
        loading: boolean;
        error: string;
        total: number;
    },
    uploads: {
        uploads: Upload[]
    }
}
