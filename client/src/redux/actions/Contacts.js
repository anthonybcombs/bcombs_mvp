import { call, take, put } from "redux-saga/effects";
import * as actionType from "./Constant";
import graphqlClient from "../../graphql";

import { GET_CONTACT_QUERY } from "../../graphql/contactQuery";
import {
  CONTACT_CREATE_MUTATION,
  DELETE_CONTACT_MUTATION,
  UPDATE_CONTACT_MUTATION
} from "../../graphql/contactMutation";

// REDUX ACTIONS
import { requestUserGroup } from "./Groups";

const addContactToDatabase = async payload => {
  try {
    console.log("addContactToDatabase payload", payload);
    const { data } = await graphqlClient.mutate({
      mutation: CONTACT_CREATE_MUTATION,
      variables: {
        contact: {
          ...payload
        }
      }
    });
    return data.createContact;
  } catch (error) {
    console.log("addContactDatabase error", error);
  }
};
const updateContactToDatabase = async contact => {
  try {
    console.log("updateContactToDatabase contact", contact);
    const { data } = await graphqlClient.mutate({
      mutation: UPDATE_CONTACT_MUTATION,
      variables: {
        contact: {
          ...contact
        }
      }
    });
    console.log("updateContactToDatabase edit contact", data.updateContact);
    return data.updateContact;
  } catch (error) {
    console.log("updateContactToDatabase error", error);
  }
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

const getContactToDatabase = email => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.mutate({
        mutation: GET_CONTACT_QUERY,
        variables: {
          email
        }
      });
      console.log("GetContactDatabase", data);
      return resolve(data.getContact);
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
      first_name: contact.first_name,
      last_name: contact.last_name,
      phone_number: contact.phone_number,
      email: contact.email,
      relation: contact.relation,
      selected_groups: contact.selectedGroups,
      removed_groups: [],
      auth_email: contact.authEmail
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
      relation: contact.relation,
      selected_groups: contact.selectedGroups,
      removed_groups: contact.removedGroups
    }
  };
};
export const removeContact = contact => {
  return {
    type: actionType.REQUEST_REMOVE_CONTACT,
    contact: { id: contact.id }
  };
};

export const getContact = email => {
  return {
    type: actionType.REQUEST_USER_CONTACT,
    email
  };
};

export const setContact = data => {
  return {
    type: actionType.SET_USER_CONTACT_LIST,
    data
  };
};

export function* addedContact({ contact }) {
  try {
    const response = yield call(addContactToDatabase, contact);
    console.log("responseeee", response);
    console.log("responseeee contact", contact);
    if (response) {
      // yield all([
      //   put(getContact(contact.auth_email)),
      //   put({
      //     type: actionType.SET_USER_CONTACT_LIST,
      //     payload: response
      //   })
      // ]);

      yield put(getContact(contact.auth_email));
      yield put(requestUserGroup(contact.auth_email));
    }
  } catch (err) {
    yield put({
      type: actionType.SET_USER_CONTACT_LIST,
      payload: []
    });
  }

  // yield put({
  //   type: actionType.REQUEST_ADD_CONTACT_COMPLETED,
  //   payload: contact
  // });
}
export function* updatedContact({ contact }) {
  try {
    const response = yield call(updateContactToDatabase, contact);

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
    const response = yield call(getContactToDatabase, action.email);

    if (response) {
      yield put({
        type: actionType.SET_USER_CONTACT_LIST,
        payload: response
      });
    }
  } catch (err) {
    console.log("error", err);
    yield put({
      type: actionType.SET_USER_CONTACT_LIST,
      payload: []
    });
  }
}
