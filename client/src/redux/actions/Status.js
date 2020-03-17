import * as actionType from "./Constant";
import { put } from "redux-saga/effects";
export const requestStatus = status => {
  return {
    type: actionType.REQUEST_STATUS,
    status
  };
};
export const requestRemoveStatus = () => {
  return {
    type: actionType.REQUEST_REMOVE_STATUS
  };
};
export function* requestedStatus({ status }) {
  yield put({ type: actionType.REQUEST_STATUS_COMPLETED, payload: status });
}

export function* removedStatus() {
  yield put({ type: actionType.REQUEST_REMOVE_STATUS_COMPLETED });
}
