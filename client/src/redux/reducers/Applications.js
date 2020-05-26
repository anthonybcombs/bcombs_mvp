import { initialState } from "../initialState";
import * as actionType from "../actions/Constant";
export default function Applications(
  state = {
    activeapplications: [],
    addapplication: {},
    userApplications: {}
  },
  action
) {
  switch (action.type) {
    case actionType.REQUEST_GET_APPLICATION_COMPLETED: {
      return { ...state, activeapplications: [...action.payload] };
    }
    case actionType.REQUEST_ADD_APPLICATION_COMPLETED:
      return { ...state, addapplication: action.payload };
    case actionType.SET_USER_APPLICATIONS:
      return {
        ...state,
        userApplications: { ...action.payload }
      };
    default:
      return state;
  }
}
