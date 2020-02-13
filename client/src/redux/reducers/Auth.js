import { initialState } from "../initialState";
import * as actionType from "../actions/Constant";
export default function Auth(state = initialState.auth, action) {
  switch (action.type) {
    case actionType.REQUEST_AUTH:
      return {
        status: "AWAITING_AUTH_RESPONSE"
      };
    case actionType.REQUEST_AUTH_COMPLETED:
      return {
        status: "SIGNED_IN"
      };
    case actionType.REQUEST_AUTH_SIGN_OUT_COMPLETED:
      return {
        status: "ANONYMOUS"
      };
    default:
      return state;
  }
}