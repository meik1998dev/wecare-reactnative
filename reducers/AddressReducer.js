import * as Actions from '../actions/ActionTypes'
const AddressReducer = (state = { isLoding: false, error: undefined, data:undefined, message:undefined, status:undefined, lat:0, lng:0, address:undefined }, action) => {
  switch (action.type) {
  case Actions.CREATE_ADDRESS_PENDING:
    return Object.assign({}, state, {
      isLoding: true,
    })
  case Actions.CREATE_ADDRESS_ERROR:
    return Object.assign({}, state, {
      isLoding: false,
      error: action.error
    })
  case Actions.CREATE_ADDRESS_SUCCESS:
    return Object.assign({}, state, {
      isLoding: false,
      status: action.data.status,
      message: action.data.message
    })
  case Actions.EDIT_ADDRESS_PENDING:
    return Object.assign({}, state, {
      isLoding: true,
    })
  case Actions.EDIT_ADDRESS_ERROR:
    return Object.assign({}, state, {
      isLoding: false,
      error: action.error
    })
  case Actions.EDIT_ADDRESS_SUCCESS:
    return Object.assign({}, state, {
      isLoding: false,
      status: action.data.status,
      message: action.data.message,
      data: action.data.result
    })
  case Actions.UPDATE_ADDRESS_PENDING:
    return Object.assign({}, state, {
      isLoding: true,
    })
  case Actions.UPDATE_ADDRESS_ERROR:
    return Object.assign({}, state, {
      isLoding: false,
      error: action.error
    })
  case Actions.UPDATE_ADDRESS_SUCCESS:
    return Object.assign({}, state, {
      isLoding: false,
      status: action.data.status,
      message: action.data.message
    })
  case Actions.LAT:
    return Object.assign({}, state, {
      lat: action.data,
    })
  case Actions.LNG:
    return Object.assign({}, state, {
      lng: action.data,
    })
  case Actions.ADDRESS:
    return Object.assign({}, state, {
      address: action.data,
    })
  default:
    return state
  }
}

export default AddressReducer