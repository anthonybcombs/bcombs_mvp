import { initialState } from "../initialState";
import * as actionType from "../actions/Constant";
export default function Users(state = {}, action) {
  switch (action.type) {
    case actionType.REQUEST_USER_TYPES_COMPLETED:
      return action.payload.length > 0 ? [...action.payload] : [...state];
    default:
      return state;
  }
}
