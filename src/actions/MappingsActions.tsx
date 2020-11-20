import { getAllFlagAssessments } from '../api/mappings';
import { GenericAction } from '../models/action';

export const ActionTypes = {
  FETCH_ALL_FLAG_ASSESSMENT: 'FETCH_ALL_FLAG_ASSESSMENT',
};

export const fetchAllFlagAssessments = (): GenericAction => ({
  type: ActionTypes.FETCH_ALL_FLAG_ASSESSMENT,
  payload: getAllFlagAssessments(),
  meta: {
    noError: true,
    notifications: {},
  },
});
