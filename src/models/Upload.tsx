export interface Upload {
    id?: number;
    file: File,
    reportName: string,
    reportDescription?: string | null,
    yearOverYearGrowthRatePercentage: number,
    percentageOfHypervisorsMigratedOnYear1: number,
    percentageOfHypervisorsMigratedOnYear2: number,
    percentageOfHypervisorsMigratedOnYear3: number
}
