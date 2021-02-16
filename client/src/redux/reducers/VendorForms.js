import { initialState } from "../initialState";
import * as actionType from "../actions/Constant";
export default function VendorForms(state = { formList: []}, action) {
  switch (action.type) {
    case actionType.REQUEST_USER_VENDOR_FORMS_COMPLETED:
      return {...state, formList: action.payload}
    default:
      return state;
  }
}
