import * as Actions from '../actions/ActionTypes'
const CartReducer = (state = { isLoding: false, sub_total:0, delivery_charge:0, promo:undefined, promo_id:0, tax:0, total_amount:0, promo_amount:0, address:0, delivery_date:undefined, current_vendor:0, product_vendor:0 }, action) => {
    switch (action.type) {
    case Actions.CALCULATE_PRICING:
        return Object.assign({}, state, {
            isLoding: true,
        })
    case Actions.DISABLE_LOADING:
        return Object.assign({}, state, {
            isLoding: false,
        })
    case Actions.SUB_TOTAL:
        return Object.assign({}, state, {
            sub_total: action.data
        })
    case Actions.DELIVERY_CHARGE:
        return Object.assign({}, state, {
            delivery_charge: action.data
        }) 
    case Actions.PROMO:
        return Object.assign({}, state, {
            promo: action.data,
            promo_id: action.data.id
        })
    case Actions.TOTAL:
        return Object.assign({}, state, {
            promo_amount: action.data.promo_amount,
            total_amount: action.data.total,  
            tax: action.data.tax, 
            isLoding: false       
        }) 
    case Actions.SELECT_ADDRESS:
        return Object.assign({}, state, {
            address: action.data
        })
    case Actions.SELECT_DATE:
        return Object.assign({}, state, {
            delivery_date: action.data
        })
    case Actions.CURRENT_VENDOR:
        return Object.assign({}, state, {
            current_vendor: action.data
        })
    case Actions.PRODUCT_VENDOR:
        return Object.assign({}, state, {
            product_vendor: action.data
        })
    case Actions.RESET:
        return Object.assign({}, state, {
            isLoding: false, 
            sub_total:0, 
            promo:undefined, 
            promo_id:0, 
            total_amount:0, 
            promo_amount:0, 
            address:0, 
            delivery_date:undefined 
        })
    default:
        return state
    }
}

export default CartReducer