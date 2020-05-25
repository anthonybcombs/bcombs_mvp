import { initialState } from "../initialState";
import * as actionType from "../actions/Constant";
export default function Grades(state = {}, action) {
  switch (action.type) {
    case actionType.REQUEST_GRADES_COMPLETED:
      return action.payload.length > 0 ? [...action.payload] : [...state];
    default:
      return state;
  }
}
