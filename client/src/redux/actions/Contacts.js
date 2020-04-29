import { call, take, put } from "redux-saga/effects";
import * as actionType from "./Constant";
const addContactToDatabase = contact => {
  return new Promise(async (resolve, reject) => {
    try {
      const addContactRequest = await fetch(
        `${process.env.API_HOST}/api/contact`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json"
          },
          body: JSON.stringify(contact)
        }
      );
      const addContactResponse = await addContactRequest.json();

      return resolve(addContactResponse);
    } catch (error) {
      reject("error");
    }
  });
};
const updateContactToDatabase = ({ group }) => {
  return new Promise((resolve, reject) => {
    return resolve("success");
  });
};
const removeContactToDatabase = ({ group }) => {
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
      relation: contact.relation,
      userEmail: contact.userEmail,
      selectedGroups: contact.selectedGroups
    }
  };
};
export const updateContact = contact => {
  return {
    type: actionType.REQUEST_UPDATE_CONTACT,
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
export const removeContact = contact => {
  return {
    type: actionType.REQUEST_REMOVE_CONTACT,
    contact: { id: contact.id }
  };
};
export function* addedContact({ contact }) {
  console.log("addedContact", contact);
  yield call(addContactToDatabase, contact);
  yield put({
    type: actionType.REQUEST_ADD_CONTACT_COMPLETED,
    payload: contact
  });
}
export function* updatedContact({ contact }) {
  yield call(updateContactToDatabase, [contact]);
  yield put({
    type: actionType.REQUEST_UPDATE_CONTACT_COMPLETED,
    payload: contact
  });
}
export function* removedContact({ contact }) {
  yield call(removeContactToDatabase, [contact]);
  yield put({
    type: actionType.REQUEST_REMOVE_CONTACT_COMPLETED,
    payload: contact
  });
}
