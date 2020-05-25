import { initialState } from "../initialState";
import * as actionType from "../actions/Constant";
export default function Applications(state = {
  activeapplications: [],
  addapplication: {}
}, action) {
  switch (action.type) {
    case actionType.REQUEST_GET_APPLICATION_COMPLETED: {
      return  {...state, activeapplications: [...action.payload]}
    }
    case actionType.REQUEST_ADD_APPLICATION_COMPLETED:
      return {...state, addapplication: action.payload }
    default:
      return state;
  }
}
