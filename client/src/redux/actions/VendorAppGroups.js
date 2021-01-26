import { call, take, put } from "redux-saga/effects";
import graphqlClient from "../../graphql";

import * as actionType from "./Constant";

import {
  ADD_VENDORS_APP_GROUP,
  DELETE_VENDORS_APP_GROUP,
  UPDATE_VENDORS_APP_GROUP,
  GET_VENDOR_APP_GROUP
} from "../../graphql/vendorMutation";

export const getVendorApplicationGroupFromDatabase = vendor => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('getVendorApplicationGroupFromDatabase vendor', vendor)
      const { data } = await graphqlClient.query({
        query: GET_VENDOR_APP_GROUP,
        variables: { vendor }
      });
      console.log('getVendorApplicationGroupFromDatabase data', data)
      return resolve(data.getAllFormAppGroupsByVendor);
    } catch (error) {
      console.log("error", error);
      reject(error);
    }
  });
}


const addVendorApplicationGroupToDatabase = appGroup => {
  console.log("appGroup", appGroup);
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.mutate({
        mutation: ADD_VENDORS_APP_GROUP,
        variables: { appGroup }
      });

      return resolve(data.addVendorAppGroup);
    } catch (error) {
      console.log("error", error);
      reject(error);
    }
  });
};

const editVendorApplicationGroupToDatabase = appGroup => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("editVendorApplicationGroupToDatabase appGroup", appGroup);
      const { data } = await graphqlClient.mutate({
        mutation: UPDATE_VENDORS_APP_GROUP,
        variables: { appGroup }
      });

      return resolve(data.editVendorAppGroup);
    } catch (error) {
      console.log("error", error);
      reject(error);
    }
  });
};

const deleteVendorApplicationGroupToDatabase = (ap) => {
  return new Promise(async (resolve, reject) => {
    try {
      const appGroup = {
        ...ap
      };
      const { data } = await graphqlClient.mutate({
        mutation: DELETE_VENDORS_APP_GROUP,
        variables: { appGroup }
      });
      console.log("data.deleteVendorAppGroups", data.deleteVendorAppGroup);
      return resolve(data.deleteVendorAppGroup);
    } catch (error) {
      console.log("error", error);
      reject(error);
    }
  });
};

export const requestAddVendorAppGroup = appGroup => {
  return {
    type: actionType.REQUEST_ADD_VENDOR_APP_GROUP,
    appGroup: appGroup
  };
};

export function setUserGroups(data) {
  return {
    type: actionType.SET_USER_GROUPS,
    data
  };
}

export function* addVendorAppGroup({ appGroup }) {
  try {
    const response = yield call(addVendorApplicationGroupToDatabase, appGroup);
    yield put(setUserGroups(response));
  } catch (error) {
    console.log("error", error);
  }
}

export const requestEditVendorAppGroup = appGroup => {
  return {
    type: actionType.REQUEST_EDIT_VENDOR_APP_GROUP,
    appGroup
  };
};

export function* editVendorAppGroup({ appGroup }) {
  try {
    const response = yield call(editVendorApplicationGroupToDatabase, appGroup);
    yield put(setUserGroups(response));
  } catch (error) {
    console.log("error", error);
  }
}

export const requestDeleteVendorAppGroup = appGroup => {
  return {
    type: actionType.REQUEST_DELETE_VENDOR_APP_GROUP,
    appGroup
  };
};

export function* deleteVendorAppGroup({ appGroup }) {
  try {
    const response = yield call(
      deleteVendorApplicationGroupToDatabase,
      appGroup
    );
    yield put(setUserGroups(response));
  } catch (error) {
    console.log("error", error);
  }
}
