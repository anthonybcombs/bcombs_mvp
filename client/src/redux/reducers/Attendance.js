//import { initialState } from "../initialState";
import * as actionType from "../actions/Constant";

const initialState = {
  list: [],
  isAttendanceUpdateSuccess:false,
  isAttendanceUpdateLoading: false
}
export default function Attendance(state = initialState, action) {
  switch (action.type) {
    case actionType.REQUEST_UPDATE_ATTENDANCE:
      return {
        ...state,
        isAttendanceUpdateSuccess:false,
        isAttendanceUpdateSuccess:true 
      }
    case actionType.SET_ATTENDANCE_LIST:
        return {
          ...state,
          list: [...action.data]
      }
    case actionType.REQUEST_UPDATE_ATTENDANCE_SUCCESS:
        return {
          ...state,
          isAttendanceUpdateSuccess:true,
          isAttendanceUpdateSuccess:false 
        }
    default:
      return state;
  }
}
