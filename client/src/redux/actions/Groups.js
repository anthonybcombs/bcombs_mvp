import { call, take, put } from "redux-saga/effects";
import * as actionType from "./Constant";

import graphqlClient from "../../graphql";

import { GROUP_UPDATE_MUTATION } from "../../graphql/groupMutation";

// const addGroupToDatabase = ({ group }) => {
//   return new Promise((resolve, reject) => {
//     return resolve("success");
//   });
// };
const updateGroupToDatabase = ({ group }) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log("groupppppppppppppp", group);
      const { data } = await graphqlClient.mutate({
        mutation: GROUP_UPDATE_MUTATION,
        variables: {
          group: {
            ...group[0]
          }
        }
      });

      return resolve(data.updateContact);
    } catch (error) {
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
  console.log("grouppp action", group);
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
  yield call(updateGroupToDatabase, [group]);
  yield put({
    type: actionType.REQUEST_UPDATE_GROUP_COMPLETED,
    payload: group
  });
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
