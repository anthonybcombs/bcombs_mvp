import { call, take, put } from "redux-saga/effects";
import * as actionType from "./Constant";

import graphqlClient from "../../graphql";
import { GET_EVENT_QUERY } from "../../graphql/eventQuery";
import { EVENT_CREATE_MUTATION } from "../../graphql/eventMutation";

const getEventsToDatabase = async email => {
  try {
    const { data } = await graphqlClient.query({
      query: GET_EVENT_QUERY,
      variables: {
        email
      }
    });

    console.log("getEventsToDatabase data", data);
    return data.getEvents;
  } catch (error) {
    console.log("getEventsToDatabase error", error);
  }
};

const addEventInDatabase = async event => {
  try {
    console.log("EVentttttttttt", event);
    const { data } = await graphqlClient.mutate({
      mutation: EVENT_CREATE_MUTATION,
      variables: {
        event: {
          ...event
        }
      }
    });

    console.log("addEventInDatabase data", data);
    return data.createEvent;
  } catch (error) {
    console.log("addEventInDatabase error", error);
  }
};
const deleteEventInDatabase = event => {};
const updateEventInDatabase = event => {};
export const addEvent = event => {
  return {
    type: actionType.REQUEST_ADD_EVENT,
    event
  };
};
export const deleteEvent = event => {
  return {
    type: actionType.REQUEST_DELETE_EVENT,
    event
  };
};
export const updateEvent = event => {
  return {
    type: actionType.REQUEST_UPDATE_EVENT,
    event
  };
};

export const getEvents = email => {
  return {
    type: actionType.REQUEST_EVENTS,
    email
  };
};

export function* addedEvent({ event }) {
  yield call(addEventInDatabase, event);
  yield put({
    type: actionType.REQUEST_ADD_EVENT_COMPLETED,
    payload: event
  });
}
export function* deletedEvent({ event }) {
  yield call(deleteEventInDatabase, [event]);
  yield put({
    type: actionType.REQUEST_DELETE_EVENT_COMPLETED,
    payload: event
  });
}
export function* updatedEvent({ event }) {
  yield call(updateEventInDatabase, [event]);
  yield put({
    type: actionType.REQUEST_UPDATE_EVENT_COMPLETED,
    payload: event
  });
}

export function* getUserEvents(action) {
  try {
    const response = yield call(getEventsToDatabase, action.email);
    console.log("getUserEvents response", response);
    yield put({
      type: actionType.REQUEST_EVENTS_COMPLETED,
      payload: response
    });
  } catch (err) {
    console.log("error1", err);
    yield put({
      type: actionType.REQUEST_EVENTS_COMPLETED,
      payload: []
    });
  }
}
