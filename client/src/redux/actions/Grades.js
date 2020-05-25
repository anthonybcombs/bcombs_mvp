import { call, take, put } from "redux-saga/effects";
import graphqlClient from "../../graphql";
import { GRADES_QUERY } from "../../graphql/query";
import * as actionType from "./Constant";

const getGradesFromDatabase = async () => {
  const { data } = await graphqlClient.query({
    query: GRADES_QUERY,
    variables: {},
  });
  return data.grades;
};
export const requestGrades = () => {
  return {
    type: actionType.REQUEST_GRADES,
  };
};

export function* getGrades() {
  const grades = yield call(getGradesFromDatabase);

  yield put({
    type: actionType.REQUEST_GRADES_COMPLETED,
    payload: grades,
  });
}
