import { initialState } from "../initialState";
import * as actionType from "../actions/Constant";
export default function Relatives(
  state = initialState.relatives.filter(relative =>
    relative.userIds.includes(initialState.auth.id)
  ),
  action
) {
  switch (action.type) {
    case actionType.REQUEST_ADD_RELATIVE_COMPLETED:
      return [...state, action.payload];
    default:
      return state;
  }
}
