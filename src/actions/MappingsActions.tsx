import { getFlagAssessment } from '../api/mappings';
import { GenericAction } from '../models/action';

export const ActionTypes = {
    FETCH_FLAG_ASSESSMENT: 'FETCH_FLAG_ASSESSMENT'
};

export const fetchFlagAssessment = (flag: string): GenericAction => ({
    type: ActionTypes.FETCH_FLAG_ASSESSMENT,
    payload: getFlagAssessment(flag),
    meta: {
        flag,
        noError: true,
        notifications: {}
    }
});
