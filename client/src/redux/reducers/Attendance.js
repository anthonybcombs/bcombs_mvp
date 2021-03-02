//import { initialState } from "../initialState";
import * as actionType from "../actions/Constant";

const initialState = {
  list: [],
  eventAttendanceList:[],
  isAttendanceUpdateSuccess:false,
  isAttendanceUpdateLoading: false,
  isLoading:false
}
export default function Attendance(state = initialState, action) {
  switch (action.type) {
    case actionType.REQUEST_ATTENDANCE:
      return {
        ...state,
        isLoading:true
      }
    case actionType.REQUEST_UPDATE_ATTENDANCE:
      return {
        ...state,
        isAttendanceUpdateSuccess:false ,
        isAttendanceUpdateLoading:true
      }
    case actionType.SET_ATTENDANCE_LIST:
        return {
          ...state,
          list: [...action.data],
          isLoading:false
      }
    case actionType.SET_EVENT_ATTENDANCE_LIST:
        return {
          ...state,
          eventAttendanceList: [...action.data],
          isAttendanceUpdateLoading: false,
          isLoading:false
      }
    case actionType.REQUEST_UPDATE_ATTENDANCE_SUCCESS:
        return {
          ...state,
          isAttendanceUpdateSuccess:true,
          isAttendanceUpdateLoading:false,
          isLoading:false
        }
    default:
      return state;
  }
}
