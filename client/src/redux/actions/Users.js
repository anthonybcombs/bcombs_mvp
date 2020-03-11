import { call, take, put } from "redux-saga/effects";
import * as actionType from "./Constant";
const addUserToDatabase = user => {
  return new Promise(async (resolve, reject) => {
    try {
      await fetch(`${process.env.API_HOST}/api/users/add`, {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(...user)
      });
      return resolve("success");
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

export function* addedUser({ user }) {
  try {
    yield call(addUserToDatabase, [user]);
    yield put({ type: actionType.REQUEST_ADD_USER_COMPLETED });
  } catch (error) {}
}
