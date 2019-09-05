import {
    getFlagAssessment,
    getAllFlagAssessments
} from '../api/mappings';
import { GenericAction } from '../models/action';

export const ActionTypes = {
    FETCH_FLAG_ASSESSMENT: 'FETCH_FLAG_ASSESSMENT',
    FETCH_ALL_FLAG_ASSESSMENT: 'FETCH_ALL_FLAG_ASSESSMENT'
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

export const fetchAllFlagAssessments = (): GenericAction => ({
    type: ActionTypes.FETCH_ALL_FLAG_ASSESSMENT,
    payload: getAllFlagAssessments(),
    meta: {
        noError: true,
        notifications: {}
    }
});
