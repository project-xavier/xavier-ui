export interface FlagAssessmentModel {
    flag: string;
    label: string;
    flagAssessmentOSModels: FlagAssessmentOSModel[]
}

export interface FlagAssessmentOSModel {
    osName: string | undefined;
    assessment: string;
}
