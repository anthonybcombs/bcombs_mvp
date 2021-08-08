import { initialState } from "../initialState";
import * as actionType from "../actions/Constant";

export default function AppReminders(state = {
  reminders: []
}, action) {
  switch (action.type) {
    case actionType.REQUEST_CREATE_GROUP_REMINDER_COMPLETED:
    case actionType.REQUEST_GET_VENDOR_REMINDER_COMPLETED:
      return {
        ...state,
        reminders: [...action.payload]
      }
    default:
      return state;
  }
}
