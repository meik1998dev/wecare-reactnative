import * as ActionTypes from './ActionTypes'

export const serviceActionPending = () => ({
  type: ActionTypes.VENDOR_SERVICE_PENDING
})

export const serviceActionError = (error) => ({
  type: ActionTypes.VENDOR_SERVICE_ERROR,
  error: error
})

export const serviceActionSuccess = (data) => ({
  type: ActionTypes.VENDOR_SERVICE_SUCCESS,
  data: data
})
