import { call, take, put } from "redux-saga/effects";
import * as actionType from "./Constant";
const authentecating = () => {
  return new Promise((resolve, reject) => {
    return resolve("success");
  });
};
export const requestAuth = () => {
  return {
    type: actionType.REQUEST_AUTH
  };
};

export function* authenticated() {
  yield call(authentecating);
  yield put({ type: actionType.REQUEST_AUTH_COMPLETED });
}
