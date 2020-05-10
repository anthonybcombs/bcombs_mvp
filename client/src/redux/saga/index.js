import createSagaMiddleware from "redux-saga";
import { createStore, compose, applyMiddleware } from "redux";
import { takeLatest, takeEvery } from "redux-saga/effects";
import * as actionType from "../actions/Constant";
import {
  authenticated,
  gotUserInfo,
  loggedOut,
  requestedPasswordChange,
} from "../actions/Auth";
import { addCalendar, gotCalendars } from "../actions/Calendars";
import { deletedEvent, updatedEvent, addedEvent } from "../actions/Events";
import {
  addedContact,
  removedContact,
  updatedContact,
  getUserContact,
} from "../actions/Contacts";
import {
  addedGroup,
  updatedGroup,
  getUserGroup,
  removeGroup,
} from "../actions/Groups";
import { addedRelative } from "../actions//Relatives";
import {
  addedUser,
  updatedUser,
  checkedUserAndAdd,
  getUserInfo,
  updateUserProfile,
  updateUserProfilePhoto,
} from "../actions/Users";
import { gotUserTypes } from "../actions/UserTypes";
import { requestedStatus, removedStatus } from "../actions/Status";
import reducer from "../reducers";
function* rootSaga() {
  //STATUS
  yield takeLatest(actionType.REQUEST_STATUS, requestedStatus);
  yield takeLatest(actionType.REQUEST_REMOVE_STATUS, removedStatus);
  //AUTH
  yield takeLatest(actionType.REQUEST_AUTH, authenticated);
  yield takeLatest(actionType.REQUEST_AUTH_USER_INFO, gotUserInfo);
  yield takeLatest(actionType.REQUEST_AUTH_LOGOUT, loggedOut);
  yield takeLatest(actionType.REQUEST_CHANGE_PASSWORD, requestedPasswordChange);
  //CALENDAR
  yield takeLatest(actionType.REQUEST_ADD_CALENDAR, addCalendar);
  yield takeLatest(actionType.REQUEST_GET_CALENDARS, gotCalendars);
  //EVENTS
  yield takeLatest(actionType.REQUEST_ADD_EVENT, addedEvent);
  yield takeLatest(actionType.REQUEST_DELETE_EVENT, deletedEvent);
  yield takeLatest(actionType.REQUEST_UPDATE_EVENT, updatedEvent);
  //CONTACTS
  yield takeLatest(actionType.REQUEST_ADD_CONTACT, addedContact);
  yield takeEvery(actionType.REQUEST_UPDATE_CONTACT, updatedContact);
  yield takeLatest(actionType.REQUEST_REMOVE_CONTACT, removedContact);
  yield takeLatest(actionType.REQUEST_USER_CONTACT, getUserContact);
  //GROUPS
  yield takeLatest(actionType.REQUEST_ADD_GROUP, addedGroup);
  yield takeLatest(actionType.REQUEST_UPDATE_GROUP, updatedGroup);
  yield takeLatest(actionType.REQUEST_DELETE_GROUP, removeGroup);
  //RELATIVES
  yield takeLatest(actionType.REQUEST_ADD_RELATIVE, addedRelative);
  //USERS
  yield takeLatest(actionType.REQUEST_ADD_USER, addedUser);
  yield takeLatest(actionType.REQUEST_UPDATE_USER, updatedUser);
  yield takeLatest(actionType.REQUEST_CHECK_USER_AND_ADD, checkedUserAndAdd);
  //USER TYPES
  yield takeLatest(actionType.REQUEST_USER_TYPES, gotUserTypes);

  // ADDED BY DENNIS
  yield takeLatest(actionType.REQUEST_UPDATE_USER_PROFILE, updateUserProfile);
  yield takeLatest(actionType.REQUEST_USER_PROFILE, getUserInfo);
  yield takeLatest(
    actionType.REQUEST_UPDATE_USER_PHOTO,
    updateUserProfilePhoto
  );
  yield takeLatest(actionType.REQUEST_USER_GROUPS, getUserGroup);
}
const sagaMiddleware = createSagaMiddleware();

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
  reducer,
  composeEnhancer(applyMiddleware(sagaMiddleware))
);
// then run the saga
sagaMiddleware.run(rootSaga);
