import { call, take, put } from "redux-saga/effects";
import randomColor from "randomcolor";
import * as actionType from "./Constant";
const addCalendarInDatabase = ({ creds, info }) => {
  return new Promise((resolve, reject) => {
    return resolve("success");
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
  yield call(addCalendarInDatabase, {
    creds: {
      access_token: sessionStorage.getItem("access_token"),
      token_type: sessionStorage.getItem("token_type"),
    },
    info: { name, familyMembers },
  });
  yield put({
    type: actionType.REQUEST_ADD_CALENDAR_COMPLETED,
    payload: {
      id: Math.random(),
      userid: 1,
      name,
      familyMembers: Array.from(familyMembers.keys()),
      image: "https://picsum.photos/200",
      color: randomColor(),
    },
  });
}
