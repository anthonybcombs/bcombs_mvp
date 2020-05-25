import { call, take, put } from "redux-saga/effects";
import graphqlClient from "../../graphql";
import { APPLICATION_ADD_MUTATION, GET_APPLICATIONS_QUERY } from "../../graphql/applicationMutation";
import * as actionType from "./Constant";
import { setApplicationLoading } from "./Loading";

const getActiveApplicationFromDatabse = (vendor_id) => {

  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.query({
        query: GET_APPLICATIONS_QUERY,
        variables: {
          vendor_id: vendor_id
        }
      })

      return resolve(data.getVendorApplications);
    } catch(error) {
      reject(error);
    }
  })
};

const addApplicationToDatabase = applications => {

  return new Promise(async (resolve, reject) => {

    let applications_obj = [];

    for(let application of applications) {
      let temp = {
        vendor: application.vendor,
        child: application.child,
        parents: application.parents,
        section1_signature: application.section1_signature,
        section1_date_signed:  application.section1_date_signed,
        section2_signature: application.section2_signature,
        section2_date_signed: application.section2_date_signed,
        section3_signature: application.section3_signature,
        section3_date_signed: application.section3_date_signed
      }

      applications_obj.push(temp);
    }

    try {
      const { data } = await graphqlClient.mutate({
        mutation: APPLICATION_ADD_MUTATION,
        variables: {
          applications: [...applications_obj]
        }
      });

      console.log("response", data);

      return resolve(data.addApplication);
    } catch(error) {
      reject(error); 
    }
  })
}

export const requestGetApplications = vendor_id => {
  return {
    type: actionType.REQUEST_GET_APPLICATION,
    vendor_id: vendor_id
  }
}

export const requestAddApplication = applications => {
  return {
    type: actionType.REQUEST_ADD_APPLICATION,
    applications
  };
};

export function* getApplication({vendor_id}) {
  try {
    const applications = yield call(getActiveApplicationFromDatabse, vendor_id)

    if(applications.length > 0) {
      yield put({
        type: actionType.REQUEST_GET_APPLICATION_COMPLETED,
        payload: applications
      })
    } else {
      yield put({
        type: actionType.REQUEST_GET_APPLICATION_COMPLETED,
        payload: []
      })
    }
  } catch (err) {
    console.log("Error", err);
    yield put({
      type: actionType.REQUEST_GET_APPLICATION_COMPLETED,
      payload: []
    })
  }
}

export function* addApplication({applications}) {
  try {
    yield put(setApplicationLoading(true));
    const response = yield call(addApplicationToDatabase, applications)
    yield put(setApplicationLoading(false));
    if(response) {
      console.log("application", response);
      yield put({
        type: actionType.REQUEST_ADD_APPLICATION_COMPLETED,
        payload: response
      })
    } else {
      yield put({
        type: actionType.REQUEST_ADD_APPLICATION_COMPLETED,
        payload: {}
      })
    }
  } catch (err) {
    console.log("Error", err);
    yield put(setApplicationLoading(false));
    yield put({
      type: actionType.REQUEST_ADD_APPLICATION_COMPLETED,
      payload: {}
    })
  }
}