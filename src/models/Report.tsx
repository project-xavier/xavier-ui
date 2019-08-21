export interface SearchResult<T> {
    totalElements: number;
    content: T[];
}

export interface Report {
    id: number;
    reportName: string;
    reportDescription: string;
    payloadName: string;
    inserted: number;
    lastUpdate: number;
    status: 'CREATED' | 'IN_PROGRESS' | 'FAILED';
}

export interface ReportWorkloadSummary {
    summaryModels: Summary[];
    complexityModel: ComplexityModel;
    recommendedTargetsIMSModel: RecommendedTargetsIMSModel;
    workloadOsTypesDetectedModel: WorkloadOsTypesDetectedModel;
    scanRunModels: ScanRunModel[];
}

export interface Summary {
    provider: string;
    product: string;
    version: string;
    hosts: number;
    sockets: number;
    clusters: number;
    vms: number;
}

export interface ComplexityModel {
    unknown: number;
    difficult: number;
    medium: number;
    easy: number;
}

export interface RecommendedTargetsIMSModel {
    total: number;
    rhv: number;
    osp: number;
    rhel: number;
}

export interface WorkloadOsTypesDetectedModel {
    rhel: number;
    sles: number;
    windows: number;
    oel: number;
}

export interface ScanRunModel {
    target: string;
    type: string;
    date: number;
}

export interface WorkloadDetected {
    workload: string;
    osName: string;
    clusters: number;
    vms: number;
}

export interface Flag {
    workload: string;
    flag: string;
    assessment: string;
    osName: string;
    clusters: number;
    vms: number;
}

export interface ReportInitialSavingEstimation {
    id: number;
    customerId: string;
    fileName: string;
    creationDate: Date;
    environmentModel: EnvironmentModel;
    sourceCostsModel: SourceCostsModel;
    sourceRampDownCostsModel: SourceRampDownCostsModel;
    rhvRampUpCostsModel: RHVRampUpCostsModel;
    rhvYearByYearCostsModel: RHVYearByYearCostsModel;
    rhvSavingsModel: RHVSavingsModel;
    rhvAdditionalContainerCapacityModel: RHVAdditionalContainerCapacityModel;
    rhvOrderFormModel: RHVOrderFormModel;
}

export interface EnvironmentModel {
    sourceProductIndicator: number;
    hypervisors: number;
    year1Hypervisor: number;
    year2Hypervisor: number;
    year3Hypervisor: number;
    growthRatePercentage: number;
}

export interface SourceCostsModel {
    sourceLicenseValue?: number;
    sourceMaintenanceValue?: number;
    year1Server?: number;
    year1SourceValue?: number;
    year1SourceMaintenanceValue?: number;
    year2Server?: number;
    year2SourceValue?: number;
    year2SourceMaintenanceValue?: number;
    year3Server?: number;
    year3SourceValue?: number;
    year3SourceMaintenanceValue?: number;
    totSourceValue?: number;
    totSourceMaintenanceValue?: number;
    totalSourceValue?: number;
    sourceNewELAIndicator?: number;
    sourceNewHighValue?: number;
    sourceNewLikelyValue?: number;
    sourceNewLowValue?: number;
    sourceRenewHighValue: number;
    sourceRenewLikelyValue: number;
    sourceRenewLowValue: number;
}

export interface SourceRampDownCostsModel {
    year1ServersOffSource?: number;
    year1SourceActiveLicense?: number;
    year1SourcePaidMaintenance?: number;
    year1SourceMaintenancePerServerValue?: number;
    year1SourceMaintenanceTotalValue: number;
    year2ServersOffSource?: number;
    year2SourceActiveLicense?: number;
    year2SourcePaidMaintenance?: number;
    year2SourceMaintenancePerServerValue?: number;
    year2SourceMaintenanceTotalValue: number;
    year3ServersOffSource?: number;
    year3SourceActiveLicense?: number;
    year3SourcePaidMaintenance?: number;
    year3SourceMaintenancePerServerValue?: number;
    year3SourceMaintenanceTotalValue: number;
}

export interface RHVRampUpCostsModel {
    year1RhvServers?: number;
    year1RhvCompSubs?: number;
    year1RhvPaidSubs?: number;
    year1RhvPerServerValue?: number;
    year1RhvTotalValue: number;
    year1RhvServersGrowth?: number;
    year1RhvCompSubsGrowth?: number;
    year1RhvPaidSubsGrowth?: number;
    year1RhvPerServerGrowthValue?: number;
    year1RhvTotalGrowthValue?: number;
    year1RhvGrandTotalGrowthValue: number;
    rhvSwitchLearningSubsValue: number;
    rhvSwitchConsultValue: number;
    rhvSwitchTAndEValue: number;
    year2RhvServers?: number;
    year2RhvCompSubs?: number;
    year2RhvPaidSubs?: number;
    year2RhvPerServerValue?: number;
    year2RhvTotalValue: number;
    year2RhvServersGrowth?: number;
    year2RhvCompSubsGrowth?: number;
    year2RhvPaidSubsGrowth?: number;
    year2RhvPerServerGrowthValue?: number;
    year2RhvTotalGrowthValue?: number;
    year2RhvGrandTotalGrowthValue: number;
    year3RhvServers?: number;
    year3RhvCompSubs?: number;
    year3RhvPaidSubs?: number;
    year3RhvPerServerValue?: number;
    year3RhvTotalValue: number;
    year3RhvServersGrowth?: number;
    year3RhvCompSubsGrowth?: number;
    year3RhvPaidSubsGrowth?: number;
    year3RhvPerServerGrowthValue?: number;
    year3RhvTotalGrowthValue?: number;
    year3RhvGrandTotalGrowthValue: number;
}

export interface RHVYearByYearCostsModel {
    year1RhvGrandTotalValue: number;
    year2RhvGrandTotalValue: number;
    year3RhvGrandTotalValue: number;
    year1RhvBudgetFreedHighValue: number;
    year1RhvBudgetFreedLikelyValue: number;
    year1RhvBudgetFreedLowValue: number;
    year2RhvBudgetFreedHighValue: number;
    year2RhvBudgetFreedLikelyValue: number;
    year2RhvBudgetFreedLowValue: number;
    year3RhvBudgetFreedHighValue: number;
    year3RhvBudgetFreedLikelyValue: number;
    year3RhvBudgetFreedLowValue: number;
}

export interface RHVSavingsModel {
    rhvSaveHighValue: number;
    rhvSaveLikelyValue: number;
    rhvSaveLowValue: number;
    rhvSaveFromValue: number;
    rhvSaveToValue: number;
}

export interface RHVAdditionalContainerCapacityModel {
    rhvContainerHigh: number;
    rhvContainerLikely: number;
    rhvContainerLow: number;
    rhvContainerFrom: number;
    rhvContainerTo: number;
}

export interface RHVOrderFormModel {
    year1RhvOrderSku: number;
    year1RhvOrder: number;
    year1RhvOrderConsult: number;
    year1RhvOrderTAndE: number;
    year1RhvOrderLearningSubs: number;
    year1RhvOrderListValue: number;
    year1RhvOrderConsultListValue: number;
    year1RhvOrderTAndEValue: number;
    year1RhvOrderLearningSubsListValue: number;
    year1RhvOrderDiscountValue: number;
    year1RhvOrderConsultDiscountValue: number;
    year1RhvOrderTAndEDiscountValue: number;
    year1RhvOrderLearningSubsDiscountValue: number;
    year1RhvOrderTotalValue: number;
    year1RhvOrderConsultTotalValue: number;
    year1RhvOrderTAndETotalValue: number;
    year1RhvOrderLearningSubsTotalValue: number;
    year1RhvOrderGrandTotal: number;
    year2RhvOrderSku: number;
    year2RhvOrder: number;
    year2RhvOrderListValue: number;
    year2RhvOrderDiscountValue: number;
    year2RhvOrderTotalValue: number;
    year2RhvOrderGrandTotal: number;
    year3RhvOrderSku: number;
    year3RhvOrder: number;
    year3RhvOrderListValue: number;
    year3RhvOrderDiscountValue: number;
    year3RhvOrderTotalValue: number;
    year3RhvOrderGrandTotal: number;
}

export interface ReportWorkloadInventory {
    provider: string;
    datacenter: string;
    cluster: string;
    vmName: string;
    workloads: string[];
    osName: string;
    osDescription: string;
    complexity: string;
    recommendedTargetsIMS: string[];
    flagsIMS: string[];
    diskSpace: number;
    memory: number;
    cpuCores: number;
}
