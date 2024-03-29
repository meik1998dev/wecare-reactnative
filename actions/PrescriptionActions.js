import * as ActionTypes from './ActionTypes'

export const serviceActionPending = () => ({
  type: ActionTypes.PRESCRIPTION_LIST_PENDING
})

export const serviceActionError = (error) => ({
  type: ActionTypes.PRESCRIPTION_LIST_ERROR,
  error: error
})

export const serviceActionSuccess = (data) => ({
  type: ActionTypes.PRESCRIPTION_LIST_SUCCESS,
  data: data
})
