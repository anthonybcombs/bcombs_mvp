import * as actionType from "../actions/Constant";
export default function Loading(
  state = {
    contacts: true,
    groups: true,
    groupMembers: true
  },
  action
) {
  switch (action.type) {
    case actionType.SET_CONTACT_LOADING:
      return {
        ...state,
        contacts: action.value
      };
    case actionType.SET_GROUP_LOADING:
      return {
        ...state,
        groups: action.value
      };
    case actionType.SET_GROUP_MEMBER_LOADING:
      return {
        ...state,
        groupMembers: action.value
      };
    default:
      return state;
  }
}
