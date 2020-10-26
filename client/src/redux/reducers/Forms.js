import * as actionType from "../actions/Constant";

export default function Applications(
  state = {
    formList: [],
    addForm: {},
    selectedForm: {}
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
      return { ...state, selectedForm: [...action.payload] };
    default:
      return state;
  }
}
