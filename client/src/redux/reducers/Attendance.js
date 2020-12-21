//import { initialState } from "../initialState";
import * as actionType from "../actions/Constant";

const initialState = {
  list: []
}
export default function Attendance(state = initialState, action) {
  switch (action.type) {
    case actionType.REQUEST_UPDATE_ATTENDANCE:
      return {
        ...state
      }
    case actionType.SET_ATTENDANCE_LIST:
        return {
          ...state,
          list: [...action.data]
      }
    default:
      return state;
  }
}
