import { initialState } from "../initialState";
import { uuid } from "uuidv4";
import randomColor from "randomcolor";
import * as actionType from "../actions/Constant";
export default function FamilyMembers(
  state = initialState.familyMembers,
  action
) {
  switch (action.type) {
    case actionType.REQUEST_FAMILY_MEMBERS_COMPLETED: {
      // return [...(action.payload || [])];
      return [
        {
          id: uuid(),
          userId: uuid(),
          name: "Bon Mercado",
          color: randomColor(),
        },
        {
          id: uuid(),
          userId: uuid(),
          name: "Test Name 1",
          color: randomColor(),
        },
        {
          id: uuid(),
          userId: uuid(),
          name: "Test Name 2",
          color: randomColor(),
        },
      ];
    }
    default:
      return state;
  }
}
