import { call, take, put, all } from 'redux-saga/effects'
import graphqlClient from '../../graphql'
import * as actionType from './Constant'
import {
  FORM_ADD_MUTATION,
  FORM_UPDATE_MUTATION,
  GET_FORM_BY_FORM_ID,
  GET_FORMS_BY_VENDOR,
  FORM_DELETE_MUTATION,
  FORM_SUBMIT_APPLICATION,
  FORM_UPDATE_SUBMIT_APPLICATION,
  GET_CUSTOM_APPLICATION_HISTORY
} from '../../graphql/FormQueryMutation'
import {
  setAddFormLoading,
  setUpdateFormLoading,
  setGetFormLoading,
  setDeleteFormLoading,
  setSubmitFormLoading
} from './Loading'

const addFormToDatabase = application => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.mutate({
        mutation: FORM_ADD_MUTATION,
        variables: { application }
      })

      return resolve(data.createCustomApplicationForm)
    } catch (error) {
      reject(error)
    }
  })
}
const getFormsFromDatabase = formData => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.mutate({
        mutation: GET_FORMS_BY_VENDOR,
        variables: { filter: formData }
      })

      return resolve(data.getVendorCustomApplicationForms)
    } catch (error) {
      reject(error)
    }
  })
}
const getFormByIdFromDatabase = form_id => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.mutate({
        mutation: GET_FORM_BY_FORM_ID,
        variables: { form_id }
      })

      return resolve(data.getCustomApplicationsByFormId)
    } catch (error) {
      reject(error)
    }
  })
}
const updateFormToDatabase = application => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.mutate({
        mutation: FORM_UPDATE_MUTATION,
        variables: { application }
      })

      return resolve(data.updateCustomApplicationForm)
    } catch (error) {
      reject(error)
    }
  })
}

const updateSubmittedFormToDatabase = application => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.mutate({
        mutation: FORM_UPDATE_SUBMIT_APPLICATION,
        variables: { application }
      })

      return resolve(data.updateSubmitCustomApplication)
    } catch (error) {
      reject(error)
    }
  })
}

const getCustomApplicationHistoryFromDatabase = app_id => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.mutate({
        mutation: GET_CUSTOM_APPLICATION_HISTORY,
        variables: { app_id }
      })
      return resolve(data.getCustomApplicationHistoryById)
    } catch (error) {
      reject(error)
    }
  })
}

const deleteFormFromDatabase = form_id => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.mutate({
        mutation: FORM_DELETE_MUTATION,
        variables: { application: { form_id } }
      })

      return resolve(data.deleteCustomApplicationForm)
    } catch (error) {
      reject(error)
    }
  })
}

const submitFormToDatabase = application => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.mutate({
        mutation: FORM_SUBMIT_APPLICATION,
        variables: { application }
      })

      return resolve(data.submitCustomApplicationForm)
    } catch (error) {
      reject(error)
    }
  })
}



export const requestGetForms = data => {
  return {
    type: actionType.REQUEST_GET_FORMS,
    data
  }
}
export const requestAddForm = form => {
  return {
    type: actionType.REQUEST_ADD_FORM,
    form
  }
}
export const requestGetFormById = form => {
  return {
    type: actionType.REQUEST_GET_FORM_ID,
    form
  }
}
export const requestUpdateForm = form => {
  return {
    type: actionType.REQUEST_UPDATE_FORM,
    form
  }
}
export const requestUpdateSubmittedForm = application => {
  return {
    type: actionType.REQUEST_UPDATE_SUBMITTED_FORM,
    application
  }
}
export const requestGetCustomApplicationHistory = app_id => {
  return {
    type: actionType.REQUEST_CUSTOM_APPLICATION_HISTORY,
    app_id
  }
}
export const requestDeleteForm = form_id => {
  return {
    type: actionType.REQUEST_DELETE_FORM,
    form_id
  }
}
export const requestSubmitForm = application => {
  return {
    type: actionType.REQUEST_SUBMIT_FORM,
    application
  }
}
export const setViewMode = bool => {
  return {
    type: actionType.SET_VIEW_MODE,
    bool
  }
}



export function* getForms({ data }) {
  try {
    yield put(setGetFormLoading(true))
    const forms = yield call(getFormsFromDatabase, data)
    console.log('GET FORMSSSSSSSSSS', forms)
    yield put(setGetFormLoading(false))
    if (forms && forms.length > 0) {
      yield put({
        type: actionType.REQUEST_GET_FORMS_COMPLETED,
        payload: forms
      })
    } else {
      yield put({
        type: actionType.REQUEST_GET_FORMS_COMPLETED,
        payload: []
      })
    }
  } catch (err) {
    console.log('Error', err)
    yield put(setGetFormLoading(false))
    yield put({
      type: actionType.REQUEST_GET_APPLICATION_COMPLETED,
      payload: []
    })
  }
}
export function* addForm({ form }) {
  const { isViewMode = false, ...application } = form
  try {
    yield put(setAddFormLoading(true))
    const response = yield call(addFormToDatabase, application)
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
    yield put(setAddFormLoading(false))
    yield put({
      type: actionType.REQUEST_ADD_FORM_COMPLETED,
      payload: {}
    })
  }
}
export function* getFormById({ form }) {
  try {
    yield put(setGetFormLoading(true))
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
    yield put(setGetFormLoading(false))
    yield put({
      type: actionType.REQUEST_GET_FORM_ID_COMPLETED,
      payload: {}
    })
  }
}
export function* updateForm({ form }) {
  console.log('@UPDATE FORM', form)
  try {
    yield put(setUpdateFormLoading(true))
    const response = yield call(updateFormToDatabase, form)
    yield put(setUpdateFormLoading(false))
    yield put({
      type: actionType.REQUEST_UPDATE_FORM_COMPLETED,
      payload: response
    })
  } catch (err) {
    yield put(setUpdateFormLoading(false))
    yield put({
      type: actionType.REQUEST_UPDATE_FORM_COMPLETED,
      payload: {}
    })
  }
}

export function* updateSubmittedForm({ application }) {
  console.log('@UPDATE APPLICATION', application)
  try {
    yield put(setUpdateFormLoading(true))
    const response = yield call(updateSubmittedFormToDatabase, application)
    yield put(setUpdateFormLoading(false))
    yield put({
      type: actionType.REQUEST_UPDATE_SUBMITTED_FORM_COMPLETED,
      payload: response
    })
  } catch (err) {
    yield put(setUpdateFormLoading(false))
    yield put({
      type: actionType.REQUEST_UPDATE_SUBMITTED_FORM_COMPLETED,
      payload: {}
    })
  }
}

export function* getCustomApplicationHistory({ app_id }) {
  console.log('@GET CUSTOM APPLICATION HISTORY', app_id)
  try {
    const response = yield call(getCustomApplicationHistoryFromDatabase, app_id)
    yield put({
      type: actionType.REQUEST_CUSTOM_APPLICATION_HISTORY_COMPLETED,
      payload: response
    })
  } catch (err) {
    yield put({
      type: actionType.REQUEST_CUSTOM_APPLICATION_HISTORY_COMPLETED,
      payload: []
    })
  }
}

export function* deleteForm({ form_id }) {
  console.log('@DELETE FORM', form_id)
  try {
    yield put(setDeleteFormLoading(true))
    const response = yield call(deleteFormFromDatabase, form_id)
    yield put(setDeleteFormLoading(false))
    yield put({
      type: actionType.REQUEST_DELETE_FORM_COMPLETED,
      payload: response
    })
  } catch (err) {
    yield put(setDeleteFormLoading(false))
    yield put({
      type: actionType.REQUEST_DELETE_FORM_COMPLETED,
      payload: {}
    })
  }
}

export function* submitForm({ application }) {
  console.log('@SUBMIT FORM', application)
  try {
    yield put(setSubmitFormLoading(true))
    const response = yield call(submitFormToDatabase, application)
    yield put(setSubmitFormLoading(false))
    yield put({
      type: actionType.REQUEST_SUBMIT_FORM_COMPLETED,
      payload: response
    })
  } catch (err) {
    yield put(setSubmitFormLoading(false))
    yield put({
      type: actionType.REQUEST_SUBMIT_FORM_COMPLETED,
      payload: {}
    })
  }
}
