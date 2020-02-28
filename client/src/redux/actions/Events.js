import { call, take, put } from "redux-saga/effects";
import * as actionType from "./Constant";
const addEventInDatabase = event => {};
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

export function* addedEvent({ event }) {
  yield call(addEventInDatabase, [event]);
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
