import { initialState } from "../initialState";
import * as actionType from "../actions/Constant";
export default function Calendars(state = initialState.calendars, action) {
  switch (action.type) {
    case actionType.REQUEST_ADD_CALENDAR_COMPLETED:
      return action.payload;
    case actionType.REQUEST_EDIT_CALENDAR_COMPLETED:
      return state.map((calendarGroup) => {
        return calendarGroup.map((calendar) => {
          if (calendar.id === action.payload.id) {
            return action.payload;
          }
          return calendar;
        });
      });
    case actionType.REQUEST_DELETE_CALENDAR_COMPLETED:
      return [...state.filter((calendar) => calendar.id !== action.payload.id)];
    case actionType.REQUEST_GET_CALENDARS_COMPLETED:
      return action.payload;
    default:
      return state;
  }
}
