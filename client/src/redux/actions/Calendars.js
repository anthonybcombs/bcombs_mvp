import { call, take, put } from "redux-saga/effects";
import randomColor from "randomcolor";
import * as actionType from "./Constant";
const addCalendarInDatabase = () => {
  return new Promise((resolve, reject) => {
    return resolve("success");
  });
};
export const requestAddCalendar = details => {
  return {
    type: actionType.REQUEST_ADD_CALENDAR,
    name: details.name,
    familyMembers: details.selectedFamilyMembers
  };
};

export function* addCalendar({ name, familyMembers }) {
  yield call(addCalendarInDatabase, { name, familyMembers });
  yield put({
    type: actionType.REQUEST_ADD_CALENDAR_COMPLETED,
    payload: {
      id: Math.random(),
      userid: 1,
      name,
      familyMembers: Array.from(familyMembers.keys()),
      image: "https://picsum.photos/200",
      color: randomColor()
    }
  });
}
