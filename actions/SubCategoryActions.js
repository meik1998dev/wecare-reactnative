import * as ActionTypes from './ActionTypes';

export const serviceActionPending = () => ({
    type: ActionTypes.SUBCATEGORY_SERVICE_PENDING
})

export const serviceActionError = (error) => ({
    type: ActionTypes.SUBCATEGORY_SERVICE_ERROR,
    error: error
})

export const serviceActionSuccess = (data) => ({
    type: ActionTypes.SUBCATEGORY_SERVICE_SUCCESS,
    data: data
})
