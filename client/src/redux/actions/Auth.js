import { call, take, put } from "redux-saga/effects";
import * as actionType from "./Constant";
const authentecating = auth => {
  return new Promise(async (resolve, reject) => {
    try {
      const authResponse = await fetch(
        `${process.env.API_HOST}/api/auth/authorize`,
        {
          method: "POST", // or 'PUT'
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(...auth)
        }
      );
      const authData = authResponse.json();
      return resolve(authData);
    } catch (error) {
      reject("error");
    }
  });
};
const getUserInfo = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const userInfoResponse = await fetch(
        `${process.env.API_HOST}/api/auth/userinfo`,
        {
          method: "POST", // or 'PUT'
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            access_token: sessionStorage.getItem("access_token"),
            token_type: sessionStorage.getItem("token_type")
          })
        }
      );
      const userInfo = userInfoResponse.json();
      return resolve(userInfo);
    } catch (error) {
      reject("error");
    }
  });
};
const requestPasswordChangeFromServer = user => {
  return new Promise(async (resolve, reject) => {
    try {
      await fetch(`${process.env.API_HOST}/api/auth/changepassword`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(...user)
      });
      resolve("success");
    } catch (error) {
      reject("error");
    }
  });
};
export const requestRemoveAuthMessages = () => {
  return {
    type: actionType.REQUEST_AUTH_REMOVE_MESSAGES
  };
};
export const requestAuth = auth => {
  return {
    type: actionType.REQUEST_AUTH,
    auth
  };
};
export const requestUserInfo = () => {
  return {
    type: actionType.REQUEST_AUTH_USER_INFO
  };
};
export const requestLogout = () => {
  return {
    type: actionType.REQUEST_AUTH_LOGOUT
  };
};
export const requestPasswordChange = user => {
  return { type: actionType.REQUEST_CHANGE_PASSWORD, user };
};
export function* authenticated({ auth }) {
  try {
    const authData = yield call(authentecating, [auth]);
    if (authData.hasOwnProperty("sub")) {
      sessionStorage.setItem("access_token", authData.access_token);
      sessionStorage.setItem("token_type", authData.token_type);
      sessionStorage.setItem("id_token", authData.id_token);
      if (!authData.email_verified) {
        authData.error = "email_not_verified";
        authData.messageType = "error";
        authData.error_description = "Email is not verified.";
      }
    }
    yield put({ type: actionType.REQUEST_AUTH_COMPLETED, payload: authData });
  } catch (error) {}
}

export function* gotUserInfo() {
  try {
    if (
      sessionStorage.getItem("access_token") !== null &&
      sessionStorage.getItem("token_type") !== null
    ) {
      const userInfoData = yield call(getUserInfo);
      if (!userInfoData.email_verified) {
        userInfoData.error = "email_not_verified";
        userInfoData.messageType = "error";
        userInfoData.error_description = "Email is not verified.";
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("token_type");
      }
      yield put({
        type: actionType.REQUEST_AUTH_USER_INFO_COMPLETED,
        payload: userInfoData
      });
    } else {
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("token_type");
      yield put({
        type: actionType.REQUEST_AUTH_USER_INFO_COMPLETED,
        payload: {
          error: "no_user",
          messageType: "error",
          error_description: ""
        }
      });
    }
  } catch (error) {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("token_type");
  }
}
export function* loggedOut() {
  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("token_type");
  sessionStorage.removeItem("id_token");
  yield put({ type: actionType.REQUEST_AUTH_LOGOUT_COMPLETED });
}

export function* requestedPasswordChange({ user }) {
  yield call(requestPasswordChangeFromServer, [user]);
  yield put({
    type: actionType.REQUEST_CHANGE_PASSWORD_COMPLETED,
    payload: { messageType: "info", message: "Email has ben sent!" }
  });
}
export function* removedAuthMessages() {
  yield put({
    type: actionType.REQUEST_AUTH_REMOVE_MESSAGES_COMPLETED
  });
}
