import { initialState } from "../initialState";
import * as actionType from "../actions/Constant";
export default function Auth(state = initialState.auth, action) {
  switch (action.type) {
    case actionType.REQUEST_AUTH:
      return {
        status: "AWAITING_AUTH_RESPONSE",
      };
    case actionType.REQUEST_AUTH_USER_INFO:
      return {
        status: "AWAITING_AUTH_RESPONSE",
      };
    case actionType.REQUEST_CHANGE_PASSWORD:
      return {
        status: "AWAITING_AUTH_RESPONSE",
      };
    case actionType.REQUEST_AUTH_COMPLETED:
      return {
        ...state,
        ...action.payload,
        status:
          action.payload.status.messageType === "error"
            ? "ANONYMOUS"
            : "SIGNED_IN",
      };
    case actionType.REQUEST_AUTH_USER_INFO_COMPLETED:
      return {
        ...state,
        ...action.payload,
        status: action.payload.hasOwnProperty("status")
          ? "ANONYMOUS"
          : "SIGNED_IN",
      };
    case actionType.REQUEST_CHANGE_PASSWORD_COMPLETED:
      return {
        status: "REQUESTED_PASSWORD_CHANGE",
      };
    case actionType.REQUEST_AUTH_LOGOUT_COMPLETED:
      return {
        status: "ANONYMOUS",
      };
    default:
      return state;
  }
}
