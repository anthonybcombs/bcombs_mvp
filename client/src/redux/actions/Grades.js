import { call, take, put, all } from "redux-saga/effects";
import graphqlClient from "../../graphql";
import { GET_STUDENT_CUMULATIVE_BY_APP_GROUP, GET_STUDENT_CUMULATIVE_BY_CHILD } from "../../graphql/gradeQuery";
import { ADD_UPDATE_STANDARDIZED_TEST_MUTATION, DELETE_STUDENT_STANDARDIZED_TEST_MUTATION } from "../../graphql/gradeMutation";
import * as actionType from "./Constant";

import {
  setGradeLoading,
  setGradeStandardLoading
} from './Loading'

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
const addUpdateStudentStandardizedTestToDatabse = studentStandardizedTest => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.query({
        query: ADD_UPDATE_STANDARDIZED_TEST_MUTATION,
        variables: { studentStandardizedTest }
      })
    
      return resolve(data.addUpdateStudentStandardizedTest)
    } catch (error) {
      console.log('error', { error })
      reject(error)
    }
  })
}

const deleteStudentStandardizedTestToDatabse = studentTestIds => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.query({
        query: DELETE_STUDENT_STANDARDIZED_TEST_MUTATION,
        variables: { studentTestIds }
      })
    
      return resolve(data.deleteStudentStandardizedTest)
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
export const requestAddUpdateStudentStandardizedTest = (data) => {
  return {
    type: actionType.ADD_UPDATE_STUDENT_STANDARD_TEST,
    data
  }
}
export const clearGrades = () => {
  return {
    type: actionType.CLEAR_GRADES
  }
}

export const requestDeleteStudentStandardizedTest = (data) => {
  return {
    type: actionType.DELETE_STUDENT_STANDARDIZED_TEST,
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
    yield put(setGradeLoading(true))
    const response = yield call(getStudentCumulativeGradeByAppGroupFromDatabse, data)
    yield all([
      put(setGradeLoading(false)),
      put({
        type: actionType.CUMULATIVE_GRADE_BY_APP_GROUP_COMPLETED,
        payload: response
      })
    ])
  } catch (err) {
    yield all([
      put(setGradeLoading(false)),
      put({
        type: actionType.CUMULATIVE_GRADE_BY_APP_GROUP_COMPLETED,
        payload: []
      })
    ])
  }
}
export function* getStudentCumulativeGradeByUser({ child_id }) {
  try {
    yield put(setGradeLoading(true))
    const response = yield call(getStudentCumulativeGradeByUserFromDatabse, child_id)
    yield all([
      put(setGradeLoading(false)),
      put({
        type: actionType.CUMULATIVE_GRADE_BY_USER_COMPLETED,
        payload: response
      })
    ])
  } catch (err) {
    yield all([
      put(setGradeLoading(false)),
      put({
        type: actionType.CUMULATIVE_GRADE_BY_USER_COMPLETED,
        payload: []
      })
    ])
  }
}

export function* addUpdateStudentStandardizedTest({ data }) {
  try {
    yield put(setGradeStandardLoading(true))
    const response = yield call(addUpdateStudentStandardizedTestToDatabse, data)
    yield all([
      put(setGradeStandardLoading(false)),
      put({
        type: actionType.ADD_UPDATE_STUDENT_STANDARD_TEST_COMPLETED,
        payload: response
      })
    ])
  } catch (err) {
    yield all([
      put(setGradeStandardLoading(false)),
      put({
        type: actionType.ADD_UPDATE_STUDENT_STANDARD_TEST_COMPLETED,
        payload: []
      })
    ])
  }
}

export function* deleteStudentStandardizedTest({ data }) {
  try {
    yield put(setGradeStandardLoading(true))
    const response = yield call(deleteStudentStandardizedTestToDatabse, data)
    yield all([
      put(setGradeStandardLoading(false)),
      put({
        type: actionType.DELETE_STUDENT_STANDARDIZED_TEST_COMPLETED,
        payload: response
      })
    ])
  } catch (err) {
    yield all([
      put(setGradeStandardLoading(false)),
      put({
        type: actionType.DELETE_STUDENT_STANDARDIZED_TEST_COMPLETED,
        payload: []
      })
    ])
  }
}

