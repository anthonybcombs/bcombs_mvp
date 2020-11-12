import { call, take, put } from "redux-saga/effects";
import graphqlClient from "../../graphql";
import * as actionType from "./Constant";
import {
  FORM_ADD_MUTATION,
  FORM_UPDATE_MUTATION,
  GET_FORM_BY_FORM_ID
} from "../../graphql/FormQueryMutation"
import {
  setAddFormLoading,
  setUpdateFormLoading,
  setGetFormLoading
} from "./Loading";

const addFormToDatabase = application => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.mutate({
        mutation: FORM_ADD_MUTATION,
        variables: { application }
      })

      return resolve(data.createCustomApplicationForm);
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
const getFormByIdFromDatabase = form_id => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.mutate({
        mutation: GET_FORM_BY_FORM_ID,
        variables: { form_id }
      })

      return resolve(data.getCustomApplicationsByFormId);
    } catch (error) {
      reject(error);
    }
  });
};
const updateFormToDatabase = application => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.mutate({
        mutation: FORM_UPDATE_MUTATION,
        variables: { application }
      })

      return resolve(data.updateCustomApplicationForm);
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
export const requestUpdateForm = form => {
  return {
    type: actionType.REQUEST_UPDATE_FORM,
    form
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
  try {
    yield put(setAddFormLoading(true));
    const response = yield call(addFormToDatabase, form);
    yield put(setAddFormLoading(false));
    yield put({
      type: actionType.REQUEST_ADD_FORM_COMPLETED,
      payload: response
    });
  } catch (err) {
    yield put(setAddFormLoading(false));
    yield put({
      type: actionType.REQUEST_ADD_FORM_COMPLETED,
      payload: {}
    });
  }
}
export function* getFormById({ id }) {
  try {
    const response = yield call(getFormByIdFromDatabase, id);
    yield put(setGetFormLoading(true));
    yield put({
      type: actionType.REQUEST_GET_FORM_ID_COMPLETED,
      payload: response || {}
    });
    yield put(setGetFormLoading(false));
  } catch (err) {
    yield put(setGetFormLoading(false));
    yield put({
      type: actionType.REQUEST_GET_FORM_ID_COMPLETED,
      payload: {}
    });
  }
}
export function* updateForm({ form }) {
  console.log('@UPDATE FORM', form)
  try {
    yield put(setUpdateFormLoading(true));
    const response = yield call(updateFormToDatabase, form);
    yield put(setUpdateFormLoading(false));
    yield put({
      type: actionType.REQUEST_UPDATE_FORM_COMPLETED,
      payload: response
    });
  } catch (err) {
    yield put(setUpdateFormLoading(false));
    yield put({
      type: actionType.REQUEST_UPDATE_FORM_COMPLETED,
      payload: {}
    });
  }
}
