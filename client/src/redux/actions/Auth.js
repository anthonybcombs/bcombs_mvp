import { call, take, put } from "redux-saga/effects";
import graphqlClient from "../../graphql";
import {
  SIGN_IN_MUTATION,
  CHANGE_PASSWORD_MUTATION
} from "../../graphql/mutation";
import { USER_INFO_QUERY } from "../../graphql/query";
import * as actionType from "./Constant";
const authentecating = auth => {
  const { email, password } = auth[0];
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.mutate({
        mutation: SIGN_IN_MUTATION,
        variables: {
          user: {
            email,
            password
          }
        }
      });
      resolve({ ...data.signIn });
    } catch (error) {
      reject("error");
    }
  });
};
const getUserInfo = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.query({
        query: USER_INFO_QUERY,
        variables: {
          access_token: sessionStorage.getItem("access_token"),
          token_type: sessionStorage.getItem("token_type")
        }
      });

      if (data.userInfo.type === "invalid-json") {
        reject("error");
      }
      resolve(data.userInfo);
    } catch (error) {
      reject("error");
    }
  });
};
const requestPasswordChangeFromServer = user => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.mutate({
        mutation: CHANGE_PASSWORD_MUTATION,
        variables: {
          user: {
            email: user.email
          }
        }
      });
      resolve({
        messageType: data.changePassword.messageType,
        message: data.changePassword.message
      });
    } catch (error) {
      reject("error");
    }
  });
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
    console.log("set", authData);
    if (authData.user.hasOwnProperty("sub")) {
      if (authData.user.access_token) {
        sessionStorage.setItem("access_token", authData.user.access_token);
        sessionStorage.setItem("token_type", authData.user.token_type);
        sessionStorage.setItem("id_token", authData.user.id_token);
      }
      if (
        !authData.user.email_verified &&
        authData.user.email_verified !== null
      ) {
        authData.status.messageType = "email_not_verified";
        authData.status.message = "Email is not verified.";
      }
    }
    yield put({ type: actionType.REQUEST_AUTH_COMPLETED, payload: authData });

    yield put({
      type: actionType.REQUEST_GET_CALENDARS_COMPLETED,
      payload: []
    });
    yield put({
      type: actionType.REQUEST_STATUS_COMPLETED,
      payload: {
        message: authData.status.message,
        messageType:
          authData.status.messageType === "email_not_verified" ||
          authData.status.messageType === "error"
            ? "error"
            : "info"
      }
    });
  } catch (error) {}
}

export function* gotUserInfo() {
  try {
    if (
      sessionStorage.getItem("access_token") !== null &&
      sessionStorage.getItem("token_type") !== null
    ) {
      const userInfoData = yield call(getUserInfo);
      if (
        !userInfoData.hasOwnProperty("email_verified") &&
        !userInfoData.email_verified
      ) {
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("token_type");
        sessionStorage.removeItem("bigCalendarViewType");
        //sessionStorage.removeItem("selectedCalendars");
        yield put({
          type: actionType.REQUEST_STATUS_COMPLETED,
          payload: {
            messageType: "error",
            message: "Email is not verified."
          }
        });
        return;
      }
      if (userInfoData === {}) {
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("token_type");
        sessionStorage.removeItem("bigCalendarViewType");
        // sessionStorage.removeItem("selectedCalendars");
        yield put({
          type: actionType.REQUEST_AUTH_USER_INFO_COMPLETED,
          payload: {
            status: {
              messageType: "error",
              error_description: ""
            }
          }
        });
        yield put({
          type: actionType.REQUEST_STATUS_COMPLETED,
          payload: {
            messageType: "",
            message: ""
          }
        });
      }
      yield put({
        type: actionType.REQUEST_AUTH_USER_INFO_COMPLETED,
        payload: userInfoData
      });
      yield put({
        type: actionType.REQUEST_STATUS_COMPLETED,
        payload: {
          messageType: "info",
          message: "got user info"
        }
      });
    } else {
      sessionStorage.removeItem("access_token");
      sessionStorage.removeItem("token_type");
      // sessionStorage.removeItem("bigCalendarViewType");
      // sessionStorage.removeItem("selectedCalendars");
      yield put({
        type: actionType.REQUEST_AUTH_USER_INFO_COMPLETED,
        payload: {
          status: {
            messageType: "error",
            error_description: ""
          }
        }
      });
      yield put({
        type: actionType.REQUEST_STATUS_COMPLETED,
        payload: {
          messageType: "",
          message: ""
        }
      });
    }
  } catch (error) {}
}
export function* loggedOut() {
  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("token_type");
  sessionStorage.removeItem("id_token");
  // sessionStorage.removeItem("bigCalendarViewType");
  // sessionStorage.removeItem("selectedCalendars");
  yield put({ type: actionType.REQUEST_AUTH_LOGOUT_COMPLETED });
}

export function* requestedPasswordChange({ user }) {
  const changePasswordDetail = yield call(
    requestPasswordChangeFromServer,
    user
  );
  yield put({
    type: actionType.REQUEST_CHANGE_PASSWORD_COMPLETED
  });
  yield put({
    type: actionType.REQUEST_STATUS_COMPLETED,
    payload: {
      messageType: changePasswordDetail.messageType,
      message: changePasswordDetail.message
    }
  });
}
