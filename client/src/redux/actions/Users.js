import { call, take, put } from "redux-saga/effects";
import * as actionType from "./Constant";

import { requestUserInfo } from "./Auth";

// **************************************************** //
const getUserProfileToDatabase = email => {
  return new Promise(async (resolve, reject) => {
    try {
      const userProfileRequest = await fetch(
        `${process.env.API_HOST}/api/userProfile?email=${email}`,
        {
          method: "GET", // or 'PUT'
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      const response = await userProfileRequest.json();
      return resolve(response);
    } catch (error) {
      reject("error");
    }
  });
};

const updateUserProfileToDatabase = user => {
  return new Promise(async (resolve, reject) => {
    try {
      const addUserRequest = await fetch(
        `${process.env.API_HOST}/api/user/profile`,
        {
          method: "PUT", // or 'PUT'
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(user)
        }
      );
      const addUserResponse = await addUserRequest.json();
      return resolve(addUserResponse);
    } catch (error) {
      reject("error");
    }
  });
};

const updateUserPhotoToDatabase = user => {
  return new Promise(async (resolve, reject) => {
    try {
      const addUserRequest = await fetch(
        `${process.env.API_HOST}/api/user/photo`,
        {
          method: "POST",
          body: user
        }
      );
      const addUserResponse = await addUserRequest.json();
      return resolve(addUserResponse);
    } catch (error) {
      console.log("Error", error);
      reject("error");
    }
  });
};

// **************************************************** //

const addUserToDatabase = user => {
  return new Promise(async (resolve, reject) => {
    try {
      const addUserRequest = await fetch(
        `${process.env.API_HOST}/api/users/add`,
        {
          method: "POST", // or 'PUT'
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(...user)
        }
      );
      const addUserResponse = await addUserRequest.json();
      return resolve(addUserResponse);
    } catch (error) {
      reject("error");
    }
  });
};
const updateUserToDatabase = user => {
  return new Promise(async (resolve, reject) => {
    try {
      const addUserRequest = await fetch(
        `${process.env.API_HOST}/api/users/update`,
        {
          method: "POST", // or 'PUT'
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(...user)
        }
      );
      const addUserResponse = await addUserRequest.json();
      return resolve(addUserResponse);
    } catch (error) {
      reject("error");
    }
  });
};
const isUserExistToDatabase = user => {
  return new Promise(async (resolve, reject) => {
    try {
      const isUserExistResponse = await fetch(
        `${process.env.API_HOST}/api/users/isuserexist`,
        {
          method: "POST", // or 'PUT'
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(...user)
        }
      );
      const isUserExist = await isUserExistResponse.json();
      return resolve(isUserExist);
    } catch (error) {
      reject("error");
    }
  });
};
export const requestAddUser = user => {
  return {
    type: actionType.REQUEST_ADD_USER,
    user
  };
};
export const requestUpdateUser = user => {
  return {
    type: actionType.REQUEST_UPDATE_USER,
    user
  };
};
export const requestCheckuserAndAdd = user => {
  return {
    type: actionType.REQUEST_CHECK_USER_AND_ADD,
    user
  };
};
export function* addedUser({ user }) {
  try {
    const addUserResponse = yield call(addUserToDatabase, [user]);
    yield put({
      type: actionType.REQUEST_ADD_USER_COMPLETED,
      payload: addUserResponse
    });
    yield put({
      type: actionType.REQUEST_STATUS_COMPLETED,
      payload: {
        messageType: addUserResponse.messageType,
        message: addUserResponse.message
      }
    });
  } catch (error) {}
}

export function* updatedUser({ user }) {
  try {
    const updateUserResponse = yield call(updateUserToDatabase, [user]);
    yield put({
      type: actionType.REQUEST_UPDATE_USER_COMPLETED,
      payload: updateUserResponse
    });
    yield put({
      type: actionType.REQUEST_STATUS_COMPLETED,
      payload: {
        messageType: updateUserResponse.messageType,
        message: updateUserResponse.message
      }
    });
  } catch (error) {}
}
export function* checkedUserAndAdd({ user }) {
  try {
    const isUserExistResponse = yield call(isUserExistToDatabase, [user]);
    if (isUserExistResponse.messageType !== "error") {
      yield put(requestAddUser(user));
      return;
    } else {
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("token_type");
      sessionStorage.removeItem("id_token");
    }
    yield put({
      type: actionType.REQUEST_STATUS_COMPLETED,
      payload: {
        messageType: isUserExistResponse.messageType,
        message: isUserExistResponse.message
      }
    });
  } catch (error) {}
}

// ADDED BY DENNIS
export const setUserProfile = user => {
  return {
    type: actionType.SET_USER_PROFILE,
    user
  };
};

export const requestUserProfile = email => {
  return {
    type: actionType.REQUEST_USER_PROFILE,
    email
  };
};

export const requestUpdateUserPhoto = data => {
  return {
    type: actionType.REQUEST_UPDATE_USER_PHOTO,
    data
  };
};

export const requestUpdateUserProfile = data => {
  return {
    type: actionType.REQUEST_UPDATE_USER_PROFILE,
    data
  };
};

export function* getUserInfo({ email }) {
  try {
    const response = yield call(getUserProfileToDatabase, [email]);
    yield put(setUserProfile(response));
  } catch (error) {}
}

export function* updateUserProfile(action) {
  try {
    const response = yield call(updateUserProfileToDatabase, action.data);
    yield put(setUserProfile(response));
  } catch (error) {}
}

export function* updateUserProfilePhoto(action) {
  try {
    yield call(updateUserPhotoToDatabase, action.data);
    yield put(requestUserInfo());
  } catch (error) {}
}
