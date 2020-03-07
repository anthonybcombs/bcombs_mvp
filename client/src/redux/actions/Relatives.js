import { call, take, put } from "redux-saga/effects";
import * as actionType from "./Constant";
const addRelativeToDatabase = ({ group }) => {
  return new Promise((resolve, reject) => {
    return resolve("success");
  });
};
export const addRelative = relative => {
  return {
    type: actionType.REQUEST_ADD_RELATIVE,
    relative
  };
};
export function* addedRelative({ relative }) {
  yield call(addRelativeToDatabase, [relative]);
  yield put({
    type: actionType.REQUEST_ADD_RELATIVE_COMPLETED,
    payload: relative
  });
}
