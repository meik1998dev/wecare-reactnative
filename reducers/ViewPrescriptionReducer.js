import * as Actions from '../actions/ActionTypes'
const ViewPrescriptionReducer = (state = { isLoding: false, error: undefined, data:undefined, message:undefined, status:undefined }, action) => {
    switch (action.type) {
        case Actions.REJECT_PRESCRIPTION_PENDING:
            return Object.assign({}, state, {
               isLoding: true,
            });
        case Actions.REJECT_PRESCRIPTION_ERROR:
            return Object.assign({}, state, {
                isLoding: false,
                error: action.error
            });
        case Actions.REJECT_PRESCRIPTION_SUCCESS:
            return Object.assign({}, state, {
                isLoding: false,
                status: action.data.status,
                message: action.data.message,
                data: action.data.result
            });
        default:
            return state;
    }
}

export default ViewPrescriptionReducer;