import * as actionType from "../actions/Constant";

export default function Applications(
  state = {
    formList: [],
    addForm: {},
    updateForm: {},
    deleteForm: {},
    selectedForm: {},
    isFormView: false
  },
  action
) {
  switch (action.type) {
    case actionType.REQUEST_GET_FORMS_COMPLETED:
      return { ...state, formList: [...action.payload] };
    case actionType.REQUEST_ADD_FORM_COMPLETED:
      return {
        ...state,
        addForm: { ...action.payload }
      };
    case actionType.REQUEST_GET_FORM_ID_COMPLETED:
      return { ...state, selectedForm: {...action.payload} };
    case actionType.REQUEST_UPDATE_FORM_COMPLETED:
      return {
        ...state,
        updateForm: { ...action.payload },
        addForm: {}
      };
    case actionType.REQUEST_DELETE_FORM_COMPLETED:
      return {
        ...state,
        deleteForm: { ...action.payload }
      };
    case actionType.SET_VIEW_MODE:
      return {
        ...state,
        isFormView: action.bool
      }
    default:
      return state;
  }
}
