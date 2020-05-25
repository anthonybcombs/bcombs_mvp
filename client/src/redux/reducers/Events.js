import { initialState } from "../initialState";
import * as actionType from "../actions/Constant";
export default function Events(state = [], action) {
  switch (action.type) {
    case actionType.REQUEST_UPDATE_EVENT_COMPLETED:
      return state.map((event) => {
        if (event.id === action.payload.id) {
          return { ...action.payload };
        }
        return event;
      });
    case actionType.REQUEST_ADD_EVENT_COMPLETED:
      return [...state, action.payload];
    case actionType.REQUEST_DELETE_EVENT_COMPLETED:
      return [...state.filter((event) => event.id !== action.payload.id)];
    case actionType.REQUEST_EVENTS_COMPLETED: {
      console.log("action.payloaddd", action);
      return [...action.payload];
    }
    case actionType.REQUEST_SEARCH_EVENTS_COMPLETED: {
      // return state.filter()
    }
    default:
      return state;
  }
}
