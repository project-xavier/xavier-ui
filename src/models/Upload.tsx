export interface Upload {
    file: File,
    success: boolean,
    error: string,
    progress: number,
    uploading: boolean
}
