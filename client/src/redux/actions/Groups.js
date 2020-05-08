import { call, take, put } from "redux-saga/effects";
import * as actionType from "./Constant";

import graphqlClient from "../../graphql";

import { GET_USER_GROUP_QUERY } from "../../graphql/groupQuery";
import {
  GROUP_UPDATE_MUTATION,
  GROUP_DELETE_MUTATION,
  GROUP_CREATE_MUTATION
} from "../../graphql/groupMutation";

// const addGroupToDatabase = ({ group }) => {
//   return new Promise((resolve, reject) => {
//     return resolve("success");
//   });
// };
const updateGroupToDatabase = group => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.mutate({
        mutation: GROUP_UPDATE_MUTATION,
        variables: {
          group: {
            id: group.id,
            name: group.name,
            member_ids: group.member_ids,
            email: group.email
          }
        }
      });

      return resolve(data.updateGroup);
    } catch (error) {
      console.log("Error", error);
      reject("error");
    }
  });
};

const removeGroupToDatabase = group => {
  return new Promise(async (resolve, reject) => {
    try {
      const { data } = await graphqlClient.mutate({
        mutation: GROUP_DELETE_MUTATION,
        variables: {
          id: group.id,
          email: group.email
        }
      });
      return resolve(data.deleteGroup);
    } catch (error) {
      console.log("removeGroupToDatabase", error);
      reject("error");
    }
  });
};

export const addGroup = group => {
  return {
    type: actionType.REQUEST_ADD_GROUP,
    group
  };
};
export const updateGroup = group => {
  console.log("UpdateGroup", group);
  return {
    type: actionType.REQUEST_UPDATE_GROUP,
    group
  };
};
export function* addedGroup({ group }) {
  try {
    const response = yield call(addGroupToDatabase, group);
    yield put(setUserGroups(response));
  } catch (err) {}
}

export function* updatedGroup({ group }) {
  try {
    console.log("response updatedGroup", group);
    const response = yield call(updateGroupToDatabase, group);
    console.log("response", response);

    yield put(setUserGroups(response));
    //yield put(requestUserGroup({ email: group.email }));
  } catch (err) {
    console.log("Error", err);
  }

  // yield put({
  //   type: actionType.REQUEST_UPDATE_GROUP_COMPLETED,
  //   payload: group
  // });
}

// ADDED BY DENNIS

export function requestUserGroup(email) {
  return {
    type: actionType.REQUEST_USER_GROUPS,
    email
  };
}
export function requestUserMemberGroup(id) {
  return {
    type: actionType.REQUEST_USER_GROUPS,
    email
  };
}

export function setUserGroups(data) {
  return {
    type: actionType.SET_USER_GROUPS,
    data
  };
}

export function requestDeleteGroup(data) {
  return {
    type: actionType.REQUEST_DELETE_GROUP,
    data
  };
}

const addGroupToDatabase = async group => {
  try {
    console.log("Groupppp", group);
    const { data } = await graphqlClient.mutate({
      mutation: GROUP_CREATE_MUTATION,
      variables: {
        group: {
          id: group.id,
          name: group.name,
          visibility: `${group.visibility}`,
          member_ids: group.contacts,
          email: group.email
        }
      }
    });
    return data.createGroup;
  } catch (error) {
    console.log("addGroupToDatabase", error);
    return null;
  }
};

const getUserGroupToDatabase = async email => {
  try {
    const { data } = await graphqlClient.query({
      query: GET_USER_GROUP_QUERY,
      variables: { email }
    });
    return data.getUserGroup;
  } catch (err) {
    console.log("Error", err);
  }
};

export function* getUserGroup(action) {
  try {
    console.log("Get User Groupppp", action.data);
    const response = yield call(getUserGroupToDatabase, action.email);
    console.log("Get User Groupppp", response);
    yield put(setUserGroups(response));
  } catch (error) {}
}

export function* removeGroup(action) {
  try {
    const response = yield call(removeGroupToDatabase, action.data);
    console.log("Remove Grpup", response);
    yield put(setUserGroups(response));
  } catch (error) {
    yield put(setUserGroups([]));
  }
}
