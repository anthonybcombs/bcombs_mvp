import { initialState } from "../initialState";
import * as actionType from "../actions/Constant";
export default function Members(state = [], action) {
  switch (action.type) {
    case actionType.REQUEST_MEMBERS:
      return [...state];
    case actionType.SET_MEMBER_LIST:
      return [...(action.data || [])];
    default:
      return state;
  }
}
