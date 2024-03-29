import { all, call, take, put } from "redux-saga/effects";
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
import {
  ADD_ARCHIVED_GROUP,
  GET_ARCHIVED_GROUP,
  DELETE_ARCHIVED_GROUP
} from "../../graphql/vendorMutation";

import { setGroupLoading, setGroupMemberLoadingLoading, setArchiveLoading } from "./Loading";

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

const getArchiveGroupFromDatabase = async vendor_id => {
  try {
    const { data } = await graphqlClient.query({
      query: GET_ARCHIVED_GROUP,
      variables: { vendor_id }
    });
    return data.getArchivedGroup;
  } catch (err) {}
};
const addArchiveGroupToDatabase = async archivedGroup => {
  try {
    const { data } = await graphqlClient.query({
      query: ADD_ARCHIVED_GROUP,
      variables: { archivedGroup }
    });
    return data.addArchivedGroup;
  } catch (err) {}
};
const removeGroupFromArchiveToDatabase = async variables => {
  try {
    const { data } = await graphqlClient.query({
      query: DELETE_ARCHIVED_GROUP,
      variables
    });
    return data.removeGroupFromArchive;
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

//Added by Jeff
export const requestArchiveGroup = (vendor_id) => {
  return {
    type: actionType.ARCHIVE_GROUP,
    vendor_id
  }
}
export const requestAddArchiveGroup = (data) => {
  return {
    type: actionType.ADD_ARCHIVE_GROUP,
    data
  }
}
export const requestRemoveGroupFromArchive = (data) => {
  return {
    type: actionType.REMOVE_GROUP_FROM_ARCHIVE,
    data
  }
}
export const clearGroupArchive = () => {
  return {
    type: actionType.CLEAR_GROUP_ARCHIVE
  }
}

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

    console.log("UpdatedGroup", response);
    yield all([
      put(setUserGroups(response)),
      put(requestUserGroup(group.email))
    ]);
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
export function requestUserGroupForProtectedRoute(email) {
  return {
    type: actionType.REQUEST_USER_GROUPS_PROTECTED_ROUTE,
    email
  };
}
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
    console.log("Email getUserGroupToDatabase", email);
    const { data } = await graphqlClient.query({
      query: GET_USER_GROUP_QUERY,
      variables: { email }
    });
    console.log("Data getUserGroupToDatabase", data);
    return data.getUserGroup;
  } catch (err) {
    console.log("Error getUserGroupToDatabase", err);
  }
};
export function* getUserGroupProtectedRoute(action) {
  yield take([actionType.REQUEST_FAMILY_MEMBERS_COMPLETED]);
  try {
    yield put(setGroupLoading(true));
    const response = yield call(getUserGroupToDatabase, action.email);
    yield put(setUserGroups(response || []));
    yield put(setGroupLoading(false));
  } catch (error) {
    yield put(setUserGroups([]));
    yield put(setGroupLoading(false));
  }
}
export function* getUserGroup(action) {
  try {
    yield put(setGroupLoading(true));
    const response = yield call(getUserGroupToDatabase, action.email);
    yield put(setUserGroups(response || []));
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

export function* getArchiveGroup({ vendor_id }) {
  try {
    yield put(setArchiveLoading(true));
    const response = yield call(getArchiveGroupFromDatabase, vendor_id);
    yield put({
      type: actionType.ARCHIVE_GROUP_COMPLETED,
      payload: response
    });
    yield put(setArchiveLoading(false));
  } catch (error) {
    setArchiveLoading(false);
  }
}

export function* addArchiveGroup({ data }) {
  try {
    yield put(setArchiveLoading(true));
    const response = yield call(addArchiveGroupToDatabase, data);
    yield put({
      type: actionType.ADD_ARCHIVE_GROUP_COMPLETED,
      payload: response
    });
    yield put(setArchiveLoading(false));
  } catch (error) {
    setArchiveLoading(false);
  }
}

export function* removeGroupFromArchive({ data }) {
  try {
    yield put(setArchiveLoading(true));
    const response = yield call(removeGroupFromArchiveToDatabase, data);
    yield put({
      type: actionType.REMOVE_GROUP_FROM_ARCHIVE_COMPLETED,
      payload: response
    });
    yield put(setArchiveLoading(false));
  } catch (error) {
    setArchiveLoading(false);
  }
}
