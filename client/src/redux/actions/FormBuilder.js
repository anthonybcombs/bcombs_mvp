import { call, take, put } from "redux-saga/effects";
import graphqlClient from "../../graphql";
import * as actionType from "./Constant";

import {
  setAddFormLoading
} from "./Loading";

const addFormToDatabse = admin => {
  return new Promise(async (resolve, reject) => {
    try {
      
    } catch (error) {
      reject(error);
    }
  });
};
const getFormsFromDatabase = vendor_id => {
  return new Promise(async (resolve, reject) => {
    try {
    } catch (error) {
      console.log("Get forms error", error);
      reject(error);
    }
  });
};
const getFormIdFromDatabase = id => {
  return new Promise(async (resolve, reject) => {
    try {

    } catch (error) {
      reject(error);
    }
  });
};


export const requestGetForms = vendor_id => {
  return {
    type: actionType.REQUEST_GET_FORMS,
    vendor_id: vendor_id
  };
};
export const requestAddForm = form => {
  return {
    type: actionType.REQUEST_ADD_FORM,
    form
  };
};
export const requestGetFormById = id => {
  return {
    type: actionType.REQUEST_GET_FORM_ID,
    id: id
  };
};



export function* getForms({ vendor_id }) {
  console.log('@GET FORM', vendor_id)
  return
  try {
    yield put(setAddFormLoading(true));
    const forms = yield call(getFormsFromDatabase, vendor_id);
    yield put(setAddFormLoading(false));
    if (forms && forms.length > 0) {
      yield put({
        type: actionType.REQUEST_GET_FORMS_COMPLETED,
        payload: forms
      });
    } else {
      yield put({
        type: actionType.REQUEST_GET_FORMS_COMPLETED,
        payload: []
      });
    }
  } catch (err) {
    console.log("Error", err);
    yield put(setAddFormLoading(false));
    yield put({
      type: actionType.REQUEST_GET_APPLICATION_COMPLETED,
      payload: []
    });
  }
}
export function* addForm({ form }) {
  console.log('@ADD FORM', form)
  return
  try {
    yield put(setAddFormLoading(true));
    const response = yield call(addFormToDatabse, form);
    yield put(setAddFormLoading(false));
    // yield put({
    //   type: actionType.REQUEST_GET_FORMS_COMPLETED,
    //   payload: response
    // });
  } catch (err) {
    yield put(setAddFormLoading(false));
    // yield put({
    //   type: actionType.REQUEST_GET_FORMS_COMPLETED,
    //   payload: []
    // });
  }
}
export function* getFormById({ id }) {
  console.log('@GET FORM BY ID', id)
  return
  try {
    const response = yield call(getFormIdFromDatabase, id);

    console.log("response", response);
    if (response) {
      yield put({
        type: actionType.REQUEST_GET_FORM_ID_COMPLETED,
        payload: response
      });
    } else {
      yield put({
        type: actionType.REQUEST_GET_FORM_ID_COMPLETED,
        payload: {}
      });
    }
  } catch (err) {
    yield put({
      type: actionType.REQUEST_GET_FORM_ID_COMPLETED,
      payload: {}
    });
  }
}
