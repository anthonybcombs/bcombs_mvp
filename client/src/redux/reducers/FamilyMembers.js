import { initialState } from "../initialState";
import * as actionType from "../actions/Constant";
export default function FamilyMembers(
  state = initialState.familyMembers,
  action
) {
  switch (action.type) {
    default:
      return state;
  }
}
