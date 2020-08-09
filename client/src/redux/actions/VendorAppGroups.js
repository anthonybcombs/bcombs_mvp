import { call, take, put } from "redux-saga/effects";
import graphqlClient from "../../graphql";

import * as actionType from "./Constant";

import { ADD_VENDORS_APP_GROUP } from "../../graphql/vendorMutation";

const getVendorApplicationGroupFromDatabase = vendor => {

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
      console.log("error", error)
      reject(error);
    }
  });
}

export const requestAddVendorAppGroup = appGroup => {
  return {
    type: actionType.REQUEST_ADD_VENDOR_APP_GROUP,
    appGroup: appGroup
  }
}

export function setUserGroups(data) {
  return {
    type: actionType.SET_USER_GROUPS,
    data
  };
}

export function* addVendorAppGroup({ appGroup }) {
  console.log("Request App Grouo", appGroup);
  try {
    const response = yield call(addVendorApplicationGroupToDatabase, appGroup);
    yield put(setUserGroups(response));
  } catch (error) { console.log("error", error)}
}