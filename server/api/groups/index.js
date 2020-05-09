import { makeDb } from "../../helpers/database";
import { getUserFromDatabase } from "../index";

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
  try {
    const currentUser = await getUserFromDatabase(email);

    const joinedGroups = await db.query(
      "SELECT BIN_TO_UUID(gr.id) as id,gr.name,gr.visibility,BIN_TO_UUID(gr.user_id) as user_id from `groups` as gr,group_members WHERE group_members.user_id=UUID_TO_BIN(?) AND gr.id=group_members.group_id AND group_members.user_id!=gr.user_id;",
      [currentUser.id]
    );
    const createdGroups = await db.query(
      "SELECT BIN_TO_UUID(id) as `id`,name,visibility from `groups` WHERE user_id=UUID_TO_BIN(?)",
      [currentUser.id]
    );

    joinedResult = await formattedGroups(joinedGroups, db);
    createdResult = await formattedGroups(createdGroups, db);
  } catch (error) {
    console.log("error", error);
  } finally {
    await db.close();
    return {
      created_groups: createdResult,
      joined_groups: joinedResult
    };
  }
};

export const editGroups = async data => {
  const db = makeDb();
  let result = null;
  try {
    const { id, name, member_ids, email } = data;

    const currentUser = await getUserFromDatabase(email);

    await db.query("UPDATE `groups` SET name=? WHERE id=UUID_TO_BIN(?)", [
      name,
      id
    ]);

    if (member_ids.length > 0) {
      let groupMemberValuesQuery = member_ids.reduce(
        (accumulator, memberId) => {
          accumulator += `(UUID_TO_BIN("${id}"),UUID_TO_BIN("${memberId}")),`;
          return accumulator;
        },
        ""
      );

      groupMemberValuesQuery = groupMemberValuesQuery.substring(
        0,
        groupMemberValuesQuery.length - 1
      );

      await db.query(
        "INSERT IGNORE INTO `group_members`(`group_id`,`user_id`) VALUES " +
          groupMemberValuesQuery
      );
    }
    result = await getUserGroups(email);
    // if (currentUser) {
    //   let rows = await db.query(
    //     "SELECT BIN_TO_UUID(id) as id,name,visibility  from `groups` WHERE user_id=UUID_TO_BIN(?)",
    //     [currentUser.id]
    //   );

    //   rows = JSON.parse(JSON.stringify(rows));

    //   const rowIds = rows.map(item => `UUID_TO_BIN('${item.id}')`);

    //   let members =
    //     rowIds && rowIds.length > 0
    //       ? await db.query(
    //           "SELECT BIN_TO_UUID(group_id) as `group_id`,BIN_TO_UUID(user_id) as `user_id` from `group_members` WHERE `group_id` IN (" +
    //             rowIds.join(",") +
    //             ")"
    //         )
    //       : [];
    //   members = JSON.parse(JSON.stringify(members));

    //   result = rows.map(item => {
    //     const groupMembers = members
    //       .filter(member => member.group_id === item.id)
    //       .map(subItem => subItem.user_id);

    //     return {
    //       ...item,
    //       contacts: [...(groupMembers || [])]
    //     };
    //   });
    // }
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
      // result = await db.query(
      //   "SELECT BIN_TO_UUID(id) as id,name,visibility  from `groups` WHERE user_id=UUID_TO_BIN(?)",
      //   [currentUser.id]
      // );
      // result = JSON.parse(JSON.stringify(result));

      // const rowIds = result.map(item => `UUID_TO_BIN('${item.id}')`);

      // let members =
      //   rowIds && rowIds.length > 0
      //     ? await db.query(
      //         "SELECT BIN_TO_UUID(group_id) as `group_id`,BIN_TO_UUID(user_id) as `user_id` from `group_members` WHERE `group_id` IN (" +
      //           rowIds.join(",") +
      //           ")"
      //       )
      //     : [];
      // members = JSON.parse(JSON.stringify(members));

      // result = result.map(item => {
      //   const groupMembers = members
      //     .filter(member => member.group_id === item.id)
      //     .map(subItem => subItem.user_id);

      //   return {
      //     ...item,
      //     contacts: [...(groupMembers || [])]
      //   };
      // });
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
      "INSERT INTO `groups`( `id`,`name`, `visibility`,`user_id`) VALUES (UUID_TO_BIN(?),?,?,UUID_TO_BIN(?))",
      [id, name, visibility || "Public", currentUser.id]
    );

    if (member_ids.length > 0) {
      let groupMemberValuesQuery = member_ids.reduce(
        (accumulator, memberId) => {
          accumulator += `(UUID_TO_BIN("${id}"),UUID_TO_BIN("${memberId}")),`;
          return accumulator;
        },
        ""
      );

      groupMemberValuesQuery = groupMemberValuesQuery.substring(
        0,
        groupMemberValuesQuery.length - 1
      );

      await db.query(
        "INSERT IGNORE INTO `group_members`(`group_id`,`user_id`) VALUES " +
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

    userIds = userIds.map(item => `UUID_TO_BIN("${item.user_id}")`);

    contacts = await db.query(
      `SELECT user_profiles.first_name,
      user_profiles.last_name,
      BIN_TO_UUID(user_profiles.user_id) as user_id,
      users.email 
      FROM user_profiles INNER JOIN users
      ON user_profiles.user_id = users.id  
      WHERE users.id IN (${userIds.join(",")}) `
    );
    contacts = JSON.parse(JSON.stringify(contacts));
  } catch (err) {
    console.log("Error", err);
  } finally {
    await db.close();
    return contacts;
  }
};

const formattedGroups = async (rows, db) => {
  rows = JSON.parse(JSON.stringify(rows));
  const rowIds = rows.map(item => `UUID_TO_BIN("${item.id}")`);

  let members =
    rowIds && rowIds.length > 0
      ? await db.query(
          "SELECT BIN_TO_UUID(group_id) as `group_id`,BIN_TO_UUID(user_id) as `user_id` from `group_members`  WHERE `group_id` IN (" +
            rowIds.join(",") +
            ")"
        )
      : [];
  members = JSON.parse(JSON.stringify(members));
  //console.log("MEMBERS1 ", members);
  // let memberIds = members.map(item => `UUID_TO_BIN(${item.user_id})`);

  // let contacts = await db.query(
  //   `SELECT contacts.firstname as contact_firstname,
  //   contacts.lastname as contact_lastname,
  //     BIN_TO_UUID(contacts.user_id) as contact_user_id,
  //     contacts.email as email,
  //     user_profiles.last_name as profile_lastname,
  //     user_profiles.first_name as  profile_first_name

  //     FROM contacts, user_profiles WHERE contacts.user_id IN ( ${memberIds.join(
  //       ","
  //     )} OR user_profiles.user_id IN ( ${memberIds.join(",")}
  //     ) GROUP BY contacts.user_id,user_profiles.user_id`
  // );

  // console.log("Contactssssssss", contacts);
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
