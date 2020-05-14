import { call, take, put } from "redux-saga/effects";
import * as actionType from "./Constant";
import graphqlClient from "../../graphql";
import { CALENDARS_QUERY } from "../../graphql/query";
import {
  CREATE_CALENDAR_MUTATION,
  EDIT_CALENDAR_MUTATON,
} from "../../graphql/mutation";
const addCalendarInDatabase = ({ creds, info }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.mutate({
        mutation: CREATE_CALENDAR_MUTATION,
        variables: { calendar: { creds, info } },
      });
      resolve(data.createCalendar.calendar);
    } catch (error) {
      reject("error");
    }
  });
};
const editCalendarInDatabase = ({ creds, info }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.mutate({
        mutation: EDIT_CALENDAR_MUTATON,
        variables: { calendar: { creds, info } },
      });
      resolve(data.createCalendar.calendar);
    } catch (error) {
      reject("error");
    }
  });
};
const getCalendarFromDatabase = (creds) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.query({
        query: CALENDARS_QUERY,
        variables: creds,
      });
      resolve(data.calendars);
    } catch (error) {
      reject("error");
    }
  });
};
export const requestAddCalendar = (details) => {
  return {
    type: actionType.REQUEST_ADD_CALENDAR,
    name: details.name,
    familyMembers: details.selectedFamilyMembers,
    visibilityType: details.visibilityType,
    image: details.image,
  };
};
export const requestEditCalendar = (details) => {
  return {
    id: details.id,
    type: actionType.REQUEST_EDIT_CALENDAR,
    name: details.name,
    familyMembers: details.selectedFamilyMembers,
    visibilityType: details.visibilityType,
    image: details.image,
    color: details.color,
  };
};
export const requestCalendars = () => {
  return {
    type: actionType.REQUEST_GET_CALENDARS,
  };
};

export function* addCalendar({ name, familyMembers, visibilityType, image }) {
  const calendar = yield call(addCalendarInDatabase, {
    creds: {
      access_token: sessionStorage.getItem("access_token"),
      token_type: sessionStorage.getItem("token_type"),
    },
    info: {
      name,
      familyMembers: Array.from(familyMembers.keys()),
      visibilityType,
      image,
    },
  });
  yield put({
    type: actionType.REQUEST_ADD_CALENDAR_COMPLETED,
    payload: {
      id: calendar.id,
      userid: calendar.user_id,
      name,
      familyMembers: Array.from(familyMembers.keys()),
      image: calendar.image,
      color: calendar.color,
    },
  });
}
export function* gotCalendars() {
  yield take([actionType.REQUEST_AUTH_USER_INFO_COMPLETED]);
  const calendars = yield call(getCalendarFromDatabase, {
    access_token: sessionStorage.getItem("access_token"),
    token_type: sessionStorage.getItem("token_type"),
  });
  yield put({
    type: actionType.REQUEST_GET_CALENDARS_COMPLETED,
    payload: calendars.data,
  });
  yield put({
    type: actionType.REQUEST_STATUS_COMPLETED,
    payload: {
      messageType: "info",
      message: "got calendars",
    },
  });
}
export function* editCalendar({
  id,
  name,
  familyMembers,
  visibilityType,
  image,
  color,
}) {
  const calendar = yield call(editCalendarInDatabase, {
    creds: {
      access_token: sessionStorage.getItem("access_token"),
      token_type: sessionStorage.getItem("token_type"),
    },
    info: {
      id,
      name,
      familyMembers: Array.from(familyMembers.keys()),
      visibilityType,
      image,
      color,
    },
  });
  yield put({
    type: actionType.REQUEST_EDIT_CALENDAR_COMPLETED,
    payload: {
      id: calendar.id,
      userid: calendar.user_id,
      name,
      familyMembers: Array.from(familyMembers.keys()),
      image: calendar.image,
      color: calendar.color,
    },
  });
}
