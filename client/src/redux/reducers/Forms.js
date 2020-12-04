import * as actionType from "../actions/Constant";

export default function Applications(
  state = {
    formList: [],
    addForm: {},
    updateForm: {},
    deleteForm: {},
    selectedForm: {},
    submitForm: {},
    updateSubmittedForm: {},
    customApplicationHistory: [],
    isFormView: false
  },
  action
) {
  switch (action.type) {
    case actionType.REQUEST_GET_FORMS_COMPLETED:
      return {
        ...state,
        formList: [...action.payload],
        addForm: {},
        updateForm: {},
        deleteForm: {}
      };
    case actionType.REQUEST_ADD_FORM_COMPLETED:
      return {
        ...state,
        addForm: { ...action.payload },
        updateForm: {},
        deleteForm: {}
      };
    case actionType.REQUEST_GET_FORM_ID_COMPLETED:
      return { ...state, selectedForm: {...action.payload} };
    case actionType.REQUEST_UPDATE_FORM_COMPLETED:
      return {
        ...state,
        updateForm: { ...action.payload },
        addForm: {},
        deleteForm: {}
      };
    case actionType.REQUEST_DELETE_FORM_COMPLETED:
      return {
        ...state,
        deleteForm: { ...action.payload },
        addForm: {},
        updateForm: {}
      };
    case actionType.REQUEST_SUBMIT_FORM_COMPLETED:
      return {
        ...state,
        submitForm: { ...action.payload }
      };
    case actionType.REQUEST_UPDATE_SUBMITTED_FORM_COMPLETED:
      return {
        ...state,
        updateSubmittedForm: { ...action.payload }
      };
    case actionType.SET_VIEW_MODE:
      return {
        ...state,
        isFormView: action.bool
      }
    case actionType.REQUEST_CUSTOM_APPLICATION_HISTORY_COMPLETED:
      return {
        ...state,
        customApplicationHistory: [...action.payload]
      }
    default:
      return state;
  }
}
