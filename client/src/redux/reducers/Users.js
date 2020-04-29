import { initialState } from "../initialState";
import * as actionType from "../actions/Constant";
export default function User(
  state = {
    profile: {}
  },
  action
) {
  switch (action.type) {
    case actionType.SET_USER_PROFILE: {
      return {
        ...state,
        profile: action.user
      };
    }
    default:
      return state;
  }
}
