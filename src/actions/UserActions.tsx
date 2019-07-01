import { getUser } from '../api/user';
import { GenericAction } from '../models/action';
import { User } from '../models';

export const ActionTypes = {
    FETCH_USER: 'FETCH_USER',
    UPDATE_USER: 'UPDATE_USER'
};

export const fetchUser = (): GenericAction => ({
    type: ActionTypes.FETCH_USER,
    payload: getUser(),
    meta: {
        notifications: {
            rejected: {
                variant: 'danger',
                title: `Failed to load user`
            }
        }
    }
});

export const updateUser = (user: User): GenericAction => ({
    type: ActionTypes.UPDATE_USER,
    payload: {
        user
    }
});
