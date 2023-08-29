import * as actionType from "../actions/Constant";

export default function Parents(state = {
    contacts: [],
    isParentContactLoading: false,
}, action) {
  switch (action.type) {
    case actionType.REQUEST_PARENT_BY_VENDOR:
      return {
        ...state,
        isParentContactLoading: true
      }
    case actionType.SET_PARENT_LIST_BY_VENDOR:
      return {
        ...state,
        contacts: action.payload,
        isParentContactLoading: false
      }
    default:
      return state;
  }
}
