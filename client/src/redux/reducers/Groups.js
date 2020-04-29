import { initialState } from "../initialState";
import * as actionType from "../actions/Constant";
export default function Groups(
  state = initialState.groups.filter(group =>
    group.userIds.includes(initialState.auth.id)
  ),
  action
) {
  switch (action.type) {
    case actionType.REQUEST_ADD_GROUP_COMPLETED:
      return [...state, action.payload];
    case actionType.REQUEST_UPDATE_EVENT_COMPLETED:
      return state.map(group => {
        if (group.id === action.payload.id) {
          return { ...action.payload };
        }
        return group;
      });
    case actionType.SET_USER_GROUPS:
      return action.data;
    default:
      return state;
  }
}
