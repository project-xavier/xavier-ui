export interface Upload {
    file: File,
    success: boolean | null,
    error: string | null,
    progress: number,
    uploading: boolean
}
