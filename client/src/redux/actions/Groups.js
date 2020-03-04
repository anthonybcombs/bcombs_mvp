import { call, take, put } from "redux-saga/effects";
import * as actionType from "./Constant";
const addGroupToDatabase = ({ group }) => {
  return new Promise((resolve, reject) => {
    return resolve("success");
  });
};
const updateGroupToDatabase = ({ group }) => {
  return new Promise((resolve, reject) => {
    return resolve("success");
  });
};
export const addGroup = group => {
  return {
    type: actionType.REQUEST_ADD_GROUP,
    group
  };
};
export const updateGroup = group => {
  return {
    type: actionType.REQUEST_UPDATE_GROUP,
    group
  };
};
export function* addedGroup({ group }) {
  yield call(addGroupToDatabase, [group]);
  yield put({
    type: actionType.REQUEST_ADD_GROUP_COMPLETED,
    payload: group
  });
}
export function* updatedGroup({ group }) {
  yield call(updateGroupToDatabase, [group]);
  yield put({
    type: actionType.REQUEST_UPDATE_GROUP_COMPLETED,
    payload: group
  });
}
