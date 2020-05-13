import { makeDb } from "../../helpers/database";
import { getUserFromDatabase } from "../index";

export const getContacts = async email => {
  const db = makeDb();
  console.log("GetContactsss", email);
  const currentUser = await getUserFromDatabase(email);
  let result;
  try {
    const rows = await db.query(
      `SELECT BIN_TO_UUID(id) as id,first_name,last_name,email,phone_number, relation, BIN_TO_UUID(user_id) as user_id  from contacts WHERE added_by = UUID_TO_BIN(?)`,
      [currentUser.id]
    );

    result = rows;
  } catch (error) {
    console.log("Error", error);
  } finally {
    await db.close();
    return result;
  }
};

export const removeContact = async id => {
  const db = makeDb();
  let result = [];
  try {
    await db.query(`DELETE FROM contacts WHERE id=UUID_TO_BIN(?)`, [id]);
    await db.query(`DELETE FROM group_members WHERE user_id=UUID_TO_BIN(?)`, [
      id
    ]);
    const rows = await db.query(
      `SELECT BIN_TO_UUID(id) as id,first_name,last_name,email,phone_number  from contacts`
    );
    result = rows;
  } catch (error) {
  } finally {
    await db.close();
    return result;
  }
};

export const editContact = async data => {
  const db = makeDb();
  let result = [];
  try {
    const { first_name, last_name, phone_number, email, relation, id } = data;
    const currentUser = await getUserFromDatabase(email);
    await db.query(
      `UPDATE contacts SET first_name=?,last_name=?,phone_number=?,email=?,relation=? WHERE id=UUID_TO_BIN(?)`,
      [first_name, last_name, phone_number, email, relation, id]
    );
    console.log("dataaaaaaaaa", data);
    if (data.removed_groups.length > 0) {
      let groupValuesQuery = data.removed_groups.map(currentItem => {
        return `(UUID_TO_BIN("${currentItem}"),UUID_TO_BIN("${currentUser.id}"))`;
      });
      groupValuesQuery = groupValuesQuery.join(",");
      await db.query(
        "DELETE FROM `group_members`  WHERE (group_id, user_id) IN (" +
          groupValuesQuery +
          ")"
      );
    }

    if (data.selected_groups.length > 0) {
      let groupMemberValuesQuery = data.selected_groups.map(item => {
        return `(UUID_TO_BIN("${item}"),UUID_TO_BIN("${currentUser.id}"))`;
      });

      groupMemberValuesQuery = groupMemberValuesQuery.join(",");

      await db.query(
        "INSERT IGNORE INTO `group_members`(`group_id`,`user_id`) VALUES " +
          groupMemberValuesQuery
      );
    }

    const rows = await db.query(
      `SELECT BIN_TO_UUID(id) as id,first_name,last_name,email,phone_number,relation  from contacts`
    );
    result = JSON.parse(JSON.stringify(rows));
  } catch (error) {
    console.log("Edit Contact Error", error);
  } finally {
    await db.close();
    return result;
  }
};

export const createNewContact = async ({
  id,
  first_name,
  last_name,
  phone_number,
  email,
  relation,
  auth_email,
  selected_groups = []
}) => {
  const db = makeDb();
  let results = [];

  try {
    const user = await getUserFromDatabase(email);
    const currentUser = await getUserFromDatabase(auth_email);
    console.log("Userrr", user);
    console.log("Userrr currentUser", currentUser);
    console.log("*****************************************************");
    if (user) {
      await db.query(
        "INSERT IGNORE INTO `contacts`(`id`,`user_id`,`first_name`,`last_name`,`phone_number`,`email`,`relation`,`added_by`) VALUES (UUID_TO_BIN(?),UUID_TO_BIN(?),?,?,?,?,?,UUID_TO_BIN(?))",
        [
          id,
          user.id,
          first_name,
          last_name,
          phone_number,
          email,
          relation,
          currentUser.id
        ]
      );

      if (selected_groups.length > 0) {
        let groupValuesQuery = selected_groups.reduce(
          (accumulator, groupId) => {
            accumulator += `(UUID_TO_BIN("${groupId}"),UUID_TO_BIN("${user.id}")),`;
            return accumulator;
          },
          ""
        );
        groupValuesQuery = groupValuesQuery.substring(
          0,
          groupValuesQuery.length - 1
        );

        await db.query(
          "INSERT IGNORE INTO `group_members`(`group_id`,`user_id`) VALUES " +
            groupValuesQuery
        );
      }
      results = await getContacts(auth_email);
    } else {
    }
  } catch (error) {
    console.log("Error", error);
  } finally {
    await db.close();
    return results;
  }
};
