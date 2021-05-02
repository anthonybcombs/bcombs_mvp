import { initialState } from "../initialState";
import * as actionType from "../actions/Constant";
export default function Groups(
  state = {
    ...initialState.groups.filter(group =>
      group.userIds.includes(initialState.auth.id)
    ),
    archivedGroups: [],
    archiveUpdated: false
  },
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
      return {
        ...state,
        ...action.data
      };
    case actionType.ARCHIVE_GROUP_COMPLETED:
      return {
        ...state,
        archivedGroups: action.payload
      }
    case actionType.ADD_ARCHIVE_GROUP_COMPLETED:
      return {
        ...state,
        archiveUpdated: true
      }
    case actionType.CLEAR_GROUP_ARCHIVE:
      return {
        ...state,
        archiveUpdated: false
      }
    default:
      return state;
  }
}
