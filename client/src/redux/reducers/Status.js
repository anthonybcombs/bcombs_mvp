import { initialState } from "../initialState";
import * as actionType from "../actions/Constant";
export default function Auth(state = initialState.auth, action) {
  switch (action.type) {
    case actionType.REQUEST_AUTH:
      return {
        requestStatus: "AWAITING_AUTH_RESPONSE"
      };
    case actionType.REQUEST_AUTH_USER_INFO:
      return {
        requestStatus: "AWAITING_AUTH_RESPONSE"
      };
    case actionType.REQUEST_ADD_USER:
      return {
        requestStatus: "AWAITING_AUTH_RESPONSE"
      };
    case actionType.REQUEST_STATUS_COMPLETED:
      return {
        requestStatus: "COMPLETED",
        message: action.payload.message,
        messageType: action.payload.messageType
      };
    case actionType.REQUEST_REMOVE_STATUS_COMPLETED:
      return {
        requestStatus: "",
        message: "",
        messageType: ""
      };
    default:
      return state;
  }
}
