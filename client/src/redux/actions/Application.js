import { call, take, put } from "redux-saga/effects";
import graphqlClient from "../../graphql";

import { 
  APPLICATION_ADD_MUTATION,
  GET_APPLICATIONS_QUERY,
  USER_APPLICATION_QUERY,
  APPLICATION_UPDATE_MUTATION ,
  ARCHIVED_APPLICATION_MUTATION,
  GET_ARCHIVED_APPLICATIONS_QUERY
} from "../../graphql/applicationMutation";
import * as actionType from "./Constant";
import { setApplicationLoading } from "./Loading";

const getActiveApplicationFromDatabase = (vendor_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.query({
        query: GET_APPLICATIONS_QUERY,
        variables: {
          vendor_id: vendor_id
        }
      });

      return resolve(data.getVendorApplications);
    } catch (error) {
      reject(error);
    }
  });
};

const getArchivedApplicationFromDatabase = (vendor_id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.query({
        query: GET_ARCHIVED_APPLICATIONS_QUERY,
        variables: {
          vendor_id: vendor_id
        }
      })

      return resolve(data.getVendorArchivedApplications);
    } catch(error) {
      reject(error);
    }
  })
}

const archivedApplicationToDatabase = (applications) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.mutate({
        mutation: ARCHIVED_APPLICATION_MUTATION,
        variables: {
          app_ids: applications
        }
      });

      return resolve(data.archivedApplications);
    } catch(error) {
      reject(error)
    }
  });
}

const updateApplicationToDatabse = application => {

  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.mutate({
        mutation: APPLICATION_UPDATE_MUTATION,
        variables: {
          application: application
        }
      });

      return resolve(data.updateApplication);
    } catch(error) {
      console.log(error)
      reject(error);
    }
  })
}

const addApplicationToDatabase = applications => {
  return new Promise(async (resolve, reject) => {
    let applications_obj = [];

    for (let application of applications) {
      let temp = {
        vendor: application.vendor,
        child: application.child,
        parents: application.parents,
        section1_signature: application.section1_signature,
        section1_date_signed: application.section1_date_signed,
        section2_signature: application.section2_signature,
        section2_date_signed: application.section2_date_signed,
        section3_signature: application.section3_signature,
        section3_date_signed: application.section3_date_signed,
        section1_text: application.section1_text,
        section2_text: application.section2_text,
        section3_text: application.section3_text,
        section1_name: application.section1_name,
        section2_name: application.section2_name,
        section3_name: application.section3_name
      };

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
    } catch (error) {
      reject(error);
    }
  });
};

export const requestGetApplications = vendor_id => {
  return {
    type: actionType.REQUEST_GET_APPLICATION,
    vendor_id: vendor_id
  };
};

export const requestAddApplication = applications => {
  return {
    type: actionType.REQUEST_ADD_APPLICATION,
    applications
  };
};

export const requestUserApplication = email => {
  return {
    type: actionType.REQUEST_USER_APPLICATIONS,
    email
  };
};

export const requestUpdateApplication = application  => {
  return {
    type: actionType.REQUEST_UPDATE_APPLICATION,
    application
  }
}

export const requestArchivedAppplication = application => {
  return {
    type: actionType.REQUEST_ARCHIVED_APPLICATION,
    application
  }
}

export const requestGetArchivedApplications = vendor_id => {
  return {
    type: actionType.REQUEST_GET_ARCHIVED_APPLICATION,
    vendor_id: vendor_id
  }
}

export function* archivedApplication({application}) {
  try {
    yield put(setApplicationLoading(true));
    const response = yield call(archivedApplicationToDatabase, application);
    yield put(setApplicationLoading(false));

    if(response) {
      yield put({
        type: actionType.REQUEST_ARCHIVED_APPLICATION_COMPLETED,
        payload: response
      })
    } else {
      yield put({
        type: actionType.REQUEST_ARCHIVED_APPLICATION_COMPLETED,
        payload: {}
      })
    }
  } catch (err) {
    console.log("Archived Error: ", err);
    yield put({
      type: actionType.REQUEST_ARCHIVED_APPLICATION_COMPLETED,
      payload: {}
    })
  }
}

export function* updateApplication({application}) {
  try {
    yield put(setApplicationLoading(true));
    const response = yield call(updateApplicationToDatabse, application);
    yield put(setApplicationLoading(false));

    if(response) {
      yield put({
        type: actionType.REQUEST_UPDATE_APPLICATION_COMPLETED,
        payload: response
      })
    } else {
      yield put({
        type: actionType.REQUEST_UPDATE_APPLICATION_COMPLETED,
        payload: response
      })
    }
  } catch(err) {
    yield put({
      type: actionType.REQUEST_UPDATE_APPLICATION_COMPLETED,
      payload: response
    })
  }
}

export function* getApplication({vendor_id}) {
  try {
    yield put(setApplicationLoading(true));
    const applications = yield call(getActiveApplicationFromDatabase, vendor_id);
    yield put(setApplicationLoading(false));
    if (applications.length > 0) {
      yield put({
        type: actionType.REQUEST_GET_APPLICATION_COMPLETED,
        payload: applications
      });
    } else {
      yield put({
        type: actionType.REQUEST_GET_APPLICATION_COMPLETED,
        payload: []
      });
    }
  } catch (err) {
    console.log("Error", err);
    yield put(setApplicationLoading(false));
    yield put({
      type: actionType.REQUEST_GET_APPLICATION_COMPLETED,
      payload: []
    });
  }
}

export function* getArchivedApplication({vendor_id}) {
  try {
    yield put(setApplicationLoading(true));
    const applications = yield call(getArchivedApplicationFromDatabase, vendor_id)
    yield put(setApplicationLoading(false));
    if(applications.length > 0) {
      yield put({
        type: actionType.REQUEST_GET_ARCHIVED_APPLICATION_COMPLETED,
        payload: applications
      })
    } else {
      yield put({
        type: actionType.REQUEST_GET_ARCHIVED_APPLICATION_COMPLETED,
        payload: []
      })
    }
  } catch (err) {
    console.log("Error", err);
    yield put(setApplicationLoading(false));
    yield put({
      type: actionType.REQUEST_GET_ARCHIVED_APPLICATION_COMPLETED,
      payload: []
    })
  }
}

export function* addApplication({applications}) {
  try {
    yield put(setApplicationLoading(true));
    const response = yield call(addApplicationToDatabase, applications);
    yield put(setApplicationLoading(false));
    if (response) {
      console.log("application", response);
      yield put({
        type: actionType.REQUEST_ADD_APPLICATION_COMPLETED,
        payload: response
      });
    } else {
      yield put({
        type: actionType.REQUEST_ADD_APPLICATION_COMPLETED,
        payload: {}
      });
    }
  } catch (err) {
    console.log("Error", err);
    yield put(setApplicationLoading(false));
    yield put({
      type: actionType.REQUEST_ADD_APPLICATION_COMPLETED,
      payload: {}
    });
  }
}

const getUserApplicationFromDatabase = async email => {
  try {
    console.log("getUserApplicationFromDatabase email", email);
    const { data } = await graphqlClient.query({
      query: USER_APPLICATION_QUERY,
      variables: {
        email
      }
    });
    console.log("getUserApplicationFromDatabase data", data);
    return data.getUserApplications;
  } catch (error) {
    console.log("getUserApplicationFromDatabase error", error);
  }
};

export function* getUserApplication({ email }) {
  try {
    console.log("getUserApplication email", email);
    yield put(setApplicationLoading(true));
    const applications = yield call(getUserApplicationFromDatabase, email);
    yield put(setApplicationLoading(false));
    yield put({
      type: actionType.SET_USER_APPLICATIONS,
      payload: applications
    });
  } catch (err) {
    console.log("Error", err);
    yield put(setApplicationLoading(false));
    yield put({
      type: actionType.SET_USER_APPLICATIONS,
      payload: []
    });
  }
}
