import createSagaMiddleware from "redux-saga";
import { createStore, compose, applyMiddleware } from "redux";
import { takeLatest, takeEvery } from "redux-saga/effects";
import * as actionType from "../actions/Constant";
import {
  authenticated,
  gotUserInfo,
  loggedOut,
  requestedPasswordChange,
  removedAuthMessages
} from "../actions/Auth";
import { addCalendar } from "../actions/Calendars";
import { deletedEvent, updatedEvent, addedEvent } from "../actions/Events";
import {
  addedContact,
  removedContact,
  updatedContact
} from "../actions/Contacts";
import { addedGroup, updatedGroup } from "../actions/Groups";
import { addedRelative } from "../actions//Relatives";
import { addedUser } from "../actions//Users";
import { gotUserTypes } from "../actions/UserTypes";
import { requestedStatus, removedStatus } from "../actions/Status";
import reducer from "../reducers";
function* rootSaga() {
  //AUTH
  yield takeLatest(actionType.REQUEST_AUTH, authenticated);
  yield takeLatest(actionType.REQUEST_AUTH_USER_INFO, gotUserInfo);
  yield takeLatest(actionType.REQUEST_AUTH_LOGOUT, loggedOut);
  yield takeLatest(actionType.REQUEST_CHANGE_PASSWORD, requestedPasswordChange);
  //CALENDAR
  yield takeLatest(actionType.REQUEST_ADD_CALENDAR, addCalendar);
  //EVENTS
  yield takeLatest(actionType.REQUEST_ADD_EVENT, addedEvent);
  yield takeLatest(actionType.REQUEST_DELETE_EVENT, deletedEvent);
  yield takeLatest(actionType.REQUEST_UPDATE_EVENT, updatedEvent);
  //CONTACTS
  yield takeLatest(actionType.REQUEST_ADD_CONTACT, addedContact);
  yield takeEvery(actionType.REQUEST_UPDATE_CONTACT, updatedContact);
  yield takeLatest(actionType.REQUEST_REMOVE_CONTACT, removedContact);
  //GROUPS
  yield takeLatest(actionType.REQUEST_ADD_GROUP, addedGroup);
  yield takeEvery(actionType.REQUEST_UPDATE_GROUP, updatedGroup);
  //RELATIVES
  yield takeLatest(actionType.REQUEST_ADD_RELATIVE, addedRelative);
  //USERS
  yield takeLatest(actionType.REQUEST_ADD_USER, addedUser);
  //USER TYPES
  yield takeLatest(actionType.REQUEST_USER_TYPES, gotUserTypes);
  //STATUS
  yield takeLatest(actionType.REQUEST_STATUS, requestedStatus);
  yield takeLatest(actionType.REQUEST_REMOVE_STATUS, removedStatus);
}
const sagaMiddleware = createSagaMiddleware();

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
  reducer,
  composeEnhancer(applyMiddleware(sagaMiddleware))
);
// then run the saga
sagaMiddleware.run(rootSaga);
