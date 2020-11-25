import { AxiosPromise } from 'axios';
import { User } from '../models';
import ApiClient from './apiClient';

export function getUser(): AxiosPromise<User> {
  return ApiClient.get<User>(`/user`);
}
