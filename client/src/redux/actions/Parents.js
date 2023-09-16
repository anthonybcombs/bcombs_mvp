import { call, put } from "redux-saga/effects";

import graphqlClient from "../../graphql";

import {
  PARENT_BY_VENDOR_QUERY,
  UPDATE_PARENT_VENDOR_PERMISSION
} from "../../graphql/vendorMutation";

import * as actionType from "./Constant";

export const requestUpdateParentPermissionByVendor = ({
  parents = [],
  vendor_id,
  app_group_id,
  form_type = 'mentoring'
}) => {
  return {
    type: actionType.REQUEST_PARENT_PERMISSION_BY_VENDOR,
    parents,
    vendor_id,
    app_group_id,
    form_type
  };
};

export const requestParentByVendor = ({
  vendor,
  app_group_id = null,
  form_type = '',
  vendor_mode = false
}) => {
  return {
    type: actionType.REQUEST_PARENT_BY_VENDOR,
    vendor,
    app_group_id,
    form_type,
    vendor_mode
  };
};


export function* getParentByVendor({ vendor, app_group_id, form_type = '', vendor_mode = false }) {
  try {

    const response = yield call(getParentByVendorFromDatabase, {
      vendor_id: vendor, app_group_id, form_type, vendor_mode
    });


    const updatedResponse = response.sort((a, b) => b.is_profile_filled - a.is_profile_filled)
    console.log('responsezzzzzzzzzzzzzzzzzzzz', updatedResponse)

    yield put({
      type: actionType.SET_PARENT_LIST_BY_VENDOR,
      payload: updatedResponse
    });

  } catch (error) {
    console.log('getParentByVendor Error', error)
  }
}

export function* updateParentPermissionByVendor({ parents = [], vendor_id, app_group_id, form_type }) {
  try {
    const response = yield call(updateParentPermissionByVendorFromDatabase, {
      parents, vendor_id,
      app_group_id, form_type
    });
    yield put({
      type: actionType.SET_PARENT_LIST_BY_VENDOR,
      payload: response
    });

  } catch (error) {
    console.log('getParentByVendor Error', error)
  }
}

const getParentByVendorFromDatabase = ({
  vendor_id, app_group_id, form_type, vendor_mode
}) => {
  return new Promise(async (resolve, reject) => {
    try {

      const { data } = await graphqlClient.query({
        query: PARENT_BY_VENDOR_QUERY,
        variables: { vendor_id, app_group_id, form_type, vendor_mode }
      });
      return resolve(data.getParentByVendor);
    } catch (error) {
      console.log("getParentByVendorFromDatabase error", error);
      reject(error);
    }
  });
}

const
  updateParentPermissionByVendorFromDatabase = ({
    parents = [], vendor_id,
    app_group_id = null,
    form_type = 'mentoring'
  }) => {
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await graphqlClient.query({
          query: UPDATE_PARENT_VENDOR_PERMISSION,
          variables: { 
            parents, 
            vendor_id,
            app_group_id, 
            form_type  
          }
        });
        return resolve(data?.updateParentVendorShare || []);
      } catch (error) {
        console.log("updateParentPermissionByVendorFromDatabase error", error);
        reject(error);
      }
    });
  }