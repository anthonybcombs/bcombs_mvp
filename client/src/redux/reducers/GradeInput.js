import * as actionType from "../actions/Constant";

export default function Applications(
  state = {
    gradeList: [],
    individualList: null
  },
  action
) {
  switch (action.type) {
    case actionType.CUMULATIVE_GRADE_BY_APP_GROUP_COMPLETED:
      return {
        ...state,
        gradeList: action.payload
      }
    case actionType.CUMULATIVE_GRADE_BY_USER_COMPLETED: 
      return {
        ...state,
        individualList: action.payload
      }
    default:
      return state;
  }
}
