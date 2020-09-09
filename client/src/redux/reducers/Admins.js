import { initialState } from "../initialState";
import * as actionType from "../actions/Constant";
export default function Admins(state = {}, action) {
  switch (action.type) {
    case actionType.REQUEST_GET_VENDOR_ADMINS_COMPLETED:
      return action.payload
    default:
      return state;
  }
}
