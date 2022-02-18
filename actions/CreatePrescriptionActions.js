import * as ActionTypes from './ActionTypes'

export const serviceActionPending = () => ({
  type: ActionTypes.CREATE_PRESCRIPTION_PENDING
})

export const serviceActionError = (error) => ({
  type: ActionTypes.CREATE_PRESCRIPTION_ERROR,
  error: error
})

export const serviceActionSuccess = (data) => ({
  type: ActionTypes.CREATE_PRESCRIPTION_SUCCESS,
  data: data
})