import { call, take, put } from "redux-saga/effects";
import randomColor from "randomcolor";
import * as actionType from "./Constant";
import graphqlClient from "../../graphql";
import { CREATE_CALENDAR_MUTATION } from "../../graphql/mutation";
const addCalendarInDatabase = ({ creds, info }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.mutate({
        mutation: CREATE_CALENDAR_MUTATION,
        variables: { calendar: { creds, info } },
      });
      resolve(data.createCalendar.info);
    } catch (error) {
      reject("error");
    }
  });
};
export const requestAddCalendar = (details) => {
  return {
    type: actionType.REQUEST_ADD_CALENDAR,
    name: details.name,
    familyMembers: details.selectedFamilyMembers,
  };
};

export function* addCalendar({ name, familyMembers }) {
  const calendar = yield call(addCalendarInDatabase, {
    creds: {
      access_token: sessionStorage.getItem("access_token"),
      token_type: sessionStorage.getItem("token_type"),
    },
    info: { name, familyMembers: Array.from(familyMembers.keys()) },
  });
  yield put({
    type: actionType.REQUEST_ADD_CALENDAR_COMPLETED,
    payload: {
      id: calendar.id,
      userid: calendar.user_id,
      name,
      familyMembers: Array.from(familyMembers.keys()),
      image: "https://picsum.photos/200",
      color: randomColor(),
    },
  });
}
