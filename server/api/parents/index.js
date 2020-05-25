import { makeDb } from "../../helpers/database";

export const getParentByApplication = async (id) => {
  const db = makeDb();
  let result = [];
  try {
    const parent = await db.query (
      `SELECT 
        BIN_TO_UUID(parent_id) as parent_id,
        firstname,
        lastname,
        phone_type,
        phone_number,
        email_type,
        email_address,
        address,
        city,
        state,
        zip_code,
        occupation,
        employers_name,
        parent_goals,
        parent_child_goals,
        live_area,
        level_of_education,
        child_hs_grad,
        child_col_grad
        FROM parent
        WHERE application=UUID_TO_BIN(?)`,
        [id]
    )
    result = parent;
  } catch (error) {
    console.log(error);
  } finally {
    await db.close();
    return result;
  }
};

export const addParent = async ({
  application,
  firstname,
  lastname,
  phone_type,
  phone_number,
  email_type,
  email_address,
  password,
  address,
  city,
  state,
  zip_code,
  occupation,
  employers_name,
  parent_goals,
  parent_child_goals,
  live_area,
  level_of_education,
  child_hs_grad,
  child_col_grad,
  emergency_contacts
}) => {
  const db = makeDb();
  let result = {};
  let lastId = "";
  let parent;
  try {
    let result = await db.query(
      `INSERT INTO parent(
        parent_id,
        application,
        firstname,
        lastname,
        phone_type,
        phone_number,
        email_type,
        email_address,
        password,
        address,
        city,
        state,
        zip_code,
        occupation,
        employers_name,
        parent_goals,
        parent_child_goals,
        live_area,
        level_of_education,
        child_hs_grad,
        child_col_grad,
        emergency_contacts
      ) VALUES (UUID_TO_BIN(UUID()), UUID_TO_BIN(?),
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        application,
        firstname,
        lastname,
        phone_type,
        phone_number,
        email_type,
        email_address,
        password,
        address,
        city,
        state,
        zip_code,
        occupation,
        employers_name,
        parent_goals,
        parent_child_goals,
        live_area,
        level_of_education,
        child_hs_grad,
        child_col_grad,
        emergency_contacts
      ]
    )

    lastId = result.insertId;
    parent = await db.query("SELECT (BIN_TO_UUID(parent_id)) as parent_id FROM parent WHERE id=?", [lastId]);
    parent = parent.length > 0 ? parent[0]: "";
    
  } catch(err) {
    console.log("add parent error", err);
  } finally {
    await db.close();
    return parent;
  }
}
