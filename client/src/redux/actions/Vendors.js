import { call, take, put } from "redux-saga/effects";
import graphqlClient from "../../graphql";
import {
  VENDOR_UPDATE_MUTATION,
  VENDOR_BY_USER_QUERY,
  VENDOR_BY_ID2_QUERY,
  GET_VENDOR_ADMINS,
  ADD_VENDOR_ADMIN,
  DELETE_VENDOR_ADMIN,
  UPDATE_VENDOR_ADMIN
} from "../../graphql/vendorMutation";
import * as actionType from "./Constant";

import {
  setFormSettingsLoading,
  setAddAdminLoading,
  setDeleteAdminLoading,
  setApplicationLoading
} from "./Loading";

const addAdminToDatabase = admin => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.mutate({
        mutation: ADD_VENDOR_ADMIN,
        variables: { admin }
      });

      console.log("data data", data);

      return resolve(data.addVendorAdmin);
    } catch (error) {
      reject(error);
    }
  });
};

const updateAdminToDatabase = admin => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.mutate({
        mutation: UPDATE_VENDOR_ADMIN,
        variables: { admin }
      });

      console.log("data data", data);

      return resolve(data.updateVendorAdmin);
    } catch (error) {
      reject(error);
    }
  });
};

const deleteAdminToDatabase = admins => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.mutate({
        mutation: DELETE_VENDOR_ADMIN,
        variables: { admins }
      });

      console.log("data data", data);

      return resolve(data.deleteVendorAdmin);
    } catch (error) {
      reject(error);
    }
  });
};

const getVendorAdminsFromDatabase = user => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.query({
        query: GET_VENDOR_ADMINS,
        variables: { user }
      });

      console.log("data data", data);

      return resolve(data.getVendorAdminsByUser);
    } catch (error) {
      reject(error);
    }
  });
};

const getVendorFromDatabase = user => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.query({
        query: VENDOR_BY_USER_QUERY,
        variables: { user }
      });

      return resolve(data.vendorsByUser);
    } catch (error) {
      reject(error);
    }
  });
};

const getVendorById2FromDatabase = id2 => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.query({
        query: VENDOR_BY_ID2_QUERY,
        variables: { id2 }
      });

      return resolve(data.getVendorById2);
    } catch (error) {
      reject(error);
    }
  });
};

const updateVendorToDatabase = vendor => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.mutate({
        mutation: VENDOR_UPDATE_MUTATION,
        variables: {
          vendor: {
            id: vendor.id,
            user: vendor.user,
            name: vendor.name,
            section1_text: vendor.section1_text,
            section1_name: vendor.section1_name,
            section1_show: vendor.section1_show,
            section2_text: vendor.section2_text,
            section2_name: vendor.section2_name,
            section2_show: vendor.section2_show,
            section3_text: vendor.section3_text,
            section3_name: vendor.section3_name,
            section3_show: vendor.section3_show
          }
        }
      });

      return resolve(data.updateVendor);
    } catch (error) {
      reject(error);
    }
  });
};

export const requestVendorById2 = id2 => {
  return {
    type: actionType.REQUEST_VENDOR_BY_ID2,
    id2
  };
};

export const requestVendor = user => {
  return {
    type: actionType.REQUEST_VENDOR,
    user
  };
};

export const requestUpdateVendor = vendor => {
  return {
    type: actionType.REQUEST_UPDATE_VENDOR,
    vendor
  };
};

export const requestVendorAdmins = user => {
  return {
    type: actionType.REQUEST_GET_VENDOR_ADMINS,
    user
  };
};

export const requestAddAdmin = admin => {
  return {
    type: actionType.REQUEST_ADD_ADMIN,
    admin
  };
};

export const requestUpdateAdmin = admin => {
  return {
    type: actionType.REQUEST_UPDATE_ADMIN,
    admin
  };
};

export const requestDeleteAdmins = admins => {
  return {
    type: actionType.REQUEST_DELETE_ADMINS,
    admins
  };
};

export function* updateAdmin({ admin }) {
  try {
    yield put(setAddAdminLoading(true));
    const response = yield call(updateAdminToDatabase, admin);
    yield put(setAddAdminLoading(false));
    yield put({
      type: actionType.REQUEST_GET_VENDOR_ADMINS_COMPLETED,
      payload: response
    });
  } catch (err) {
    yield put(setAddAdminLoading(false));
    yield put({
      type: actionType.REQUEST_GET_VENDOR_ADMINS_COMPLETED,
      payload: []
    });
  }
}

export function* deleteAdmins({ admins }) {
  try {
    yield put(setDeleteAdminLoading(true));
    const response = yield call(deleteAdminToDatabase, admins);
    yield put(setDeleteAdminLoading(false));
    yield put({
      type: actionType.REQUEST_GET_VENDOR_ADMINS_COMPLETED,
      payload: response
    });
  } catch (err) {
    yield put(setDeleteAdminLoading(false));
    yield put({
      type: actionType.REQUEST_GET_VENDOR_ADMINS_COMPLETED,
      payload: []
    });
  }
}

export function* addAdmin({ admin }) {
  try {
    yield put(setAddAdminLoading(true));
    const response = yield call(addAdminToDatabase, admin);
    yield put(setAddAdminLoading(false));
    yield put({
      type: actionType.REQUEST_GET_VENDOR_ADMINS_COMPLETED,
      payload: response
    });
  } catch (err) {
    yield put(setAddAdminLoading(false));
    yield put({
      type: actionType.REQUEST_GET_VENDOR_ADMINS_COMPLETED,
      payload: []
    });
  }
}

export function* getVendorAdmins({ user }) {
  try {
    const response = yield call(getVendorAdminsFromDatabase, user);
    yield put({
      type: actionType.REQUEST_GET_VENDOR_ADMINS_COMPLETED,
      payload: response
    });
  } catch (err) {
    yield put({
      type: actionType.REQUEST_GET_VENDOR_ADMINS_COMPLETED,
      payload: []
    });
  }
}

export function* updateVendor({ vendor }) {
  try {
    yield put(setFormSettingsLoading(true));
    const response = yield call(updateVendorToDatabase, vendor);
    yield put(setFormSettingsLoading(false));
    if (response) {
      yield put({
        type: actionType.REQUEST_UPDATE_VENDOR_COMPLETED,
        payload: response
      });
    } else {
      yield put({
        type: actionType.REQUEST_UPDATE_VENDOR_COMPLETED,
        payload: {}
      });
    }
  } catch (err) {
    console.log(err);
    yield put(setFormSettingsLoading(false));
    yield put({
      type: actionType.REQUEST_UPDATE_VENDOR_COMPLETED,
      payload: {}
    });
  }
}

export function* getVendorById2({ id2 }) {
  console.log("ACTION", id2);
  try {
    const vendors = yield call(getVendorById2FromDatabase, id2);

    console.log("getvendor id2", vendors);
    yield put({
      type: actionType.REQUEST_VENDOR_COMPLETED,
      payload: vendors
    });
  } catch (err) {
    console.log("err", err);
    yield put({
      type: actionType.REQUEST_VENDOR_COMPLETED,
      payload: []
    });
  }
}

export function* getVendor(action) {
  console.log("ACTION", action);
  try {
    console.log("getVendor!!!!!!!! ser", action.user);
    const vendors = yield call(getVendorFromDatabase, action.user);

    console.log("getVendor!!!!!!!!", vendors);
    yield put({
      type: actionType.REQUEST_VENDOR_COMPLETED,
      payload: vendors
    });
  } catch (err) {
    console.log("err", err);
    yield put({
      type: actionType.REQUEST_VENDOR_COMPLETED,
      payload: []
    });
  }
}
