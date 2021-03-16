import { call, take, put } from "redux-saga/effects";
import graphqlClient from "../../graphql";
import { GET_STUDENT_CUMULATIVE_BY_APP_GROUP, GET_STUDENT_CUMULATIVE_BY_CHILD } from "../../graphql/gradeQuery";
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
const getStudentCumulativeGradeByUserFromDatabse = child_id => {
  console.log('child_id', child_id)
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.query({
        query: GET_STUDENT_CUMULATIVE_BY_CHILD,
        variables: { child_id }
      })
    
      return resolve(data.getStudentRecords)
    } catch (error) {
      console.log('error', { error })
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
export const requestGetStudentCumulativeGradeByUser = (child_id) => {
  return {
    type: actionType.CUMULATIVE_GRADE_BY_USER,
    child_id
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
export function* getStudentCumulativeGradeByUser({ child_id }) {
  try {
    const response = yield call(getStudentCumulativeGradeByUserFromDatabse, child_id)
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

