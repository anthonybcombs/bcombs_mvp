import { call, take, put } from "redux-saga/effects";
import * as actionType from "./Constant";
const getUserTypesFromDatabase = async () => {
  const response = await fetch(`${process.env.API_HOST}/api/userTypes/`);
  const userTypes = response.json();
  return userTypes;
};
export const requestUserTypes = () => {
  return {
    type: actionType.REQUEST_USER_TYPES
  };
};

export function* gotUserTypes() {
  const userTypes = yield call(getUserTypesFromDatabase);
  yield put({
    type: actionType.REQUEST_USER_TYPES_COMPLETED,
    payload: userTypes
  });
}
