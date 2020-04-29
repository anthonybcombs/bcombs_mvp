import { call, take, put } from "redux-saga/effects";
import * as actionType from "./Constant";
import graphqlClient from "../../graphql";

import { GET_CONTACT_QUERY } from "../../graphql/contactQuery";
import {
  DELETE_CONTACT_MUTATION,
  UPDATE_CONTACT_MUTATION
} from "../../graphql/contactMutation";

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
const updateContactToDatabase = contact => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.mutate({
        mutation: UPDATE_CONTACT_MUTATION,
        variables: {
          contact: {
            ...contact[0]
          }
        }
      });

      return resolve(data.updateContact);
    } catch (error) {
      reject("error");
    }
  });
};
const removeContactToDatabase = contact => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.mutate({
        mutation: DELETE_CONTACT_MUTATION,
        variables: {
          id: contact[0].id
        }
      });
      return resolve(data.deleteContacts);
    } catch (error) {
      reject("error");
    }
  });
};

const getContactToDatabase = userId => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.mutate({
        mutation: GET_CONTACT_QUERY
      });
      return resolve(data.contacts);
    } catch (error) {
      reject("error");
    }
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
      first_name: contact.first_name,
      last_name: contact.last_name,
      phone_number: contact.phone_number,
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

export const getContact = userId => {
  return {
    type: actionType.REQUEST_USER_CONTACT,
    userId
  };
};

export const setContact = data => {
  return {
    type: actionType.SET_USER_CONTACT_LIST,
    data
  };
};

export function* addedContact({ contact }) {
  yield call(addContactToDatabase, contact);
  yield put({
    type: actionType.REQUEST_ADD_CONTACT_COMPLETED,
    payload: contact
  });
}
export function* updatedContact({ contact }) {
  try {
    const response = yield call(updateContactToDatabase, [contact]);
    console.log("Update Contact", response);
    yield put({
      type: actionType.SET_USER_CONTACT_LIST,
      payload: response
    });
  } catch (err) {}
}
export function* removedContact({ contact }) {
  try {
    const response = yield call(removeContactToDatabase, [contact]);
    yield put({
      type: actionType.SET_USER_CONTACT_LIST,
      payload: response
    });
  } catch (err) {
    console.log("Error", err);
  }

  // yield put({
  //   type: actionType.REQUEST_REMOVE_CONTACT_COMPLETED,
  //   payload: contact
  // });
}

export function* getUserContact(action) {
  try {
    const response = yield call(getContactToDatabase, action.userId);
    if (response) {
      yield put({
        type: actionType.SET_USER_CONTACT_LIST,
        payload: response
      });
    }
  } catch (err) {
    yield put({
      type: actionType.SET_USER_CONTACT_LIST,
      payload: []
    });
  }
}
