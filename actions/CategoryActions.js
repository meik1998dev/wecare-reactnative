import * as ActionTypes from './ActionTypes'

export const serviceActionPending = () => ({
    type: ActionTypes.CATEGORY_SERVICE_PENDING
})

export const serviceActionError = (error) => ({
    type: ActionTypes.CATEGORY_SERVICE_ERROR,
    error: error
})

export const serviceActionSuccess = (data) => ({
    type: ActionTypes.CATEGORY_SERVICE_SUCCESS,
    data: data
})
