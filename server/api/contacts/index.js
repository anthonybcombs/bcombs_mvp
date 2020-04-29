import { makeDb } from "../../helpers/database";

export const getContacts = async () => {
  const db = makeDb();
  let result;
  try {
    const rows = await db.query(
      `SELECT BIN_TO_UUID(id) as id,first_name,last_name,email,phone_number, relation  from contacts`
    );

    result = rows;
  } catch (error) {
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
    await db.query(
      `UPDATE contacts SET first_name=?,last_name=?,phone_number=?,email=?,relation=? WHERE id=UUID_TO_BIN(?)`,
      [first_name, last_name, phone_number, email, relation, id]
    );

    const rows = await db.query(
      `SELECT BIN_TO_UUID(id) as id,first_name,last_name,email,phone_number,relation  from contacts`
    );
    result = JSON.parse(JSON.stringify(rows));
    console.log("RESULTTTTTTTTTTTTTT", result);
  } catch (error) {
  } finally {
    await db.close();
    return result;
  }
};
