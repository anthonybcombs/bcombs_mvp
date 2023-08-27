import { call, take, put } from "redux-saga/effects";
import graphqlClient from "../../graphql";
import {
  VENDOR_UPDATE_MUTATION,
  VENDOR_BY_USER_QUERY,
  VENDOR_BY_ID_QUERY,
  VENDOR_BY_ID2_QUERY,
  GET_VENDOR_ADMINS,
  ADD_VENDOR_ADMIN,
  DELETE_VENDOR_ADMIN,
  UPDATE_VENDOR_ADMIN,
  GET_USER_VENDOR_FORMS,
  CREATE_GROUP_REMINDER,
  GET_VENDOR_REMINDER,
  UPDATE_VENDOR_LOGO,
  CREATE_VENDOR,
  UPDATE_DEFAULT_VENDOR
} from "../../graphql/vendorMutation";

import { GET_FORM_APP_GROUP } from "../../graphql/groupQuery";

import { getVendorApplicationGroupFromDatabase } from './VendorAppGroups';
import * as actionType from "./Constant";

import {
  setFormSettingsLoading,
  setAddAdminLoading,
  setDeleteAdminLoading,
  setApplicationLoading,
  setGroupMemberLoadingLoading
} from "./Loading";

const createVendorToDatabase = vendor => {
  delete vendor.isDuplicate;
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.mutate({
        mutation: CREATE_VENDOR,
        variables: { vendor }
      })

      console.log('new data', data);

      return resolve(data.createVendor);
    } catch(error) {
      console.log('create vendor err', error);
      reject(error)
    }
  })
}

const getVendorReminderFromDatabase = args => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.query({
        query: GET_VENDOR_REMINDER,
        variables: { vendor_id: args.vendor }
      });

      console.log("data data", data);

      return resolve(data.getVendorApplicationReminder);
    } catch (error) {
      reject(error);
    }
  });
}

const addReminderToDatabase = groupReminder => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.mutate({
        mutation: CREATE_GROUP_REMINDER,
        variables: { groupReminder }
      })

      return resolve(data.createGroupReminder);
    } catch(error) {
      reject(error)
    }
  })
}

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

      console.log("getVendorAdminsFromDatabase data", data);

      return resolve(data.getVendorAdminsByUser);
    } catch (error) {
      reject(error);
    }
  });
};

const getUserVendorFormsFromDatabase = user => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.query({
        query: GET_USER_VENDOR_FORMS,
        variables: { user }
      });

      return resolve(data.getUserVendorForms);
    } catch (error) {
      reject(error);
    }
  });
}

const getFormAppGroupFromDatabase = form => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.query({
        query: GET_FORM_APP_GROUP,
        variables: { form }
      });

      return resolve(data.getFormAppGroup);
    } catch (error) {
      reject(error);
    }
  });
}

const getVendorFromDatabase = (user, withApplications = true) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('getVendorFromDatabase withApplications',withApplications)
      const { data } = await graphqlClient.query({
        query: VENDOR_BY_USER_QUERY,
        variables: { user, withApplications }
      });
      console.log('getVendorFromDatabase ',data)
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

const getVendorByIdFromDatabase = id => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.query({
        query: VENDOR_BY_ID_QUERY,
        variables: { id }
      });

      return resolve(data.getVendorById);
    } catch (error) {
      reject(error);
    }
  });
};

const updateVendorLogoToDatabase = payload => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.mutate({
        mutation: UPDATE_VENDOR_LOGO,
        variables: { vendorLogo: {...payload}  }
      });

      console.log("data data", data);

      return resolve(data.updateVendorLogo);
    } catch (error) {
      reject(error);
    }
  });
};

const updateDefaultVendorFromDataBase = payload => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.mutate({
        mutation: UPDATE_DEFAULT_VENDOR,
        variables: { user_id: payload.user_id, vendor_id: payload.vendor_id }
      });

      console.log("updateDefaultVendorFromDataBase data", data);

      return resolve(data.updateDefaultVendor);
    } catch (error) {
      console.log("updateDefaultVendorFromDataBase error", error);
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

export const requestSelectedVendor = vendor => {
  return {
    type: actionType.REQUEST_SELECTED_VENDOR,
    vendor
  }
}

export const requestCreateVendor = vendor => {
  return {
    type: actionType.REQUEST_CREATE_VENDOR,
    vendor
  }
}

export const requestCreateGroupReminder = groupReminder => {
  console.log('groupReminder12345', groupReminder);

  return {
    type: actionType.REQUEST_CREATE_GROUP_REMINDER,
    groupReminder
  };
};

export const requestVendorById2 = id2 => {
  return {
    type: actionType.REQUEST_VENDOR_BY_ID2,
    id2
  };
};

export const requestVendorById = id => {
  return {
    type: actionType.REQUEST_VENDOR_BY_ID,
    id
  };
};

export const requestVendor = (user, withApplications = true) => {
  return {
    type: actionType.REQUEST_VENDOR,
    user,
    withApplications
  };
};

export const requestUserVendorForms = user => {
  return {
    type: actionType.REQUEST_USER_VENDOR_FORMS,
    user
  };
}

export const requestGetFormAppGroup = form => {
  return {
    type: actionType.REQUEST_GET_FORM_APP_GROUP,
    form
  }
}

export const requestVendorAppGroups = vendor => {
  console.log('requestVendorAppGroups vendor', vendor)
  return {
    type: actionType.REQUEST_VENDOR_APP_GROUPS,
    vendor
  }
}
export const requestUpdateVendor = vendor => {
  return {
    type: actionType.REQUEST_UPDATE_VENDOR,
    vendor
  };
};

export const requestUpdateVendorLogo = data => {
  return {
    type: actionType.REQUEST_UPDATE_VENDOR_LOGO,
    data
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

export const requestGetVendorReminders = vendor => {
  return {
    type: actionType.REQUEST_GET_VENDOR_REMINDER,
    vendor
  };
}

export const setDefaultVendor = ({ user_id = '', vendor_id = '' }) => {
  return {
    type: actionType.SET_DEFAULT_VENDOR,
    user_id,
    vendor_id
  };
}


export function* getVendorReminders({ vendor }) {
  try {
    const response = yield call(getVendorReminderFromDatabase, vendor );
    yield put({
      type: actionType.REQUEST_GET_VENDOR_REMINDER_COMPLETED,
      payload: response
    })
  } catch(err) {
    yield put({
      type: actionType.REQUEST_GET_VENDOR_REMINDER_COMPLETED,
      payload: []
    })
  }
}

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
    console.log('getVendorAdmins', user)
    const response = yield call(getVendorAdminsFromDatabase, user);
    console.log('getVendorAdmins response', response)
    yield put({
      type: actionType.REQUEST_GET_VENDOR_ADMINS_COMPLETED,
      payload: response
    });
  } catch (err) {
    console.log('getVendorAdmins err', err)
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

export function* createGroupReminder({ groupReminder }) {
  console.log('createGroupReminder', groupReminder);

  const response = yield call(addReminderToDatabase, groupReminder );

  yield put({
    type: actionType.REQUEST_CREATE_GROUP_REMINDER_COMPLETED,
    payload: response
  })
}

export function* getVendorById({ id }) {
  console.log("ACTION", id);
  try {
    const vendors = yield call(getVendorByIdFromDatabase, id);

    console.log("getvendor id", vendors);
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
    const vendors = yield call(getVendorFromDatabase, action.user, action.withApplications);
    // const sortedVendors = vendors.sort((a,b) => a.id2 - b.id2);
    const formattedVendors = vendors.map(item => {
      return {
        ...item,
        is_lot: item.name.includes('LOT')
      }
    })
    yield put({
      type: actionType.REQUEST_VENDOR_COMPLETED,
      payload: formattedVendors
    });
  } catch (err) {
    console.log("err", err);
    yield put({
      type: actionType.REQUEST_VENDOR_COMPLETED,
      payload: []
    });
  }
}

export function* getUserVendorForms(action) {
  try {
    const forms = yield call(getUserVendorFormsFromDatabase, action.user);
    yield put({
      type: actionType.REQUEST_USER_VENDOR_FORMS_COMPLETED,
      payload: forms
    });

    yield put(setGroupMemberLoadingLoading(false));
  } catch (err) {
    console.log("err", err);
    yield put({
      type: actionType.REQUEST_USER_VENDOR_FORMS_COMPLETED,
      payload: []
    });
  }
}

export function* getFormAppGroup(action) {
  try {
    const appGroups = yield call(getFormAppGroupFromDatabase, action.form);
    yield put({
      type: actionType.REQUEST_GET_FORM_APP_GROUP_COMPLETED,
      payload: appGroups
    });
  } catch (err) {
    console.log("err", err);
    yield put({
      type: actionType.REQUEST_GET_FORM_APP_GROUP_COMPLETED,
      payload: []
    });
  }
}

export function* getVendorAppGroups(action) {
  try {
    console.log('getVendorAppGroups  action.vendor',  action.vendor)
    const appGroups = yield call(getVendorApplicationGroupFromDatabase, action.vendor);
    yield put({
      type: actionType.REQUEST_GET_FORM_APP_GROUP_COMPLETED,
      payload: appGroups
    });
  } catch (err) {
    console.log("err", err);
    yield put({
      type: actionType.REQUEST_GET_FORM_APP_GROUP_COMPLETED,
      payload: []
    });
  }
}

export function* updateVendorLogo({ data }) {
  try {
    yield put(setFormSettingsLoading(true));
    yield call(updateVendorLogoToDatabase, data);
    yield put(setFormSettingsLoading(false));
  } catch (err) {
    yield put(setFormSettingsLoading(false));
  
  }
}

export function* updateDefaultVendor({ user_id, vendor_id}) {
  try {
    console.log('updateDefaultVendor user_id', user_id)
    console.log('updateDefaultVendor vendor_id', vendor_id)
    const response = yield call(updateDefaultVendorFromDataBase, { user_id, vendor_id});

    console.log('updateDefaultVendor responseee', response)
  } catch (err) {
    console.log('updateDefaultVendor err', err)
  }
}




export function* createVendor({ vendor }) {
  try {
    console.log('new vendor',vendor);
    const response = yield call(createVendorToDatabase, vendor)
    console.log('new response', response);

    yield put({
      type: actionType.REQUEST_DUPLICATE_VENDOR_COMPLETED,
      payload: response
    });

  } catch (err) {
    yield put({
      type: actionType.REQUEST_DUPLICATE_VENDOR_COMPLETED,
      payload: {}
    });
  }
}

export function* setSelectedVendor({vendor}) {

  yield put({
    type: actionType.REQUEST_SELECTED_VENDOR_COMPLETED,
    payload: vendor
  });
}