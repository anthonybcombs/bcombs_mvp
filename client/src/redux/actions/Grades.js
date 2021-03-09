import { call, take, put } from "redux-saga/effects";
import graphqlClient from "../../graphql";
import { GET_STUDENT_CUMULATIVE_BY_APP_GROUP } from "../../graphql/gradeQuery";
import * as actionType from "./Constant";

// From DB
const getGradesFromDatabase = async () => {
  const { data } = await graphqlClient.query({
    query: GRADES_QUERY,
    variables: {},
  });
  return data.grades;
};
const getStudentCumulativeGradeByAppGroupFromDatabse = variables => {
  console.log('variables', variables)
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.query({
        query: GET_STUDENT_CUMULATIVE_BY_APP_GROUP,
        variables
      })
    
      return resolve(data.getStudentCumulativeGradeByAppGroup)
    } catch (error) {
      console.log('error', { error, variables })
      reject(error)
    }
  })
}


// From Front-end
export const requestGrades = () => {
  return {
    type: actionType.REQUEST_GRADES,
  };
};
export const requestGetStudentCumulativeGradeByAppGroup = (data) => {
  return {
    type: actionType.CUMULATIVE_GRADE_BY_APP_GROUP,
    data
  }
}


// From Saga
export function* getGrades() {
  const grades = yield call(getGradesFromDatabase);

  yield put({
    type: actionType.REQUEST_GRADES_COMPLETED,
    payload: grades,
  });
}
export function* getStudentCumulativeGradeByAppGroup({ data }) {
  try {
    const response = yield call(getStudentCumulativeGradeByAppGroupFromDatabse, data)
    yield put({
      type: actionType.CUMULATIVE_GRADE_BY_APP_GROUP_COMPLETED,
      payload: response
    })
  } catch (err) {
    yield put({
      type: actionType.CUMULATIVE_GRADE_BY_APP_GROUP_COMPLETED,
      payload: []
    })
  }
}

