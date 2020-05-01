import { call, take, put } from "redux-saga/effects";
import * as actionType from "./Constant";

import graphqlClient from "../../graphql";

import {
  GROUP_UPDATE_MUTATION,
  GROUP_DELETE_MUTATION
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
  yield call(addGroupToDatabase, group);
  yield put({
    type: actionType.REQUEST_ADD_GROUP_COMPLETED,
    payload: group
  });
}

export function* updatedGroup({ group }) {
  try {
    console.log("response updatedGroup", group);
    const response = yield call(updateGroupToDatabase, group);
    console.log("response", response);
    yield put(requestUserGroup({ email: group.email }));
  } catch (err) {
    console.log("Error", err);
  }

  // yield put({
  //   type: actionType.REQUEST_UPDATE_GROUP_COMPLETED,
  //   payload: group
  // });
}

// ADDED BY DENNIS

export function requestUserGroup(data) {
  return {
    type: actionType.REQUEST_USER_GROUPS,
    data
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

const addGroupToDatabase = data => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${process.env.API_HOST}/api/groups`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      const responseData = await response.json();
      return resolve(responseData);
    } catch (error) {
      reject("error");
    }
  });
};

const getUserGroupToDatabase = data => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${process.env.API_HOST}/api/usergroups`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });
      const responseData = await response.json();

      return resolve(responseData);
    } catch (error) {
      reject("error");
    }
  });
};

export function* getUserGroup(action) {
  try {
    const response = yield call(getUserGroupToDatabase, action.data);

    yield put(setUserGroups(response.data));
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
