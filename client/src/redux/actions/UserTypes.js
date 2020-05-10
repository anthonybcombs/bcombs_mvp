import { call, take, put } from "redux-saga/effects";
import graphqlClient from "../../graphql";
import { USER_TYPES_QUERY } from "../../graphql/query";
import * as actionType from "./Constant";
const getUserTypesFromDatabase = async () => {
  const { data } = await graphqlClient.query({
    query: USER_TYPES_QUERY,
    variables: {},
  });
  return data.userTypes;
};
export const requestUserTypes = () => {
  return {
    type: actionType.REQUEST_USER_TYPES,
  };
};

export function* gotUserTypes() {
  const userTypes = yield call(getUserTypesFromDatabase);

  yield put({
    type: actionType.REQUEST_USER_TYPES_COMPLETED,
    payload: userTypes,
  });
  yield put({
    type: actionType.REQUEST_STATUS_COMPLETED,
    payload: {
      messageType: "",
      message: "",
    },
  });
}
