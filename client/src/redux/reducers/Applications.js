import { initialState } from "../initialState";
import * as actionType from "../actions/Constant";

export default function Applications(state = {
  activeapplications: [],
  addapplication: {},
  userApplications: {},
  updateapplication: {},
  archivedapplication: {},
  archivedlist: []
}, action) {
  switch (action.type) {
    case actionType.REQUEST_GET_APPLICATION_COMPLETED:
      return  {...state, activeapplications: [...action.payload]}
    case actionType.SET_USER_APPLICATIONS:
      return {
        ...state,
        userApplications: { ...action.payload }
      };
    case actionType.REQUEST_GET_ARCHIVED_APPLICATION_COMPLETED:
      return  {...state, archivedlist: [...action.payload]}
    case actionType.REQUEST_ADD_APPLICATION_COMPLETED:
      return {...state, addapplication: action.payload }
    case actionType.REQUEST_UPDATE_APPLICATION_COMPLETED:
      return {...state, updateapplication: action.payload }
    case actionType.REQUEST_ARCHIVED_APPLICATION_COMPLETED:
        return {...state, archivedapplication: action.payload }
    default:
      return state;
  }
}
