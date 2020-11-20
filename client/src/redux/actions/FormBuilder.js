import { call, take, put, all } from "redux-saga/effects";
import graphqlClient from "../../graphql";
import * as actionType from "./Constant";
import {
  FORM_ADD_MUTATION,
  FORM_UPDATE_MUTATION,
  GET_FORM_BY_FORM_ID,
  GET_FORMS_BY_VENDOR
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
const getFormsFromDatabase = formData => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.mutate({
        mutation: GET_FORMS_BY_VENDOR,
        variables: { filter: formData }
      })

      return resolve(data.getVendorCustomApplicationForms);
    } catch (error) {
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


export const requestGetForms = data => {
  return {
    type: actionType.REQUEST_GET_FORMS,
    data
  };
};
export const requestAddForm = form => {
  return {
    type: actionType.REQUEST_ADD_FORM,
    form
  };
};
export const requestGetFormById = form => {
  return {
    type: actionType.REQUEST_GET_FORM_ID,
    form
  };
};
export const requestUpdateForm = form => {
  return {
    type: actionType.REQUEST_UPDATE_FORM,
    form
  };
};
export const setViewMode = bool => {
  return {
    type: actionType.SET_VIEW_MODE,
    bool
  };
}



export function* getForms({ data }) {
  try {
    yield put(setGetFormLoading(true));
    const forms = yield call(getFormsFromDatabase, data);
    yield put(setGetFormLoading(false));
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
    yield put(setGetFormLoading(false));
    yield put({
      type: actionType.REQUEST_GET_APPLICATION_COMPLETED,
      payload: []
    });
  }
}
export function* addForm({ form }) {
  const { isViewMode = false, ...application } = form
  try {
    yield put(setAddFormLoading(true));
    const response = yield call(addFormToDatabase, application);
    yield all([
      put(setAddFormLoading(false)),
      put({
        type: actionType.REQUEST_ADD_FORM_COMPLETED,
        payload: {
          ...response,
          isViewMode
        }
      })
    ])
  } catch (err) {
    yield put(setAddFormLoading(false));
    yield put({
      type: actionType.REQUEST_ADD_FORM_COMPLETED,
      payload: {}
    });
  }
}
export function* getFormById({ form }) {
  try {
    yield put(setGetFormLoading(true));
    const response = yield call(getFormByIdFromDatabase, form.form_id)
    yield all ([
      put(setGetFormLoading(false)),
      put({
        type: actionType.REQUEST_GET_FORM_ID_COMPLETED,
        payload: response || {}
      }),
      form.isViewMode ? put(setViewMode(true)) : null
    ])
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
