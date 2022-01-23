import { combineReducers } from 'redux';
import SplashReducer from './SplashReducer.js';
import HomeReducer from './HomeReducer.js';
import VendorReducer from './VendorReducer.js';
import ProductReducer from './ProductReducer.js';
import FaqReducer from './FaqReducer.js';
import CategoryReducer from './CategoryReducer.js';
import SubCategoryReducer from './SubCategoryReducer.js';
import PrivacyReducer from './PrivacyReducer.js';
import RegisterReducer from './RegisterReducer.js';
import LoginReducer from './LoginReducer.js';
import AddressReducer from './AddressReducer.js';
import AddressListReducer from './AddressListReducer.js';
import PaymentReducer from './PaymentReducer.js';
import PrescriptionReducer from './PrescriptionReducer.js';
import CreatePrescriptionReducer from './CreatePrescriptionReducer.js';
import ViewPrescriptionReducer from './ViewPrescriptionReducer.js';
import CartReducer from './CartReducer.js';
import MyOrdersReducer from './MyOrdersReducer.js';
import PromoReducer from './PromoReducer.js';
import ProfileReducer from './ProfileReducer.js';
import ForgotReducer from './ForgotReducer.js';
import ResetReducer from './ResetReducer.js';
const allReducers = combineReducers({
  splash: SplashReducer,
  home: HomeReducer,
  vendor: VendorReducer,
  product:ProductReducer,
  faq:FaqReducer,
  category:CategoryReducer,
  sub_category:SubCategoryReducer,
  privacy:PrivacyReducer,
  register:RegisterReducer,
  login:LoginReducer,
  address:AddressReducer,
  address_list:AddressListReducer,
  payment:PaymentReducer,
  prescription:PrescriptionReducer,
  create_prescription:CreatePrescriptionReducer,
  view_prescription:ViewPrescriptionReducer,
  cart:CartReducer,
  myorders:MyOrdersReducer,
  promo:PromoReducer,
  profile:ProfileReducer,
  forgot:ForgotReducer,
  reset:ResetReducer,
});
export default allReducers;