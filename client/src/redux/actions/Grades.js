import { call, take, put, all } from "redux-saga/effects";
import graphqlClient from "../../graphql";
import { GET_STUDENT_CUMULATIVE_BY_APP_GROUP, GET_STUDENT_CUMULATIVE_BY_CHILD, GET_STUDENT_CUMULATIVE_BY_VENDOR } from "../../graphql/gradeQuery";
import { ADD_UPDATE_STANDARDIZED_TEST_MUTATION, DELETE_STUDENT_STANDARDIZED_TEST_MUTATION, ADD_UPDATE_STUDENT_CUMULATIVE_MUTATION } from "../../graphql/gradeMutation";
import * as actionType from "./Constant";

import {
  setGradeLoading,
  setGradeStandardLoading,
  setGradeEditLoading
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
const getStudentCumulativeGradeByVendorFromDatabse = vendor_id => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.query({
        query: GET_STUDENT_CUMULATIVE_BY_VENDOR,
        variables: { vendor_id }
      })
    
      return resolve(data.getStudentCumulativeGradeByVendor)
    } catch (error) {
      console.log('error', { error, variables })
      reject(error)
    }
  })
}
const getStudentCumulativeGradeByUserFromDatabse = variables => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.query({
        query: GET_STUDENT_CUMULATIVE_BY_CHILD,
        variables
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
const addUpdateStudentCumulativeToDatabse = studentCumulative => {
  console.log(' data.addUpdateStudentCumulative studentCumulative', studentCumulative)
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.mutate({
        mutation: ADD_UPDATE_STUDENT_CUMULATIVE_MUTATION,
        variables: { studentCumulative }
      })

  
      console.log('data.addUpdateStudentCumulative', data)
      return resolve(data.addUpdateStudentCumulative)
    } catch (error) {
      console.log('addUpdateStudentCumulativeToDatabse error', error)
      console.log('addUpdateStudentCumulativeToDatabse error 2',error instanceof Error);
        console.log('addUpdateStudentCumulativeToDatabse error 3',error.networkError.result.errors); 
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
export const requestGetStudentCumulativeGradeByVendor = (vendor_id) => {
  return {
    type: actionType.CUMULATIVE_GRADE_BY_VENDOR_COMPLETED, // for development
    vendor_id
  }
}
export const requestGetStudentCumulativeGradeByUser = (data) => {
  return {
    type: actionType.CUMULATIVE_GRADE_BY_USER,
    data
  }
}
export const requestAddUpdateStudentStandardizedTest = (data) => {
  return {
    type: actionType.ADD_UPDATE_STUDENT_STANDARD_TEST,
    data
  }
}
export const requestAddUpdateStudentCumulative = (data) => {
  return {
    type: actionType.ADD_UPDATE_STUDENT_CUMULATIVE,
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
export function* getStudentCumulativeGradeByVendor({ vendor_id }) {
  try {
    yield put(setGradeLoading(true))
    const response = yield call(getStudentCumulativeGradeByVendorFromDatabse, vendor_id)
    yield all([
      put(setGradeLoading(false)),
      put({
        type: actionType.CUMULATIVE_GRADE_BY_VENDOR_COMPLETED,
        payload: response
      })
    ])
  } catch (err) {
    yield all([
      put(setGradeLoading(false)),
      put({
        type: actionType.CUMULATIVE_GRADE_BY_VENDOR_COMPLETED,
        payload: []
      })
    ])
  }
}
export function* getStudentCumulativeGradeByUser({ data }) {
  try {
    yield put(setGradeLoading(true))
    const response = yield call(getStudentCumulativeGradeByUserFromDatabse, data)
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

export function* addUpdateStudentCumulative({ data }) {
  try {
    yield put(setGradeEditLoading(true))
    const response = yield call(addUpdateStudentCumulativeToDatabse, data)
    yield all([
      put(setGradeEditLoading(false)),
      put({
        type: actionType.ADD_UPDATE_STUDENT_CUMULATIVE_COMPLETED,
        payload: response
      })
    ])
  } catch (err) {
    yield all([
      put(setGradeEditLoading(false)),
      put({
        type: actionType.ADD_UPDATE_STUDENT_CUMULATIVE_COMPLETED,
        payload: []
      })
    ])
  }
}

