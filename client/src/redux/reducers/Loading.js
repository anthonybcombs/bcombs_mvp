import * as actionType from "../actions/Constant";
export default function Loading(
  state = {
    contacts: true,
    groups: true,
    groupMembers: true,
    events: true
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
    case actionType.SET_EVENT_LOADING:
      return {
        ...state,
        events: action.value
      };
    default:
      return state;
  }
}
