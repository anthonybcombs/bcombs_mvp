import { initialState } from "../initialState";
import * as actionType from "../actions/Constant";
export default function Vendor2(state = {newVendor: {}, selectedVendor: {}}, action) {
  switch (action.type) {
    case actionType.REQUEST_DUPLICATE_VENDOR_COMPLETED:
      return {...state, newVendor: action.payload}
    case actionType.REQUEST_SELECTED_VENDOR_COMPLETED:
      return {...state, selectedVendor: action.payload}
    default:
      return state;
  }
}
