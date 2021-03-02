import { call, take, put } from "redux-saga/effects";
import * as actionType from "./Constant";
import { format, isWithinInterval, parseISO } from "date-fns";
import { setEventLoading } from "./Loading";

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
    console.log('Data Get Events To Database', data)
    return data.getEvents;
  } catch (error) {
    console.log("getEventsToDatabase error", error);
  }
};

const addEventInDatabase = async event => {
  try {
    console.log("addEventInDatabase event", event);
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

    console.log("updateEventInDatabase data", data);
    return data.updateEvent;
  } catch (error) {
    console.log("updateEventInDatabase error", error);
  }
};
export const addEvent = event => {
  return {
    type: actionType.REQUEST_ADD_EVENT,
    event
  };
};
export const requestSearchEvents = searchDetails => {
  return {
    type: actionType.REQUEST_SEARCH_EVENTS,
    searchDetails
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
  try {
    yield put(setEventLoading(true));
    const response = yield call(addEventInDatabase, event);
    yield put({
      type: actionType.REQUEST_EVENTS_COMPLETED,
      payload: response
    });
    yield put(setEventLoading(false));
  } catch (error) {
    console.log("Error addedEvent", error);
    yield put({
      type: actionType.REQUEST_EVENTS_COMPLETED,
      payload: []
    });
    yield put(setEventLoading(false));
  }
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
    yield put(setEventLoading(true));
    const response = yield call(getEventsToDatabase, action.email);
    yield put({
      type: actionType.REQUEST_EVENTS_COMPLETED,
      payload: response
    });
    yield put(setEventLoading(false));
  } catch (err) {
    console.log("error getUserEvents", err);
    yield put({
      type: actionType.REQUEST_EVENTS_COMPLETED,
      payload: []
    });
    yield put(setEventLoading(false));
  }
}
export function* searchedEvents({ searchDetails }) {
  try {
    yield put(setEventLoading(true));
    const events = yield call(getEventsToDatabase, searchDetails.email);
    if (
      searchDetails.name.length === 0 &&
      searchDetails.location.length === 0 &&
      searchDetails.startDate.length === 0 &&
      searchDetails.endDate.length === 0
    ) {
      yield put({
        type: actionType.REQUEST_SEARCH_EVENTS_COMPLETED,
        payload: events.filter(
          event =>
            searchDetails.calendars.length > 0 &&
            searchDetails.calendars.includes(event.calendar_id)
        )
      });
    } else {
      let filteredEvents = events.filter(event => {
        return (
          (searchDetails.name.length > 0 &&
            event.name.includes(searchDetails.name)) ||
          (searchDetails.location.length > 0 &&
            event.location.includes(searchDetails.location)) ||
          (searchDetails.startDate.length > 0 &&
            searchDetails.endDate.length > 0 &&
            isWithinInterval(new Date(event.start_of_event), {
              start: new Date(searchDetails.startDate),
              end: new Date(searchDetails.endDate)
            }))
        );
      });
      yield put({
        type: actionType.REQUEST_SEARCH_EVENTS_COMPLETED,
        payload: filteredEvents
      });
      if (filteredEvents.length === 0) {
        alert("No events found");
      }
    }
    yield put(setEventLoading(false));
  } catch (err) {
    yield put({
      type: actionType.REQUEST_SEARCH_EVENTS_COMPLETED,
      payload: []
    });
    yield put(setEventLoading(false));
  }
}
