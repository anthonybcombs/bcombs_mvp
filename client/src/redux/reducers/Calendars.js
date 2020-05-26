import { initialState } from "../initialState";
import * as actionType from "../actions/Constant";
export default function Calendars(state = initialState.calendars, action) {
  switch (action.type) {
    case actionType.REQUEST_GET_CALENDARS_COMPLETED:
      return action.payload;
    case actionType.REQUEST_GET_CALENDAR_COMPLETED:
      return action.payload;
    default:
      return state;
  }
}
