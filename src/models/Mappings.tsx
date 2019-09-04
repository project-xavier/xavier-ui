export interface FlagAssessment {
    id: number;
    flag: string;
    assessment: string;
}

export interface FlagAssessmentCached extends FlagAssessment {
    timeRequested: number;
}