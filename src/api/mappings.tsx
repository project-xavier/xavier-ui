import { AxiosPromise } from 'axios';
import { FlagAssessment } from '../models';
import ApiClient from './apiClient';

export function getFlagAssessment(flag: string): AxiosPromise<FlagAssessment> {
    return ApiClient.get<FlagAssessment>(`/mappings/flag-assessment/${flag}`);
}
