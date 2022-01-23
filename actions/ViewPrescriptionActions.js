import * as ActionTypes from './ActionTypes';

export const serviceActionPending = () => ({
    type: ActionTypes.REJECT_PRESCRIPTION_PENDING
})

export const serviceActionError = (error) => ({
    type: ActionTypes.REJECT_PRESCRIPTION_ERROR,
    error: error
})

export const serviceActionSuccess = (data) => ({
    type: ActionTypes.REJECT_PRESCRIPTION_SUCCESS,
    data: data
})
