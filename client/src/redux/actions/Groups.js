import { call, take, put } from "redux-saga/effects";
import * as actionType from "./Constant";

import graphqlClient from "../../graphql";

import {
  GET_USER_GROUP_QUERY,
  GET_GROUP_MEMBERS_QUERY
} from "../../graphql/groupQuery";
import {
  GROUP_UPDATE_MUTATION,
  GROUP_DELETE_MUTATION,
  GROUP_CREATE_MUTATION
} from "../../graphql/groupMutation";

import { setGroupLoading, setGroupMemberLoadingLoading } from "./Loading";

// const addGroupToDatabase = ({ group }) => {
//   return new Promise((resolve, reject) => {
//     return resolve("success");
//   });
// };
const updateGroupToDatabase = async group => {
  try {
    const { data } = await graphqlClient.mutate({
      mutation: GROUP_UPDATE_MUTATION,
      variables: {
        group: {
          id: group.id,
          name: group.name,
          member_ids: group.member_ids,
          email: group.email,
          removed_member_ids: group.removed_member_ids
        }
      }
    });
    console.log("UpdateGroupToDatabase", data);
    return data.updateGroup;
  } catch (error) {
    console.log("Error updateGroupToDatabase", error);
  }
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

const getMembersToDatabase = async id => {
  try {
    console.log("getMemberToDatabase id", id);
    const { data } = await graphqlClient.query({
      query: GET_GROUP_MEMBERS_QUERY,
      variables: { id }
    });

    console.log("getMemberToDatabase data", data);
    return data.getGroupMembers;
  } catch (err) {}
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
    yield put(setGroupLoading(true));
    const response = yield call(updateGroupToDatabase, group);
    yield put(setUserGroups(response));
    yield put(requestUserGroup(group.email));
    yield put(setGroupLoading(false));
  } catch (err) {
    console.log("updatedGroup Error", err);
    yield put(setGroupLoading(false));
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

export function requestMembers(id) {
  return {
    type: actionType.REQUEST_MEMBERS,
    id
  };
}
export function setMemberList(data) {
  return {
    type: actionType.SET_MEMBER_LIST,
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
    yield put(setGroupLoading(true));
    const response = yield call(getUserGroupToDatabase, action.email);
    yield put(setUserGroups(response));
    yield put(setGroupLoading(false));
  } catch (error) {
    yield put(setUserGroups([]));
    yield put(setGroupLoading(false));
  }
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

export function* getMembers(action) {
  try {
    yield put(setGroupMemberLoadingLoading(true));
    const response = yield call(getMembersToDatabase, action.id);

    yield put(setMemberList(response));
    yield put(setGroupMemberLoadingLoading(false));
  } catch (error) {
    console.log("getMembers error", error);
    yield put(setMemberList([]));
    setGroupMemberLoadingLoading(false);
  }
}
