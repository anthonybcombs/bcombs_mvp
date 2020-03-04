import { call, take, put } from "redux-saga/effects";
import * as actionType from "./Constant";
const addContactToDatabase = ({ group }) => {
  return new Promise((resolve, reject) => {
    return resolve("success");
  });
};
export const addContact = contact => {
  return {
    type: actionType.REQUEST_ADD_CONTACT,
    contact: {
      id: contact.id,
      userIds: contact.userIds,
      firstName: contact.firstName,
      lastName: contact.lastName,
      phoneNumber: contact.phoneNumber,
      email: contact.email,
      relation: contact.relation
    }
  };
};

export function* addedContact({ contact }) {
  yield call(addContactToDatabase, [contact]);
  yield put({
    type: actionType.REQUEST_ADD_CONTACT_COMPLETED,
    payload: contact
  });
}
