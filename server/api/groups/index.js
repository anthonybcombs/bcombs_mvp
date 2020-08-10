import { makeDb } from "../../helpers/database";
import { getUserFromDatabase } from "../index";

import { getVendorAppGroups } from "../vendor/index";
import { s3BucketRootPath } from "../../helpers/aws";

export const getGroup = async () => {
  const db = makeDb();
  let result;
  try {
    const rows = await db.query(
      "SELECT BIN_TO_UUID(id) as id,name,visibility  from `groups`"
    );

    result = rows;
  } catch (error) {
  } finally {
    await db.close();
    return result;
  }
};

export const getUserGroups = async email => {
  const db = makeDb();
  let joinedResult = [];
  let createdResult = [];
  let applicationGroups = [];

  try {
    const currentUser = await getUserFromDatabase(email);

    const joinedGroups = await db.query(
      "SELECT BIN_TO_UUID(gr.id) as id,gr.name,gr.visibility,BIN_TO_UUID(gr.user_id) as user_id from `groups` as gr,group_members WHERE group_members.user_id=UUID_TO_BIN(?) AND gr.id=group_members.group_id AND group_members.user_id!=gr.user_id;",
      [currentUser.id]
    );
    const createdGroups = await db.query(
      "SELECT BIN_TO_UUID(id) as id,name,visibility from `groups` WHERE user_id=UUID_TO_BIN(?)",
      [currentUser.id]
    );

    applicationGroups = await getVendorAppGroups(currentUser.id);

    joinedResult = await formattedGroups(joinedGroups, db);
    createdResult = await formattedGroups(createdGroups, db);
  } catch (error) {
    console.log("error", error);
  } finally {
    await db.close();
    return {
      created_groups: createdResult,
      joined_groups: joinedResult,
      application_groups: applicationGroups
    };
  }
};

export const editGroups = async data => {
  const db = makeDb();
  let result = null;
  try {
    const { id, name, member_ids, removed_member_ids, email } = data;

    const currentUser = await getUserFromDatabase(email);

    await db.query("UPDATE `groups` SET name=? WHERE id=UUID_TO_BIN(?)", [
      name,
      id
    ]);

    if (member_ids.length > 0) {
      let groupMemberValuesQuery = member_ids.reduce(
        (accumulator, memberId) => {
          accumulator += `(UUID_TO_BIN('${id}'),UUID_TO_BIN('${memberId}')),`;
          return accumulator;
        },
        ""
      );

      groupMemberValuesQuery = groupMemberValuesQuery.substring(
        0,
        groupMemberValuesQuery.length - 1
      );

      await db.query(
        "INSERT IGNORE INTO group_members(group_id,user_id) VALUES " +
          groupMemberValuesQuery
      );
    }

    if (removed_member_ids.length > 0) {
      let groupValuesQuery = removed_member_ids.map(currentItem => {
        return `(UUID_TO_BIN('${id}'),UUID_TO_BIN('${currentItem}'))`;
      });
      groupValuesQuery = groupValuesQuery.join(",");
      await db.query(
        "DELETE FROM group_members  WHERE (group_id, user_id) IN (" +
          groupValuesQuery +
          ")"
      );
    }
    result = await getUserGroups(email);
  } catch (error) {
    console.log("Error", error);
  } finally {
    await db.close();
    return result;
  }
};

export const removeGroup = async (id, email) => {
  const db = makeDb();
  let result = [];
  try {
    const currentUser = await getUserFromDatabase(email);
    if (currentUser) {
      await db.query(
        "DELETE FROM `groups` WHERE id=UUID_TO_BIN(?) AND user_id=UUID_TO_BIN(?)",
        [id, currentUser.id]
      );
      await db.query(
        "DELETE FROM group_members WHERE group_id=UUID_TO_BIN(?)",
        [id]
      );
      result = await getUserGroups(email);
    }
  } catch (error) {
    console.log("Error", error);
  } finally {
    await db.close();
    return result;
  }
};

export const createNewGroup = async ({
  id,
  name,
  visibility,
  email,
  member_ids = []
}) => {
  const db = makeDb();
  let result = {};
  try {
    const currentUser = await getUserFromDatabase(email);
    await db.query(
      "INSERT INTO `groups`( id,name, visibility,user_id) VALUES (UUID_TO_BIN(?),?,?,UUID_TO_BIN(?))",
      [id, name, visibility || "Public", currentUser.id]
    );

    if (member_ids.length > 0 && member_ids[0] !== null) {
      let groupMemberValuesQuery = member_ids.reduce(
        (accumulator, memberId) => {
          accumulator += `(UUID_TO_BIN(${id}),UUID_TO_BIN(${memberId})),`;
          return accumulator;
        },
        ""
      );

      groupMemberValuesQuery = groupMemberValuesQuery.substring(
        0,
        groupMemberValuesQuery.length - 1
      );

      await db.query(
        "INSERT IGNORE INTO group_members(group_id,user_id) VALUES " +
          groupMemberValuesQuery
      );
    }

    result = await getUserGroups(email);
  } catch (error) {
    console.log("error", error);
  } finally {
    await db.close();
    return result;
  }
};

export const getMembers = async id => {
  const db = makeDb();
  let contacts = [];
  try {
    let userIds = await db.query(
      "SELECT BIN_TO_UUID(user_id) as user_id FROM group_members WHERE group_id=UUID_TO_BIN(?)",
      [id]
    );

    userIds =
      userIds && userIds.length > 0 ? JSON.parse(JSON.stringify(userIds)) : [];

    userIds = userIds.map(item => `UUID_TO_BIN('${item.user_id}')`);
    if (userIds.length > 0) {
      contacts = await db.query(
        `SELECT user_profiles.first_name,
        user_profiles.last_name,
        BIN_TO_UUID(user_profiles.user_id) as user_id,
        users.email ,
        users.profile_img
        FROM user_profiles INNER JOIN users
        ON user_profiles.user_id = users.id  
        WHERE users.id IN (${userIds.join(",")}) `
      );

      let formattedContacts = contacts.map(contact => {
        return {
          ...contact,
          profile_img: `${s3BucketRootPath}${
            !contact.profile_img || contact.profile_img === ""
              ? "user/default_user.png"
              : contact.profile_img
          }`
        };
      });

      contacts = JSON.parse(JSON.stringify(formattedContacts));
    }

    return contacts;
  } catch (err) {
    console.log("Error", err);
  } finally {
    await db.close();
  }
};

export const getMemberByMultipleGroupId = async ids => {
  const db = makeDb();
  let results = [];
  try {
    let formattedIds = ids.map(id => `UUID_TO_BIN('${id}')`);

    if (formattedIds.length > 0) {
      let users = await db.query(
        `SELECT BIN_TO_UUID(group_members.user_id) as id
          FROM group_members,users
          WHERE group_members.group_id IN (${formattedIds.join(
            ","
          )}) AND users.id=group_members.user_id`
      );
      results = users && users.length > 0 ? users.map(item => item.id) : [];
      console.log("getMemberByMultipleGroupId results", results);
    }
  } catch (err) {
    console.log("getMemberByMultipleGroupId Error", err);
  } finally {
    await db.close();
    return results;
  }
};

const formattedGroups = async (rows, db) => {
  rows = JSON.parse(JSON.stringify(rows));
  const rowIds = rows.map(item => `UUID_TO_BIN('${item.id}')`);

  let members =
    rowIds && rowIds.length > 0
      ? await db.query(
          "SELECT BIN_TO_UUID(group_id) as group_id,BIN_TO_UUID(user_id) as user_id from group_members  WHERE group_id IN (" +
            rowIds.join(",") +
            ")"
        )
      : [];
  members = JSON.parse(JSON.stringify(members));
  const formattedRows = rows.map(item => {
    const groupMembers = members
      .filter(member => member.group_id === item.id)
      .map(subItem => subItem.user_id);

    return {
      ...item,
      contacts: [...(groupMembers || [])]
    };
  });
  return formattedRows;
};
