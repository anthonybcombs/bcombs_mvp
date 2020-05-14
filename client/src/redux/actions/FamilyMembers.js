import { call, take, put } from "redux-saga/effects";
import * as actionType from "./Constant";
import graphqlClient from "../../graphql";
import { FAMILY_MEMBER_QUERY } from "../../graphql/query";

const getFamilyMembersFromDatabase = (creds) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.query({
        query: FAMILY_MEMBER_QUERY,
        variables: creds,
      });
      resolve(data.familymembers);
    } catch (error) {
      reject("error");
    }
  });
};
export const requestFamilyMembers = () => {
  return { type: actionType.REQUEST_FAMILY_MEMBERS };
};

export function* gotFamilyMembers() {
  // yield take([actionType.REQUEST_GET_CALENDARS_COMPLETED]);
  const familyMembers = yield call(getFamilyMembersFromDatabase, {
    access_token: sessionStorage.getItem("access_token"),
    token_type: sessionStorage.getItem("token_type"),
  });
  yield put({
    type: actionType.REQUEST_FAMILY_MEMBERS_COMPLETED,
    payload: familyMembers,
  });
  yield put({
    type: actionType.REQUEST_STATUS_COMPLETED,
    payload: {
      messageType: "info",
      message: "got family members",
    },
  });
}
