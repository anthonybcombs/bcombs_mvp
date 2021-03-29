import * as actionType from "../actions/Constant";

export default function Applications(
  state = {
    gradeList: [],
    individualList: null,
    stUpdated: false,
    addUpdate: null
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
    case actionType.ADD_UPDATE_STUDENT_STANDARD_TEST_COMPLETED:
      return {
        ...state,
        addUpdate: action.payload,
        stUpdated: true
      }
    case actionType.DELETE_STUDENT_STANDARDIZED_TEST_COMPLETED:
      return {
        ...state,
        stUpdated: true
      }
    case actionType.CLEAR_GRADES:
      return {
        ...state,
        stUpdated: false
      }
    default:
      return state;
  }
}
