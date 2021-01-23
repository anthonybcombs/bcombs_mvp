import { call, take, put, all } from 'redux-saga/effects'
import graphqlClient from '../../graphql'
import * as actionType from './Constant'
import {
  ATTENDANCE_UPDATE_MUTATION
} from '../../graphql/attendanceMutation';
import {
  GET_ATTENDANCE_QUERY,
  GET_EVENT_ATTENDANCE_QUERY
} from '../../graphql/attendanceQuery';

const updateAttendanceToDatabase = attendance => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('updateAttendanceToDatabase attendance', attendance)
      const { data } = await graphqlClient.mutate({
        mutation: ATTENDANCE_UPDATE_MUTATION,
        variables: { attendance }
      })
      console.log('updateAttendanceToDatabase response', data)
      return resolve(data)
    } catch (error) {
      console.log('updateAttendanceToDatabase error', error)
      reject(error)
    }
  })
}

const getAttendanceToDatabase = (applicationGroupId, attendanceType) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.query({
        query: GET_ATTENDANCE_QUERY,
        variables: {
          application_group_id: applicationGroupId,
          attendance_type: attendanceType
        }
      });
      console.log('getAttendanceToDatabase response', data)
      return resolve(data.getAttendance)
    } catch (error) {
      console.log('getAttendanceToDatabase error', error)
      reject(error)
    }
  })
}


const getEventAttendanceToDatabase = applicationGroupId => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('getEventAttendanceToDatabase',applicationGroupId)
      const { data } = await graphqlClient.query({
        query: GET_EVENT_ATTENDANCE_QUERY,
        variables: {
          application_group_id: applicationGroupId
        }
      });
      console.log('Get Attendance To Database Response', data)
      return resolve(data.getEventAttendance)
    } catch (error) {
      console.log('getAttendanceToDatabase error', error)
      reject(error)
    }
  })
}



export const requestUpdateAttendance = data => {
  return {
    type: actionType.REQUEST_UPDATE_ATTENDANCE,
    data
  }
}

export const requestAttendance = (applicationGroupId,attendanceType = 'bcombs') => {
  return {
    type: actionType.REQUEST_ATTENDANCE,
    applicationGroupId,
    attendanceType
  }
}

export const requestEventAttendance = applicationGroupId => {
  return {
    type: actionType.REQUEST_EVENT_ATTENDANCE,
    applicationGroupId
  }
}



export const setAttendanceList = (data) => {
  return {
    type: actionType.SET_ATTENDANCE_LIST,
    data
  }
}

export const setEventAttendanceList = (data) => {
  return {
    type: actionType.SET_EVENT_ATTENDANCE_LIST,
    data
  }
}

export const requestUpdateAttendanceSuccess = () => {
  return {
    type: actionType.REQUEST_UPDATE_ATTENDANCE_SUCCESS
  }
}




export function* updateAttendance({ data }) {
  try {
    const response = yield call(updateAttendanceToDatabase, data)
    if(response) {
      yield put(requestUpdateAttendanceSuccess());
    }
  } catch (err) {
  }
}

export function* getAttendance({ applicationGroupId, attendanceType }) {
  try {
    const response = yield call(getAttendanceToDatabase, applicationGroupId,attendanceType);
    console.log('getAttendanceeeee ',response )
    if(response) {
      yield put(setAttendanceList(response));
    }
  } catch (err) {
    yield put(setAttendanceList([]));
  }
}

export function* getEventAttendance({ applicationGroupId }) {
  try {
    console.log('GET EVENT ATTENDANCE ',applicationGroupId)
    const response = yield call(getEventAttendanceToDatabase, applicationGroupId);
    
    if(response) {
      yield put(setEventAttendanceList(response));
    }
  } catch (err) {
    yield put(setEventAttendanceList([]));
  }
}