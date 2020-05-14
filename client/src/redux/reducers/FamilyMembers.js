import { initialState } from "../initialState";
import * as actionType from "../actions/Constant";
export default function FamilyMembers(
  state = initialState.familyMembers,
  action
) {
  switch (action.type) {
    case actionType.REQUEST_FAMILY_MEMBERS_COMPLETED: {
      return [...action.payload];
    }
    default:
      return state;
  }
}
