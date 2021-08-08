import { initialState } from "../initialState";
import * as actionType from "../actions/Constant";
export default function Vendor(state = {
  reminders: []
}, action) {
  switch (action.type) {
    case actionType.REQUEST_VENDOR_COMPLETED:
      return action.payload
    case actionType.REQUEST_UPDATE_VENDOR_COMPLETED:
      window.location.reload(false);
      return action.payload
    case actionType.REQUEST_CREATE_GROUP_REMINDER_COMPLETED:
    case actionType.REQUEST_GET_VENDOR_REMINDER_COMPLETED:
      const newState = {
        ...state,
        reminders: [...action.payload]
      }

      console.log('newState', newState);
      return newState
    default:
      return state;
  }
}
