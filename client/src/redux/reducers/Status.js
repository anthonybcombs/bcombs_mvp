import { initialState } from "../initialState";
import * as actionType from "../actions/Constant";
export default function Auth(state = initialState.auth, action) {
  switch (action.type) {
    case actionType.REQUEST_AUTH:
      return {
        requestStatus: "AWAITING_AUTH_RESPONSE",
      };
    case actionType.REQUEST_AUTH_USER_INFO:
      return {
        requestStatus: "AWAITING_AUTH_RESPONSE",
      };
    case actionType.REQUEST_CHANGE_PASSWORD:
      return {
        requestStatus: "AWAITING_AUTH_RESPONSE",
      };
    case actionType.REQUEST_CHECK_USER_AND_ADD:
      return {
        requestStatus: "AWAITING_AUTH_RESPONSE",
      };
    case actionType.REQUEST_ADD_USER:
      return {
        requestStatus: "AWAITING_AUTH_RESPONSE",
      };
    case actionType.REQUEST_UPDATE_USER:
      return {
        requestStatus: "AWAITING_AUTH_RESPONSE",
      };
      ``;
    case actionType.REQUEST_GET_CALENDARS:
      return {
        requestStatus: "AWAITING_AUTH_RESPONSE",
      };
    case actionType.REQUEST_ADD_CALENDAR:
      return {
        requestStatus: "AWAITING_AUTH_RESPONSE",
      };
    case actionType.REQUEST_EDIT_CALENDAR:
      return {
        requestStatus: "AWAITING_AUTH_RESPONSE",
      };
    case actionType.REQUEST_DELETE_CALENDAR:
      return {
        requestStatus: "AWAITING_AUTH_RESPONSE",
      };
    case actionType.REQUEST_FAMILY_MEMBERS:
      return {
        requestStatus: "AWAITING_AUTH_RESPONSE",
      };
    case actionType.REQUEST_CLONE_CALENDAR:
      return {
        requestStatus: "AWAITING_AUTH_RESPONSE",
      };
    case actionType.REQUEST_SIGNUP_FAILED:
      return {
        requestStatus: "ANONYMOUS",
        message: action.message,
      };
    case actionType.REQUEST_STATUS_COMPLETED:
      return {
        requestStatus: "COMPLETED",
        message: action.payload.message,
        messageType: action.payload.messageType,
      };
    case actionType.REQUEST_REMOVE_STATUS_COMPLETED:
      return {
        requestStatus: "",
        message: "",
        messageType: "",
      };
    default:
      return state;
  }
}
