import { AxiosPromise } from 'axios';
import { FlagAssessmentModel } from '../models';
import ApiClient from './apiClient';

export function getAllFlagAssessments(): AxiosPromise<FlagAssessmentModel[]> {
  return ApiClient.get<FlagAssessmentModel[]>('/mappings/flag-assessment');
}
