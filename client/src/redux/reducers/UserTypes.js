import { initialState } from "../initialState";
import * as actionType from "../actions/Constant";
export default function Users(state = initialState.userTypes, action) {
  switch (action.type) {
    case actionType.REQUEST_USER_TYPES_COMPLETED:
      return action.payload;
    default:
      return state;
  }
}
