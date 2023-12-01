import { initialState } from "../initialState";
import * as actionType from "../actions/Constant";

export default function Applications(
  state = {
    activeapplications: [],
    addapplication: {},
    userApplications: {},
    updateapplication: {},
    archivedapplication: {},
    unarchivedapplication: {},
    archivedlist: [],
    selectedapplication: {},
    userAllApplications: [],
    applicationHistory: [],
    customActiveApplications: [],
    customArchiveApplications: [],
    selectedbuilderapplication: null,
    error: null
  },
  action
) {
  switch (action.type) {
    case actionType.REQUEST_GET_APPLICATION_COMPLETED:
      return { ...state, activeapplications: [...action.payload] };
    case actionType.SET_USER_APPLICATIONS:
      return {
        ...state,
        userApplications: { ...action.payload }
      };
    case actionType.REQUEST_GET_ARCHIVED_APPLICATION_COMPLETED:
      return { ...state, archivedlist: [...action.payload] };
    case actionType.REQUEST_ADD_APPLICATION_COMPLETED:
      return { ...state, addapplication: action.payload };
    case actionType.REQUEST_UPDATE_APPLICATION_COMPLETED:
      return { ...state, updateapplication: action.payload };
    case actionType.REQUEST_ARCHIVED_APPLICATION_COMPLETED:
      return { ...state, archivedapplication: action.payload };
    case actionType.REQUEST_UNARCHIVED_APPLICATION_COMPLETED:
      return { ...state, unarchivedapplication: action.payload };
    case actionType.REQUEST_GET_APPLICATION_ID_COMPLETED:
      return { ...state, selectedapplication: action.payload };
    case actionType.REQUEST_SAVE_APPLICATION_COMPLETED:
      return { ...state, updateapplication: action.payload };
    case actionType.REQUEST_GET_APPLICATION_USER_ID_COMPLETED:
      return { ...state, userAllApplications: action.payload };
    case actionType.REQUEST_GET_APPLICATION_HISTORY_COMPLETE:
      return { ...state, applicationHistory: action.payload };
    case actionType.REQUEST_GET_USER_APPLICATION_HISTORY_COMPLETE:
      return { ...state, applicationHistory: action.payload };
    case actionType.REQUEST_GET_CUSTOM_APPLICATION_COMPLETED:
      return { ...state, activeapplications: action.payload };
    case actionType.REQUEST_GET_CUSTOM_APPLICATION_BY_VENDOR_COMPLETED:
        return { ...state, customActiveApplications: [...action.payload ]};
    case actionType.REQUEST_GET_CUSTOM_APPLICATION_BY_ID_COMPLETED:
      return { ...state, selectedbuilderapplication: action.payload };
    case actionType.REQUEST_SUBMIT_FORM: 
      return {
        ...state, 
        error: null
      }
    case actionType.REQUEST_SUBMIT_FORM_COMPLETED: 
      return {
        ...state, 
        error: action.error
      }

    default:
      return state;
  }
}
