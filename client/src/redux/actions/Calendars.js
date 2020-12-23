import { call, take, put } from "redux-saga/effects";
import * as actionType from "./Constant";
import graphqlClient from "../../graphql";
import { CALENDARS_QUERY, CALENDAR_QUERY } from "../../graphql/query";
import {
  CREATE_CALENDAR_MUTATION,
  EDIT_CALENDAR_MUTATON,
  DELETE_CALENDAR_MUTATION,
  CLONE_CALENDAR_MUTATION
} from "../../graphql/mutation";
import { getEvents } from "./Events";
import { getContact } from "./Contacts";
import { requestUserGroup } from "./Groups";
import { groupBy } from "../../helpers/Arrays";
const addCalendarInDatabase = ({ creds, info }) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('Add Calendar ini Database', info)
      const { data } = await graphqlClient.mutate({
        mutation: CREATE_CALENDAR_MUTATION,
        variables: { calendar: { creds, info } }
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
        variables: { calendar: { creds, info } }
      });
      resolve(data.editCalendar.calendar);
    } catch (error) {
      reject("error");
    }
  });
};
const deleteCalendarInDatabase = ({ creds, info }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.mutate({
        mutation: DELETE_CALENDAR_MUTATION,
        variables: { calendar: { creds, info } }
      });
      resolve(data.deleteCalendar.calendar);
    } catch (error) {
      console.log(error);
      reject("error");
    }
  });
};
const cloneCalendarInDatabase = ({ creds, info }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.mutate({
        mutation: CLONE_CALENDAR_MUTATION,
        variables: { calendar: { creds, info } }
      });
      resolve("success");
    } catch (error) {
      console.log(error);
      reject("error");
    }
  });
};
const getCalendarFromDatabase = id => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.query({
        query: CALENDAR_QUERY,
        variables: { id }
      });
      console.log("data.calendar", data.calendar);
      resolve(data.calendar);
    } catch (error) {
      reject("error");
    }
  });
};
const getCalendarsFromDatabase = creds => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.query({
        query: CALENDARS_QUERY,
        variables: creds
      });
      resolve(data.calendars);
    } catch (error) {
      reject("error");
    }
  });
};
export const requestAddCalendar = details => {
  return {
    type: actionType.REQUEST_ADD_CALENDAR,
    name: details.name,
    familyMembers: details.selectedFamilyMembers,
    visibilityType: details.visibilityType,
    image: details.image,
    groups: details.groups,
    app_group_ids: details.app_group_ids
  };
};
export const requestEditCalendar = details => {
  return {
    id: details.id,
    type: actionType.REQUEST_EDIT_CALENDAR,
    name: details.name,
    familyMembers: details.selectedFamilyMembers,
    visibilityType: details.visibilityType,
    image: details.image,
    color: details.color,
    groups: details.groups,
    app_group_ids: details.app_group_ids
  };
};
export const requestDeleteCalendar = details => {
  return {
    id: details.id,
    type: actionType.REQUEST_DELETE_CALENDAR,
    name: details.name,
    familyMembers: details.familyMembers,
    visibilityType: details.visibilityType,
    image: details.image,
    color: details.color
  };
};
export const requestCalendars = () => {
  console.log("REQUEST GET CALENDAR");
  return {
    type: actionType.REQUEST_GET_CALENDARS
  };
};
export const requestCalendar = id => {
  return {
    type: actionType.REQUEST_GET_CALENDAR,
    id
  };
};
export const requestCloneCelander = calendar => {
  return {
    type: actionType.REQUEST_CLONE_CALENDAR,
    calendar
  };
};
export function* addCalendar({
  name,
  familyMembers,
  visibilityType,
  image,
  groups,
  app_group_ids
}) {
  try {
    const response = yield call(addCalendarInDatabase, {
      creds: {
        access_token: sessionStorage.getItem("access_token"),
        token_type: sessionStorage.getItem("token_type")
      },
      info: {
        name,
        familyMembers: Array.from(familyMembers.keys()),
        visibilityType,
        image,
        groups,
        app_group_ids
      }
    });

    if (response && response.id) {
      let selectedCalendars =
        sessionStorage.getItem("selectedCalendars") !== null
          ? JSON.parse(sessionStorage.getItem("selectedCalendars"))
          : [];

      sessionStorage.setItem(
        "selectedCalendars",
        JSON.stringify([...selectedCalendars, response.id])
      );
    }

    yield put(requestCalendars());
    yield put({
      type: actionType.REQUEST_ADD_CALENDAR_COMPLETED
    });
  } catch (err) {}
  // yield put({
  //   type: actionType.REQUEST_STATUS_COMPLETED,
  //   payload: {
  //     messageType: "info",
  //     message: "added calendar.",
  //   },
  // });
}
export function* gotCalendars() {
  yield take([
    actionType.REQUEST_EDIT_CALENDAR_COMPLETED,
    actionType.REQUEST_ADD_CALENDAR_COMPLETED,
    actionType.REQUEST_DELETE_CALENDAR_COMPLETED,
    actionType.REQUEST_AUTH_USER_INFO_COMPLETED,
    actionType.REQUEST_CLONE_CALENDAR_COMPLETED
  ]);

  const calendars = yield call(getCalendarsFromDatabase, {
    access_token: sessionStorage.getItem("access_token"),
    token_type: sessionStorage.getItem("token_type")
  });

  if (calendars && calendars.data && calendars.data.length > 0) {
    let selectedCalendars =
      localStorage.getItem("selectedCalendars") !== null
        ? JSON.parse(localStorage.getItem("selectedCalendars"))
        : [];

    selectedCalendars =
      selectedCalendars &&
      selectedCalendars.filter(calendarId => {
        return calendars.data.find(calendar => calendar.id === calendarId);
      });

    localStorage.setItem(
      "selectedCalendars",
      JSON.stringify([...(selectedCalendars || [])])
    );
  }

  console.log("Calendars Data", calendars.data);
  yield put({
    type: actionType.REQUEST_GET_CALENDARS_COMPLETED,
    payload: groupBy(calendars.data, 3)
  });
  yield put({
    type: actionType.REQUEST_STATUS_COMPLETED,
    payload: {
      messageType: "info",
      message: "got calendars"
    }
  });
}
export function* gotCalendar({ id }) {
  console.log("gotCalendar id", id);
  const calendars = yield call(getCalendarFromDatabase, id);
  yield put(getEvents(calendars.data[0].email));
  yield put(getContact(calendars.data[0].email));
  yield put(requestUserGroup(calendars.data[0].email));
  yield put({
    type: actionType.REQUEST_GET_CALENDAR_COMPLETED,
    payload: groupBy(calendars.data, 3)
  });
}
export function* editCalendar({
  id,
  name,
  familyMembers,
  visibilityType,
  image,
  color,
  groups
}) {
  yield call(editCalendarInDatabase, {
    creds: {
      access_token: sessionStorage.getItem("access_token"),
      token_type: sessionStorage.getItem("token_type")
    },
    info: {
      id,
      name,
      familyMembers: Array.from(familyMembers.keys()),
      visibilityType,
      image,
      color,
      groups
    }
  });
  yield put(requestCalendars());
  yield put({
    type: actionType.REQUEST_EDIT_CALENDAR_COMPLETED
  });
  // yield put({
  //   type: actionType.REQUEST_STATUS_COMPLETED,
  //   payload: {
  //     messageType: "info",
  //     message: "updated calendar.",
  //   },
  // });
}

export function* deleteCalendar({
  id,
  name,
  visibilityType,
  familyMembers,
  image,
  color
}) {
  const calendar = yield call(deleteCalendarInDatabase, {
    creds: {
      access_token: sessionStorage.getItem("access_token"),
      token_type: sessionStorage.getItem("token_type")
    },
    info: {
      id,
      name,
      familyMembers,
      visibilityType,
      image,
      color
    }
  });
  yield put(requestCalendars());
  yield put({
    type: actionType.REQUEST_DELETE_CALENDAR_COMPLETED,
    payload: {
      id: calendar.id
    }
  });
  // yield put({
  //   type: actionType.REQUEST_STATUS_COMPLETED,
  //   payload: {
  //     messageType: "info",
  //     message: "deleted calendar.",
  //   },
  // });
}
export function* clonedCalendar({ calendar }) {
  yield call(cloneCalendarInDatabase, {
    creds: {
      access_token: sessionStorage.getItem("access_token"),
      token_type: sessionStorage.getItem("token_type")
    },
    info: {
      ...calendar
    }
  });
  yield put(requestCalendars());
  yield put({
    type: actionType.REQUEST_CLONE_CALENDAR_COMPLETED
  });
  // yield put({
  //   type: actionType.REQUEST_STATUS_COMPLETED,
  //   payload: {
  //     messageType: "info",
  //     message: "deleted calendar.",
  //   },
  // });
}
