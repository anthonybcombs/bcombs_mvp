import { call, take, put } from "redux-saga/effects";
import * as actionType from "./Constant";
import graphqlClient from "../../graphql";
import { IS_USER_EXIST_QUERY } from "../../graphql/query";
import { requestUserInfo } from "./Auth";
import { requestSignupFailed } from "./Status";
import { SIGN_UP_MUTATION, USER_UPDATE_MUTATION } from "../../graphql/mutation";

import { setProfileLoading } from "./Loading";

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
      console.log('Get User Profile To Database', response)
      resolve(response);
    } catch (error) {
      reject("error");
    }
  });
};

const getSecurityQuestionsToDatabase = email => {
  return new Promise(async (resolve, reject) => {
    try {
      const request = await fetch(
        `${process.env.API_HOST}/api/securityQuestions?email=${email}`,
        {
          method: "GET", // or 'PUT'
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
      const response = await request.json();
      resolve(response);
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
      resolve(addUserResponse);
    } catch (error) {
      reject("error");
    }
  });
};

const updateUserPhotoToDatabase = user => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("USERRRRRRRRRRRRRRRRRR", user);
      console.log(
        "`${process.env.API_HOST}/api/user/photo`",
        `${process.env.API_HOST}/api/user/photo`
      );
      const userRequest = await fetch(
        `${process.env.API_HOST}/api/user/photo`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(user)
        }
      );
      const userResponse = await userRequest.json();
      resolve(userResponse);
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
      const { data } = await graphqlClient.mutate({
        mutation: SIGN_UP_MUTATION,
        variables: {
          user
        }
      });
      resolve(data.signUp);
    } catch (error) {
      reject("error");
    }
  });
};
const updateUserToDatabase = user => {
  return new Promise(async (resolve, reject) => {
    try {
      const creds = {
        access_token: sessionStorage.getItem("access_token"),
        token_type: sessionStorage.getItem("token_type")
      };
      const { data } = await graphqlClient.mutate({
        mutation: USER_UPDATE_MUTATION,
        variables: { user: { creds, info: user } }
      });
      resolve(data.userUpdate);
    } catch (error) {
      reject("error");
    }
  });
};
const isUserExistToDatabase = user => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.query({
        query: IS_USER_EXIST_QUERY,
        variables: { email: user.email, username: user.username }
      });
      if (data.users.length > 0) {
        resolve({
          messageType: "error",
          message:
            "User already registered, please use different username and email address."
        });
      } else {
        resolve({
          messageType: "info",
          message: ""
        });
      }
    } catch (error) {
      reject("error");
    }
  });
};
export const requestAddUser = user => {
  delete user.confirm_password;
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
    const addUserResponse = yield call(addUserToDatabase, user);
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
    const updateUserResponse = yield call(updateUserToDatabase, user);
    if (updateUserResponse.messageType !== "error") {
      yield put({
        type: actionType.REQUEST_UPDATE_USER_COMPLETED,
        payload: updateUserResponse
      });
    }
    yield put({
      type: actionType.REQUEST_STATUS_COMPLETED,
      payload: {
        messageType: updateUserResponse.messageType,
        message: updateUserResponse.message
      }
    });
    yield put(requestUserInfo());
  } catch (error) {}
}
export function* checkedUserAndAdd({ user }) {
  try {
    const isUserExistResponse = yield call(isUserExistToDatabase, user);

    if (isUserExistResponse.messageType !== "error") {
      yield put(requestAddUser(user));
    } else if (isUserExistResponse.messageType === "error") {
      console.log("checkedUserAndAdd response", isUserExistResponse);
      yield put(requestSignupFailed(isUserExistResponse.message));
    } else {
      if (!user.isSocial) {
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("token_type");
        sessionStorage.removeItem("id_token");
        sessionStorage.removeItem("bigCalendarViewType");
        sessionStorage.removeItem("selectedCalendars");
      }
    }
  } catch (error) {
    console.log("checkedUserAndAdd error", error);
  }
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

export const requestSecurityQuestions = email => {
  return {
    type: actionType.REQUEST_SECURITY_QUESTIONS,
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
    yield put(setProfileLoading(true));
    const response = yield call(getUserProfileToDatabase, [email]);
    console.log('Get User info', response)
    yield put(setUserProfile(response));
    yield put(setProfileLoading(false));
  } catch (error) {
    console.log("Error getUserInfo", error);
    yield put(setProfileLoading(false));
  }
}

export function* getSecurityQuestions({ email }) {
  try {
    yield put(setProfileLoading(true));
    const response = yield call(getSecurityQuestionsToDatabase, [email]);
    yield put(setUserProfile(response));
    yield put(setProfileLoading(false));
  } catch (error) {
    console.log("Error getSecurityQuestions", error);
    yield put(setProfileLoading(false));
  }
}

export function* updateUserProfile(action) {
  try {
    console.log("updateUserProfile action", action.data);
    const response = yield call(updateUserProfileToDatabase, action.data);
    console.log("updateUserProfile response", response);
    if (response) {
      yield put(setUserProfile(response.data));
    }
  } catch (error) {}
}

export function* updateUserProfilePhoto(action) {
  try {
    const response = yield call(updateUserPhotoToDatabase, action.data);

    yield put({
      type: actionType.REQUEST_AUTH_USER_INFO_COMPLETED,
      payload: response.data
    });
  } catch (error) {}
}
