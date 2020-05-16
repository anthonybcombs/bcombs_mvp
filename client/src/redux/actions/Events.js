import { call, take, put } from "redux-saga/effects";
import * as actionType from "./Constant";

import graphqlClient from "../../graphql";
import { GET_EVENT_QUERY } from "../../graphql/eventQuery";
import {
  EVENT_CREATE_MUTATION,
  EVENT_UPDATE_MUTATION,
  EVENT_DELETE_MUTATION
} from "../../graphql/eventMutation";

const getEventsToDatabase = async email => {
  try {
    const { data } = await graphqlClient.query({
      query: GET_EVENT_QUERY,
      variables: {
        email
      }
    });
    return data.getEvents;
  } catch (error) {
    console.log("getEventsToDatabase error", error);
  }
};

const addEventInDatabase = async event => {
  try {
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
const deleteEventInDatabase = async event => {
  try {
    console.log("Eventtttt", event);
    const { data } = await graphqlClient.mutate({
      mutation: EVENT_DELETE_MUTATION,
      variables: {
        id: event.id,
        email: event.email
      }
    });
    return data.deleteEvent;
  } catch (error) {
    console.log("deleteEventInDatabase error", error);
  }
};
const updateEventInDatabase = async event => {
  try {
    console.log("Update Event Database", event);
    const { data } = await graphqlClient.mutate({
      mutation: EVENT_UPDATE_MUTATION,
      variables: {
        event: {
          ...event
        }
      }
    });

    console.log("addEventInDatabase data", data);
    return data.updateEvent;
  } catch (error) {
    console.log("addEventInDatabase error", error);
  }
};
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

export const setEventList = data => {
  return {
    typ: actionType.REQUEST_EVENTS_COMPLETED,
    payload: data
  };
};

export function* addedEvent({ event }) {
  const response = yield call(addEventInDatabase, event);
  yield put({
    type: actionType.REQUEST_EVENTS_COMPLETED,
    payload: response
  });
}
export function* deletedEvent({ event }) {
  try {
    const response = yield call(deleteEventInDatabase, event);

    yield put({
      type: actionType.REQUEST_EVENTS_COMPLETED,
      payload: response
    });
  } catch (err) {}
}
export function* updatedEvent({ event }) {
  try {
    const response = yield call(updateEventInDatabase, event);

    yield put({
      type: actionType.REQUEST_EVENTS_COMPLETED,
      payload: response
    });
  } catch (err) {}
}

export function* getUserEvents(action) {
  try {
    const response = yield call(getEventsToDatabase, action.email);

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
