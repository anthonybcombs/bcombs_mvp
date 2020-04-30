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
      console.log("data[0]", auth[0]);
      const { data } = await graphqlClient.mutate({
        mutation: SIGN_IN_MUTATION,
        variables: {
          user: {
            email,
            password
          }
        }
      });
      console.log("data[0] data", data);
      return resolve({ ...data.signIn.user });
    } catch (error) {
      reject("error");
    }
  });
};
const getUserInfo = () => {
  return new Promise(async (resolve, reject) => {
    try {
      // const userInfoResponse = await fetch(
      //   `${process.env.API_HOST}/api/auth/userinfo`,
      //   {
      //     method: "POST", // or 'PUT'
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //     body: JSON.stringify({
      //       access_token: sessionStorage.getItem("access_token"),
      //       token_type: sessionStorage.getItem("token_type"),
      //     }),
      //   }
      // );
      // const userInfo = await userInfoResponse.json();
      console.log("tokennnn", sessionStorage.getItem("access_token"));
      const { data } = await graphqlClient.query({
        query: USER_INFO_QUERY,
        variables: {
          access_token: sessionStorage.getItem("access_token"),
          token_type: sessionStorage.getItem("token_type")
        }
      });
      console.log("dataaaaaaaaa", data);
      if (data.userInfo.type === "invalid-json") {
        reject("error");
      }
      return resolve(data.userInfo);
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
  console.log("authhhhhhhhhhh", auth);
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
      if (authData.access_token) {
        sessionStorage.setItem("access_token", authData.access_token);
        sessionStorage.setItem("token_type", authData.token_type);
        sessionStorage.setItem("id_token", authData.id_token);
      }
      if (!authData.email_verified) {
        authData.messageType = "email_not_verified";
        authData.message = "Email is not verified.";
      }
    }

    yield put({ type: actionType.REQUEST_AUTH_COMPLETED, payload: authData });
    yield put({
      type: actionType.REQUEST_STATUS_COMPLETED,
      payload: {
        message: authData.message,
        messageType:
          authData.messageType === "email_not_verified" ? "error" : "info"
      }
    });
  } catch (error) {}
}

export function* gotUserInfo() {
  yield take([
    actionType.REQUEST_STATUS_COMPLETED,
    actionType.REQUEST_USER_TYPES_COMPLETED
  ]);
  try {
    if (
      sessionStorage.getItem("access_token") !== null &&
      sessionStorage.getItem("token_type") !== null
    ) {
      const userInfoData = yield call(getUserInfo);
      if (
        !userInfoData.hasOwnProperty("email_verified") &&
        userInfoData.email_verified
      ) {
        sessionStorage.removeItem("access_token");
        sessionStorage.removeItem("token_type");
        yield put({
          type: actionType.REQUEST_STATUS_COMPLETED,
          payload: {
            messageType: "error",
            message: "Email is not verified."
          }
        });
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
          messageType: "error",
          error_description: ""
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
