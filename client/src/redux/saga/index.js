import createSagaMiddleware from "redux-saga";
import { createStore, compose, applyMiddleware } from "redux";
import { takeLatest, takeEvery, call } from "redux-saga/effects";
import * as actionType from "../actions/Constant";
import {
  authenticated,
  gotUserInfo,
  loggedOut,
  requestedPasswordChange
} from "../actions/Auth";
import {
  addCalendar,
  editCalendar,
  gotCalendars,
  gotCalendar,
  deleteCalendar
} from "../actions/Calendars";
import {
  deletedEvent,
  updatedEvent,
  addedEvent,
  getUserEvents
} from "../actions/Events";
import {
  addedContact,
  removedContact,
  updatedContact,
  getUserContact
} from "../actions/Contacts";
import {
  addedGroup,
  updatedGroup,
  getUserGroup,
  removeGroup,
  getMembers,
  getUserGroupProtectedRoute
} from "../actions/Groups";
import { addedRelative } from "../actions//Relatives";
import {
  addedUser,
  updatedUser,
  checkedUserAndAdd,
  getUserInfo,
  updateUserProfile,
  updateUserProfilePhoto
} from "../actions/Users";
import { gotUserTypes } from "../actions/UserTypes";

import { gotFamilyMembers } from "../actions/FamilyMembers";

import { getGrades } from "../actions/Grades";

import { requestedStatus, removedStatus } from "../actions/Status";

import { getVendor, updateVendor } from "../actions/Vendors";

import {
  addApplication,
  getApplication,
  getUserApplication
} from "../actions/Application";
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
  yield takeLatest(actionType.REQUEST_EDIT_CALENDAR, editCalendar);
  yield takeLatest(actionType.REQUEST_GET_CALENDARS, gotCalendars);
  yield takeLatest(actionType.REQUEST_GET_CALENDAR, gotCalendar);
  yield takeLatest(actionType.REQUEST_DELETE_CALENDAR, deleteCalendar);
  //EVENTS
  yield takeLatest(actionType.REQUEST_ADD_EVENT, addedEvent);
  yield takeLatest(actionType.REQUEST_DELETE_EVENT, deletedEvent);
  yield takeLatest(actionType.REQUEST_UPDATE_EVENT, updatedEvent);
  yield takeLatest(actionType.REQUEST_EVENTS, getUserEvents);
  //CONTACTS
  yield takeLatest(actionType.REQUEST_ADD_CONTACT, addedContact);
  yield takeEvery(actionType.REQUEST_UPDATE_CONTACT, updatedContact);
  yield takeLatest(actionType.REQUEST_REMOVE_CONTACT, removedContact);
  yield takeLatest(actionType.REQUEST_USER_CONTACT, getUserContact);
  //GROUPS
  yield takeLatest(actionType.REQUEST_ADD_GROUP, addedGroup);
  yield takeLatest(actionType.REQUEST_UPDATE_GROUP, updatedGroup);
  yield takeLatest(actionType.REQUEST_DELETE_GROUP, removeGroup);
  yield takeLatest(
    actionType.REQUEST_USER_GROUPS_PROTECTED_ROUTE,
    getUserGroupProtectedRoute
  );
  //RELATIVES
  yield takeLatest(actionType.REQUEST_ADD_RELATIVE, addedRelative);
  //USERS
  yield takeLatest(actionType.REQUEST_ADD_USER, addedUser);
  yield takeLatest(actionType.REQUEST_UPDATE_USER, updatedUser);
  yield takeLatest(actionType.REQUEST_CHECK_USER_AND_ADD, checkedUserAndAdd);
  //USER TYPES
  yield takeLatest(actionType.REQUEST_USER_TYPES, gotUserTypes);
  //FAMILY MEMBERS
  yield takeLatest(actionType.REQUEST_FAMILY_MEMBERS, gotFamilyMembers);
  // ADDED BY DENNIS
  yield takeLatest(actionType.REQUEST_UPDATE_USER_PROFILE, updateUserProfile);
  yield takeLatest(actionType.REQUEST_USER_PROFILE, getUserInfo);
  yield takeLatest(
    actionType.REQUEST_UPDATE_USER_PHOTO,
    updateUserProfilePhoto
  );
  yield takeLatest(actionType.REQUEST_USER_GROUPS, getUserGroup);
  yield takeLatest(actionType.REQUEST_MEMBERS, getMembers);

  //ADDED BY JEROME
  yield takeLatest(actionType.REQUEST_GRADES, getGrades);
  yield takeLatest(actionType.REQUEST_VENDOR, getVendor);
  yield takeLatest(actionType.REQUEST_UPDATE_VENDOR, updateVendor);
  yield takeLatest(actionType.REQUEST_ADD_APPLICATION, addApplication);
  yield takeLatest(actionType.REQUEST_GET_APPLICATION, getApplication);
  yield takeLatest(actionType.REQUEST_USER_APPLICATIONS, getUserApplication);
}
const sagaMiddleware = createSagaMiddleware();

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
  reducer,
  composeEnhancer(applyMiddleware(sagaMiddleware))
);
// then run the saga
sagaMiddleware.run(rootSaga);
