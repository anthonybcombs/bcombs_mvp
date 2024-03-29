import { call, take, put } from "redux-saga/effects";
import graphqlClient from "../../graphql";

import {
  APPLICATION_ADD_MUTATION,
  GET_APPLICATIONS_QUERY,
  USER_APPLICATION_QUERY,
  APPLICATION_UPDATE_MUTATION,
  ARCHIVED_APPLICATION_MUTATION,
  UNARCHIVED_APPLICATION_MUTATION,
  GET_ARCHIVED_APPLICATIONS_QUERY,
  GET_APPLICATION_ID_QUERY,
  APPLICATION_SAVE_MUTATION,
  GET_APPLICATION_USER_ID_QUERY,
  GET_APPLICATION_HISTORY,
  GET_USER_APPLICATION_HISTORY,
  DAYCARE_APPLICATION_ADD_MUTATION,
  GET_CUSTOM_APPLICATION_BY_VENDOR
} from "../../graphql/applicationMutation";
import { GET_APPLICANTS_BY_FORM, GET_CUSTOM_APPLICATION_BY_ID } from "../../graphql/FormQueryMutation";
import * as actionType from "./Constant";
import { setApplicationLoading, setUserApplicationLoading } from "./Loading";

export const getCustomApplicationsFromDatabase = form_id => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.query({
        query: GET_APPLICANTS_BY_FORM,
        variables: {
          form_id
        }
      });
      console.log("Get Custom Active Application", data);
      return resolve(data.getCustomFormApplicants);
    } catch (error) {
      console.log("Get Custom Active Application error", error);
      reject(error);
    }
  });
}

const getCustomApplicationByIdFromDatabase = app_id => {
  console.log('app_id', app_id)
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.query({
        query: GET_CUSTOM_APPLICATION_BY_ID,
        variables: {
          app_id
        }
      });
      console.log("Get Custom Active Application by id", data);
      return resolve(data.getCustomFormApplicantById);
    } catch (error) {
      console.log("Get Custom Active Application by id error", error);
      reject(error);
    }
  });
}

const getApplicationHistoryFromDatabase = app_id => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.query({
        query: GET_APPLICATION_HISTORY,
        variables: {
          app_id
        }
      });

      console.log("DATA history", data);

      return resolve(data.getApplicationHistory);
    } catch (error) {
      reject(error);
    }
  });
};

const getApplicationIdFromDatabase = id => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.query({
        query: GET_APPLICATION_ID_QUERY,
        variables: {
          id: id
        }
      });

      return resolve(data.getApplicationById);
    } catch (error) {
      reject(error);
    }
  });
};

const getApplicationUserIdFromDatabase = user_id => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.query({
        query: GET_APPLICATION_USER_ID_QUERY,
        variables: {
          user_id
        }
      });

      let applications = [...data.getUserApplicationsByUserId.applications,
                          ...data.getUserApplicationsByUserId.customApplications]

      // applications = applications.sort((a, b) => new Date(b.application_date) - new Date(a.application_date))

      return resolve(applications);
    } catch (error) {
      reject(error);
    }
  });
};

export const getActiveApplicationFromDatabase = vendor_id => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("getActiveApplicationFromDatabase Get Active Application vendor_id", vendor_id);
      const { data } = await graphqlClient.query({
        query: GET_APPLICATIONS_QUERY,
        variables: {
          vendor_id: vendor_id
        }
      });
      console.log("getActiveApplicationFromDatabase Get Active Application", data);
      return resolve(data.getVendorApplications);
    } catch (error) {
      console.log("getActiveApplicationFromDatabase Get Active Application error", error);
      reject(error);
    }
  });
};

const getArchivedApplicationFromDatabase = vendor_id => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.query({
        query: GET_ARCHIVED_APPLICATIONS_QUERY,
        variables: {
          vendor_id: vendor_id
        }
      });

      return resolve(data.getVendorArchivedApplications);
    } catch (error) {
      reject(error);
    }
  });
};

const archivedApplicationToDatabase = applications => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.mutate({
        mutation: ARCHIVED_APPLICATION_MUTATION,
        variables: {
          app_ids: applications
        }
      });

      return resolve(data.archivedApplications);
    } catch (error) {
      reject(error);
    }
  });
};

const unarchivedApplicationToDatabase = applications => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.mutate({
        mutation: UNARCHIVED_APPLICATION_MUTATION,
        variables: {
          app_ids: applications
        }
      });

      return resolve(data.unarchivedApplications);
    } catch (error) {
      reject(error);
    }
  });
};

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
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

const saveApplicationToDatabase = application => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.mutate({
        mutation: APPLICATION_SAVE_MUTATION,
        variables: {
          application: application
        }
      });

      return resolve(data.saveApplication);
    } catch (error) {
      console.log(error);
      reject(error);
    }
  });
};

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
        section3_name: application.section3_name,
        emergency_contacts: application.emergency_contacts,
        is_daycare: 0,
        is_lot: application.is_lot
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

const addDaycareApplicationToDatabase = daycare => {
  return new Promise(async (resolve, reject) => {
    let applications_obj = [];
    let applications = daycare.applications
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
        section3_name: application.section3_name,
        emergency_contacts: application.emergency_contacts,
        is_daycare: 1
      };

      applications_obj.push(temp);
    }

    try {
      const { data } = await graphqlClient.mutate({
        mutation: DAYCARE_APPLICATION_ADD_MUTATION,
        variables: {
          daycare: {
            applications: [...applications_obj],
            relationships: daycare.relationships,
            chRelationships: daycare.chRelationships
          }
        }
      });

      console.log("response", data);

      return resolve(data.addDaycareApplication);
    } catch (error) {
      reject(error);
    }
  });
}

const getCustomApplicationsByVendorFromDatabase = vendor => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('getCustomApplicationsByVendorFromDatabase vendorr', vendor)
      const { data } = await graphqlClient.query({
        query: GET_CUSTOM_APPLICATION_BY_VENDOR,
        variables: {
          vendor
        }
      });
      console.log("Get Custom Active Application", data);
      return resolve(data.getCustomApplicationByVendor);
    } catch (error) {
      console.log("Get Custom Active Application error", error);
      reject(error);
    }
  });
}

export const requestGetApplicationHistory = app_id => {
  return {
    type: actionType.REQUEST_GET_APPLICATION_HISTORY,
    app_id
  };
};

export const requestGetApplicationByUserId = user_id => {
  return {
    type: actionType.REQUEST_GET_APPLICATION_USER_ID,
    user_id
  };
};
export const requestGetApplicationById = id => {
  return {
    type: actionType.REQUEST_GET_APPLICATION_ID,
    id: id
  };
};

export const requestGetApplications = vendor_id => {
  console.log('REQUEST GET APPLICATIONSSSS')
  return {
    type: actionType.REQUEST_GET_APPLICATION,
    vendor_id: vendor_id
  };
};

export const requestGetCustomApplications = form_id => {
  return {
    type: actionType.REQUEST_GET_CUSTOM_APPLICATION,
    form_id: form_id
  }
}

export const requestGetCustomFormApplicantById = application_id => {
  return {
    type: actionType.REQUEST_GET_CUSTOM_APPLICATION_BY_ID,
    application_id
  }
}

export const requestGetCustomApplicationByVendor = vendor => {
  return {
    type: actionType.REQUEST_CUSTOM_APPLICATION_BY_VENDOR,
    vendor
  }
}  

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

export const requestUpdateApplication = application => {
  return {
    type: actionType.REQUEST_UPDATE_APPLICATION,
    application
  };
};

export const requestArchivedAppplication = application => {
  return {
    type: actionType.REQUEST_ARCHIVED_APPLICATION,
    application
  };
};

export const requestUnarchivedAppplication = application => {
  return {
    type: actionType.REQUEST_UNARCHIVED_APPLICATION,
    application
  };
};

export const requestGetArchivedApplications = vendor_id => {
  return {
    type: actionType.REQUEST_GET_ARCHIVED_APPLICATION,
    vendor_id: vendor_id
  };
};

export const requestSaveApplication = application => {
  return {
    type: actionType.REQUEST_SAVE_APPLICATION,
    application
  };
};

export function* getApplicationById({ id }) {
  try {
    const response = yield call(getApplicationIdFromDatabase, id);

    console.log("response", response);
    if (response) {
      yield put({
        type: actionType.REQUEST_GET_APPLICATION_ID_COMPLETED,
        payload: response
      });
    } else {
      yield put({
        type: actionType.REQUEST_GET_APPLICATION_ID_COMPLETED,
        payload: {}
      });
    }
  } catch (err) {
    yield put({
      type: actionType.REQUEST_GET_APPLICATION_ID_COMPLETED,
      payload: {}
    });
  }
}

export function* getApplicationByUserId({ user_id }) {
  try {
    yield put(setUserApplicationLoading(true));
    const response = yield call(getApplicationUserIdFromDatabase, user_id);
    yield put(setUserApplicationLoading(false));
    console.log("response", response);
    if (response) {
      yield put({
        type: actionType.REQUEST_GET_APPLICATION_USER_ID_COMPLETED,
        payload: response
      });
    } else {
      yield put({
        type: actionType.REQUEST_GET_APPLICATION_USER_ID_COMPLETED,
        payload: []
      });
    }
  } catch (err) {
    yield put({
      type: actionType.REQUEST_GET_APPLICATION_USER_ID_COMPLETED,
      payload: []
    });
  }
}

export function* unarchivedApplication({ application }) {
  try {
    yield put(setApplicationLoading(true));
    const response = yield call(unarchivedApplicationToDatabase, application);
    yield put(setApplicationLoading(false));

    if (response) {
      yield put({
        type: actionType.REQUEST_UNARCHIVED_APPLICATION_COMPLETED,
        payload: response
      });
    } else {
      yield put({
        type: actionType.REQUEST_UNARCHIVED_APPLICATION_COMPLETED,
        payload: {}
      });
    }
  } catch (err) {
    console.log("Unarchived Error: ", err);
    yield put({
      type: actionType.REQUEST_UNARCHIVED_APPLICATION_COMPLETED,
      payload: {}
    });
  }
}

export function* archivedApplication({ application }) {
  try {
    yield put(setApplicationLoading(true));
    const response = yield call(archivedApplicationToDatabase, application);
    yield put(setApplicationLoading(false));

    if (response) {
      yield put({
        type: actionType.REQUEST_ARCHIVED_APPLICATION_COMPLETED,
        payload: response
      });
    } else {
      yield put({
        type: actionType.REQUEST_ARCHIVED_APPLICATION_COMPLETED,
        payload: {}
      });
    }
  } catch (err) {
    console.log("Archived Error: ", err);
    yield put({
      type: actionType.REQUEST_ARCHIVED_APPLICATION_COMPLETED,
      payload: {}
    });
  }
}

export function* saveApplication({ application }) {
  try {
    yield put(setApplicationLoading(true));
    const response = yield call(saveApplicationToDatabase, application);
    yield put(setApplicationLoading(false));
    if (response) {
      yield put({
        type: actionType.REQUEST_SAVE_APPLICATION_COMPLETED,
        payload: response
      });
    } else {
      yield put({
        type: actionType.REQUEST_SAVE_APPLICATION_COMPLETED,
        payload: response
      });
    }
  } catch (err) {
    yield put({
      type: actionType.REQUEST_SAVE_APPLICATION_COMPLETED,
      payload: {}
    });
  }
}

export function* updateApplication({ application }) {
  try {
    yield put(setApplicationLoading(true));
    const response = yield call(updateApplicationToDatabse, application);
    yield put(setApplicationLoading(false));

    if (response) {
      yield put({
        type: actionType.REQUEST_UPDATE_APPLICATION_COMPLETED,
        payload: response
      });
    } else {
      yield put({
        type: actionType.REQUEST_UPDATE_APPLICATION_COMPLETED,
        payload: response
      });
    }
  } catch (err) {
    yield put({
      type: actionType.REQUEST_UPDATE_APPLICATION_COMPLETED,
      payload: {}
    });
  }
}

export function* getApplication({ vendor_id }) {
  try {
    yield put(setApplicationLoading(true));
    const applications = yield call(
      getActiveApplicationFromDatabase,
      vendor_id
    );
    console.log("applications111", applications);
    yield put(setApplicationLoading(false));
    if (applications && applications.length > 0) {
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

export function* getArchivedApplication({ vendor_id }) {
  try {
    yield put(setApplicationLoading(true));
    const applications = yield call(
      getArchivedApplicationFromDatabase,
      vendor_id
    );
    yield put(setApplicationLoading(false));
    if (applications.length > 0) {
      yield put({
        type: actionType.REQUEST_GET_ARCHIVED_APPLICATION_COMPLETED,
        payload: applications
      });
    } else {
      yield put({
        type: actionType.REQUEST_GET_ARCHIVED_APPLICATION_COMPLETED,
        payload: []
      });
    }
  } catch (err) {
    console.log("Error", err);
    yield put(setApplicationLoading(false));
    yield put({
      type: actionType.REQUEST_GET_ARCHIVED_APPLICATION_COMPLETED,
      payload: []
    });
  }
}

export function* addApplication({ applications }) {
  try {
    yield put(setApplicationLoading(true));
    let response;
    if(applications.is_daycare) {
      response = yield call(addDaycareApplicationToDatabase, applications)
    } else {
      response = yield call(addApplicationToDatabase, applications)
    }
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

export function* getCustomApplications({form_id}) {
  try {
    yield put(setApplicationLoading(true));
    const response = yield call(getCustomApplicationsFromDatabase, form_id);
    yield put(setApplicationLoading(false));
    yield put({
      type: actionType.REQUEST_GET_CUSTOM_APPLICATION_COMPLETED,
      payload: response
    });
  } catch (err) {
    yield put(setApplicationLoading(false));
    yield put({
      type: actionType.REQUEST_GET_CUSTOM_APPLICATION_COMPLETED,
      payload: []
    });
  }
}

export function* getCustomApplicationById({application_id}) {
  try {
    const response = yield call(getCustomApplicationByIdFromDatabase, application_id);
    yield put({
      type: actionType.REQUEST_GET_CUSTOM_APPLICATION_BY_ID_COMPLETED,
      payload: response
    });
  } catch (err) {
    yield put({
      type: actionType.REQUEST_GET_CUSTOM_APPLICATION_BY_ID_COMPLETED,
      payload: []
    });
  }
}

export function* getApplicationHistory({ app_id }) {
  try {
    const response = yield call(getApplicationHistoryFromDatabase, app_id);
    yield put({
      type: actionType.REQUEST_GET_APPLICATION_HISTORY_COMPLETE,
      payload: response
    });
  } catch (err) {
    yield put({
      type: actionType.REQUEST_GET_APPLICATION_HISTORY_COMPLETE,
      payload: []
    });
  }
}

export const requestGetUserApplicationHistory = id => {
  return {
    type: actionType.REQUEST_GET_USER_APPLICATION_HISTORY,
    id
  };
};

export function* getUserApplicationHistory({ id }) {
  try {
    console.log("getUserApplicationHistory id", id);
    const response = yield call(getUserApplicationHistoryFromDatabase, id);

    yield put({
      type: actionType.REQUEST_GET_APPLICATION_HISTORY_COMPLETE,
      payload: response
    });
  } catch (err) {
    console.log("history error", err);
    yield put({
      type: actionType.REQUEST_GET_APPLICATION_HISTORY_COMPLETE,
      payload: []
    });
  }
}

const getUserApplicationHistoryFromDatabase = id => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.query({
        query: GET_USER_APPLICATION_HISTORY,
        variables: {
          id: id
        }
      });

      return resolve(data.getUserApplicationHistory);
    } catch (error) {
      reject(error);
    }
  });
};


export function* getCustomApplicationByVendors({ vendor }) {
  try {
    yield put(setApplicationLoading(true));
    const applications = yield call(
      getCustomApplicationsByVendorFromDatabase,
      vendor
    );
    console.log('getCustomApplicationByVendors applications',applications)
    yield put(setApplicationLoading(false));
    if (applications.length > 0) {
      yield put({
        type: actionType.REQUEST_GET_CUSTOM_APPLICATION_BY_VENDOR_COMPLETED,
        payload: applications
      });
    } else {
      yield put({
        type: actionType.REQUEST_GET_CUSTOM_APPLICATION_BY_VENDOR_COMPLETED,
        payload: []
      });
    }
  } catch (err) {
    console.log("Error", err);
    yield put(setApplicationLoading(false));
    yield put({
      type: actionType.REQUEST_GET_CUSTOM_APPLICATION_BY_VENDOR_COMPLETED,
      payload: []
    });
  }
}
