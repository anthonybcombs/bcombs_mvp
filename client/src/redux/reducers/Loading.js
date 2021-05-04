import { startOfYesterday } from "date-fns";
import * as actionType from "../actions/Constant";
export default function Loading(
  state = {
    contacts: true,
    groups: true,
    groupMembers: true,
    events: true,
    profile: true,
    application: false,
    form_settings: false,
    userAllApplications: false,
    addAdmin: false,
    deleteAdmins: false,
    addForm: false,
    gradeLoading: false,
    standardGradeLoading: false,
    gradeEditLoading: false,
    archiveLoading: false
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
    case actionType.SET_PROFILE_LOADING:
      return {
        ...state,
        profile: action.value
      };
    case actionType.SET_APPLICATION_LOADING:
      return  {
        ...state,
        application: action.value
      }
    case actionType.SET_USER_APPLICATION_LOADING:
      return  {
        ...state,
        userAllApplications: action.value
      }
    case actionType.SET_FORM_SETTINGS_LOADING:
      return {
        ...state,
        form_settings: action.value
      }
    case actionType.SET_ADD_ADMIN_LOADING:
      return {
        ...state,
        addAdmin: action.value
      }
    case actionType.SET_DELETE_ADMIN_LOADING:
      return {
        ...state,
        deleteAdmins: action.value
      }
    case actionType.SET_ADD_FORM_LOADING:
      return {
        ...state,
        addForm: action.value
      }
    case actionType.SET_UPDATE_FORM_LOADING:
      return {
        ...state,
        updateForm: action.value
      }
    case actionType.SET_GET_FORM_LOADING:
      return {
        ...state,
        getForm: action.value
      }
    case actionType.SET_DELETE_FORM_LOADING:
      return {
        ...state,
        deleteForm: action.value
      }
    case actionType.SET_SUBMIT_FORM_LOADING:
      return {
        ...state,
        submitForm: action.value
      }
    case actionType.SET_GRADE_LOADING: 
      return {
        ...state,
        gradeLoading: action.value
      }
    case actionType.SET_GRADE_STANDARD_LOADING:
      return {
        ...state,
        standardGradeLoading: action.value
      }
    case actionType.SET_GRADE_EDIT_LOADING:
      return {
        ...state,
        gradeEditLoading: action.value
      }
    case actionType.SET_ARCHIVE_LOADING:
      return {
        ...state,
        archiveLoading: action.value
      }
    default:
      return state;
  }
}
