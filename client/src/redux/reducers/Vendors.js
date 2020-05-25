import { initialState } from "../initialState";
import * as actionType from "../actions/Constant";
export default function Vendor(state = {}, action) {
  switch (action.type) {
    case actionType.REQUEST_VENDOR_COMPLETED:
      return action.payload
    case actionType.REQUEST_UPDATE_VENDOR_COMPLETED:
      return action.payload
    default:
      return state;
  }
}
