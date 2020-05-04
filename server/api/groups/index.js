import { makeDb } from "../../helpers/database";
import { getUserFromDatabase } from "../index";

export const getGroups = async () => {
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

export const editGroups = async data => {
  const db = makeDb();
  let result = null;
  try {
    const { id, name, member_ids, email } = data;
    console.log("data", data);
    const currentUser = await getUserFromDatabase(email);
    console.log("data currentUser", currentUser);
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

    if (currentUser) {
      let rows = await db.query(
        "SELECT BIN_TO_UUID(id) as id,name,visibility  from `groups` WHERE user_id=UUID_TO_BIN(?)",
        [currentUser.id]
      );

      rows = JSON.parse(JSON.stringify(rows));

      const rowIds = rows.map(item => `UUID_TO_BIN('${item.id}')`);

      let members =
        rowIds && rowIds.length > 0
          ? await db.query(
              "SELECT BIN_TO_UUID(group_id) as `group_id`,BIN_TO_UUID(user_id) as `user_id` from `group_members` WHERE `group_id` IN (" +
                rowIds.join(",") +
                ")"
            )
          : [];
      members = JSON.parse(JSON.stringify(members));

      result = rows.map(item => {
        const groupMembers = members
          .filter(member => member.group_id === item.id)
          .map(subItem => subItem.user_id);

        return {
          ...item,
          contacts: [...(groupMembers || [])]
        };
      });
    }
  } catch (error) {
    console.log("Erroro", error);
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
      result = await db.query(
        "SELECT BIN_TO_UUID(id) as id,name,visibility  from `groups` WHERE user_id=UUID_TO_BIN(?)",
        [currentUser.id]
      );
      result = JSON.parse(JSON.stringify(result));

      const rowIds = result.map(item => `UUID_TO_BIN('${item.id}')`);

      let members =
        rowIds && rowIds.length > 0
          ? await db.query(
              "SELECT BIN_TO_UUID(group_id) as `group_id`,BIN_TO_UUID(user_id) as `user_id` from `group_members` WHERE `group_id` IN (" +
                rowIds.join(",") +
                ")"
            )
          : [];
      members = JSON.parse(JSON.stringify(members));

      result = result.map(item => {
        const groupMembers = members
          .filter(member => member.group_id === item.id)
          .map(subItem => subItem.user_id);

        return {
          ...item,
          contacts: [...(groupMembers || [])]
        };
      });
    }
  } catch (error) {
    console.log("Error", error);
  } finally {
    await db.close();
    return result;
  }
};
