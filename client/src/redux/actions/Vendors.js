import { call, take, put } from "redux-saga/effects";
import graphqlClient from "../../graphql";
import { VENDOR_UPDATE_MUTATION, VENDOR_BY_USER_QUERY } from "../../graphql/vendorMutation";
import * as actionType from "./Constant";

const getVendorFromDatabase = user => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.query({
        query: VENDOR_BY_USER_QUERY,
        variables: {user},
      });

      return resolve(data.vendor);
    } catch (error) {
      reject(error)
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
      })

      return resolve(data.updateVendor)

    } catch (error) {
      reject(error);
    }
  })
}

export const requestVendor = user => {
  return {
    type: actionType.REQUEST_VENDOR,
    user
  };
};

export const requestUpdateVendor = (vendor) => {
  return {
    type: actionType.REQUEST_UPDATE_VENDOR,
    vendor
  }
}

export function* updateVendor({ vendor }) {

  try {
    const response = yield call(updateVendorToDatabase, vendor);

    console.log("vendor 12121");
    console.log(response);
    
    if(response) {
      yield put({
        type: actionType.REQUEST_UPDATE_VENDOR_COMPLETED,
        payload: response
      })
    } else {
      yield put({
        type: actionType.REQUEST_UPDATE_VENDOR_COMPLETED,
        payload: {}
      })
    }

  } catch(err) {
    console.log(err);
    yield put({
      type: actionType.REQUEST_UPDATE_VENDOR_COMPLETED,
      payload: {}
    })
  }
}

export function* getVendor(action) {
  try {
    const vendor = yield call(getVendorFromDatabase, action.user);

    yield put({
      type: actionType.REQUEST_VENDOR_COMPLETED,
      payload: vendor,
    });
  } catch(err) {
    yield put({
      type: actionType.REQUEST_VENDOR_COMPLETED,
      payload: {},
    });
  }
}
