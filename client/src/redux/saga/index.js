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
  deleteCalendar,
  clonedCalendar
} from "../actions/Calendars";
import {
  deletedEvent,
  updatedEvent,
  addedEvent,
  getUserEvents,
  searchedEvents
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
  getSecurityQuestions,
  updateUserProfile,
  updateUserProfilePhoto
} from "../actions/Users";
import { gotUserTypes } from "../actions/UserTypes";

import { gotFamilyMembers } from "../actions/FamilyMembers";

import {
  getGrades,
  getStudentCumulativeGradeByAppGroup,
  getStudentCumulativeGradeByUser,
  addUpdateStudentStandardizedTest,
  deleteStudentStandardizedTest,
  addUpdateStudentCumulative
} from "../actions/Grades";

import { requestedStatus, removedStatus } from "../actions/Status";

import { 
  getVendor,
  getUserVendorForms,
  updateVendor, 
  getVendorById2, 
  getVendorById,
  getVendorAdmins, 
  addAdmin,
  deleteAdmins,
  updateAdmin,
  getFormAppGroup,
  getVendorAppGroups,
} from "../actions/Vendors";

import {
  addApplication,
  getApplication,
  getUserApplication,
  updateApplication,
  archivedApplication,
  unarchivedApplication,
  getArchivedApplication,
  getApplicationById,
  saveApplication,
  getApplicationByUserId,
  getApplicationHistory,
  getUserApplicationHistory,
  getCustomApplications,
  getCustomApplicationById,
  getCustomApplicationByVendors
} from "../actions/Application";

import {
  addVendorAppGroup,
  editVendorAppGroup,
  deleteVendorAppGroup
} from "../actions/VendorAppGroups";

import {
  getForms,
  addForm,
  getFormById,
  updateForm,
  deleteForm,
  submitForm,
  updateSubmittedForm,
  getCustomApplicationHistory
} from "../actions/FormBuilder";

import { requestUpdateAttendance, updateAttendance,getAttendance,getEventAttendance } from "../actions/Attendance";

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
  yield takeLatest(actionType.REQUEST_CLONE_CALENDAR, clonedCalendar);
  //EVENTS
  yield takeLatest(actionType.REQUEST_ADD_EVENT, addedEvent);
  yield takeLatest(actionType.REQUEST_DELETE_EVENT, deletedEvent);
  yield takeLatest(actionType.REQUEST_UPDATE_EVENT, updatedEvent);
  yield takeLatest(actionType.REQUEST_EVENTS, getUserEvents);
  yield takeLatest(actionType.REQUEST_SEARCH_EVENTS, searchedEvents);
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
  yield takeLatest(actionType.REQUEST_SECURITY_QUESTIONS, getSecurityQuestions);
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
  yield takeLatest(actionType.REQUEST_UPDATE_APPLICATION, updateApplication);

  yield takeLatest(
    actionType.REQUEST_ARCHIVED_APPLICATION,
    archivedApplication
  );
  yield takeLatest(
    actionType.REQUEST_UNARCHIVED_APPLICATION,
    unarchivedApplication
  );

  yield takeLatest(
    actionType.REQUEST_GET_ARCHIVED_APPLICATION,
    getArchivedApplication
  );
  yield takeLatest(actionType.REQUEST_GET_APPLICATION_ID, getApplicationById);
  yield takeLatest(actionType.REQUEST_ADD_VENDOR_APP_GROUP, addVendorAppGroup);
  yield takeLatest(actionType.REQUEST_SAVE_APPLICATION, saveApplication);
  yield takeLatest(
    actionType.REQUEST_GET_APPLICATION_USER_ID,
    getApplicationByUserId
  );

  yield takeLatest(
    actionType.REQUEST_EDIT_VENDOR_APP_GROUP,
    editVendorAppGroup
  );

  yield takeLatest(
    actionType.REQUEST_DELETE_VENDOR_APP_GROUP,
    deleteVendorAppGroup
  );

  yield takeLatest(
    actionType.REQUEST_GET_APPLICATION_HISTORY,
    getApplicationHistory
  );

  yield takeLatest(
    actionType.REQUEST_GET_USER_APPLICATION_HISTORY,
    getUserApplicationHistory
  );

  yield takeLatest(
    actionType.REQUEST_VENDOR_BY_ID2,
    getVendorById2
  );

  yield takeLatest(
    actionType.REQUEST_VENDOR_BY_ID,
    getVendorById
  );

  yield takeLatest(
    actionType.REQUEST_GET_VENDOR_ADMINS,
    getVendorAdmins
  );

  yield takeLatest(
    actionType.REQUEST_ADD_ADMIN,
    addAdmin
  );

  yield takeLatest(
    actionType.REQUEST_UPDATE_ADMIN,
    updateAdmin
  );

  yield takeLatest(
    actionType.REQUEST_DELETE_ADMINS,
    deleteAdmins
  );

  yield takeLatest(
    actionType.REQUEST_USER_VENDOR_FORMS,
    getUserVendorForms
  )

  yield takeLatest(
    actionType.REQUEST_GET_FORM_APP_GROUP,
    getFormAppGroup
  )

  // Added by Jeff for Form Builder
  yield takeLatest(actionType.REQUEST_GET_FORMS, getForms);
  yield takeLatest(actionType.REQUEST_ADD_FORM, addForm);
  yield takeLatest(actionType.REQUEST_GET_FORM_ID, getFormById);
  yield takeLatest(actionType.REQUEST_UPDATE_FORM, updateForm);
  yield takeLatest(actionType.REQUEST_DELETE_FORM, deleteForm);
  yield takeLatest(actionType.REQUEST_DELETE_FORM, deleteForm);
  yield takeLatest(actionType.REQUEST_SUBMIT_FORM, submitForm);

  yield takeLatest(
    actionType.REQUEST_GET_CUSTOM_APPLICATION,
    getCustomApplications
  );

  yield takeLatest(
    actionType.REQUEST_GET_CUSTOM_APPLICATION_BY_ID,
    getCustomApplicationById
  );

  yield takeLatest(
    actionType.REQUEST_UPDATE_SUBMITTED_FORM,
    updateSubmittedForm
  );

  yield takeLatest(
    actionType.REQUEST_CUSTOM_APPLICATION_HISTORY,
    getCustomApplicationHistory
  );

  yield takeLatest(actionType.REQUEST_UPDATE_ATTENDANCE, updateAttendance);
  yield takeLatest(actionType.REQUEST_ATTENDANCE, getAttendance);
  yield takeLatest(actionType.REQUEST_EVENT_ATTENDANCE, getEventAttendance);
  yield takeLatest(actionType.REQUEST_VENDOR_APP_GROUPS,getVendorAppGroups)
  yield takeLatest(actionType.REQUEST_CUSTOM_APPLICATION_BY_VENDOR,getCustomApplicationByVendors)
  yield takeLatest(actionType.CUMULATIVE_GRADE_BY_APP_GROUP, getStudentCumulativeGradeByAppGroup)
  yield takeLatest(actionType.CUMULATIVE_GRADE_BY_USER, getStudentCumulativeGradeByUser)
  yield takeLatest(actionType.ADD_UPDATE_STUDENT_STANDARD_TEST, addUpdateStudentStandardizedTest)
  yield takeLatest(actionType.DELETE_STUDENT_STANDARDIZED_TEST, deleteStudentStandardizedTest)
  yield takeLatest(actionType.ADD_UPDATE_STUDENT_CUMULATIVE, addUpdateStudentCumulative)
}
const sagaMiddleware = createSagaMiddleware();

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
export const store = createStore(
  reducer,
  composeEnhancer(applyMiddleware(sagaMiddleware))
);
// then run the saga
sagaMiddleware.run(rootSaga);
