import { initialState } from "../initialState";
import * as actionType from "../actions/Constant";
export default function Auth(state = initialState.auth, action) {
  switch (action.type) {
    case actionType.REQUEST_AUTH:
      return {
        status: "AWAITING_AUTH_RESPONSE"
      };
    case actionType.REQUEST_AUTH_USER_INFO:
      return {
        ...state,
        status: "AWAITING_AUTH_RESPONSE"
      };
    case actionType.REQUEST_AUTH_COMPLETED:
      return {
        ...state,
        ...action.payload,
        status: action.payload.hasOwnProperty("error")
          ? "ANONYMOUS"
          : "SIGNED_IN",
        message: action.payload.hasOwnProperty("error")
          ? action.payload.error_description
          : ""
      };
    case actionType.REQUEST_AUTH_USER_INFO_COMPLETED:
      return {
        ...state,
        ...action.payload,
        status: action.payload.hasOwnProperty("error")
          ? "ANONYMOUS"
          : "SIGNED_IN",
        message: action.payload.hasOwnProperty("error")
          ? action.payload.error_description
          : ""
      };
    case actionType.REQUEST_AUTH_LOGOUT_COMPLETED:
      return {
        status: "ANONYMOUS"
      };
    default:
      return state;
  }
}
