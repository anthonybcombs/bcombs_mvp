import * as actionType from "../actions/Constant";

export default function Applications(
  state = {
    gradeList: []
  },
  action
) {
  switch (action.type) {
    case actionType.CUMULATIVE_GRADE_BY_APP_GROUP_COMPLETED:
      return {
        ...state,
        gradeList: action.payload
      }
    default:
      return state;
  }
}
