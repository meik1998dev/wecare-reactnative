import * as Actions from '../actions/ActionTypes'
const CreatePrescriptionReducer = (state = { address:undefined, isLoding: false, error: undefined, data:undefined, message:undefined, status:undefined }, action) => {
    switch (action.type) {
        case Actions.CREATE_PRESCRIPTION_PENDING:
            return Object.assign({}, state, {
               isLoding: true,
            });
        case Actions.CREATE_PRESCRIPTION_ERROR:
            return Object.assign({}, state, {
                isLoding: false,
                error: action.error
            });
        case Actions.CREATE_PRESCRIPTION_SUCCESS:
            return Object.assign({}, state, {
                isLoding: false,
                status: action.data.status,
                message: action.data.message,
                data: action.data.result,
                address_id:undefined,
                address:undefined
            });
        
        default:
            return state;
    }
}

export default CreatePrescriptionReducer;