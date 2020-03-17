import { call, take, put } from "redux-saga/effects";
import * as actionType from "./Constant";
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
