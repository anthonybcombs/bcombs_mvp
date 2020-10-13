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
        phone_type2,
        phone_number2,
        email_type2,
        email_address2,
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
        person_recommend,
        age,
        birthdate,
        gender,
        ethnicities
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

export  const addDaycareParent = async({
  application,
  firstname,
  lastname,
  phone_type,
  phone_number,
  email_type,
  email_address,
  occupation,
  employers_name,
  parent_goals,
  parent_child_goals,
  address,
  city,
  state,
  zip_code,
  phone_type2,
  phone_number2,
  email_type2,
  email_address2,
  age,
  birthdate,
  gender,
  ethnicities
}) => {
  const db = makeDb();
  let result = {};
  let lastId = "";
  let parent;
  try {
    result = await db.query(
      `INSERT INTO parent(
        parent_id,
        application,
        firstname,
        lastname,
        phone_type,
        phone_number,
        email_type,
        email_address,
        occupation,
        employers_name,
        parent_goals,
        parent_child_goals,
        address,
        city,
        state,
        zip_code,
        phone_type2,
        phone_number2,
        email_type2,
        email_address2,
        age,
        birthdate,
        gender,
        ethnicities
      ) VALUES (UUID_TO_BIN(UUID()), UUID_TO_BIN(?),
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?)`,
      [
        application,
        firstname,
        lastname,
        phone_type,
        phone_number,
        email_type,
        email_address,
        occupation,
        employers_name,
        parent_goals,
        parent_child_goals,
        address,
        city,
        state,
        zip_code,
        phone_type2,
        phone_number2,
        email_type2,
        email_address2,
        age,
        birthdate,
        gender,
        ethnicities
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

export const addParent = async ({
  application,
  firstname,
  lastname,
  phone_type,
  phone_number,
  email_type,
  email_address,
  phone_type2,
  phone_number2,
  email_type2,
  email_address2,
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
  person_recommend,
  age,
  birthdate,
  gender,
  ethnicities
}) => {
  const db = makeDb();
  let result = {};
  let lastId = "";
  let parent;
  try {
    result = await db.query(
      `INSERT INTO parent(
        parent_id,
        application,
        firstname,
        lastname,
        phone_type,
        phone_number,
        email_type,
        email_address,
        phone_type2,
        phone_number2,
        email_type2,
        email_address2,
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
        person_recommend,
        age,
        birthdate,
        gender,
        ethnicities
      ) VALUES (UUID_TO_BIN(UUID()), UUID_TO_BIN(?),
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?)`,
      [
        application,
        firstname,
        lastname,
        phone_type,
        phone_number,
        email_type,
        email_address,
        phone_type2,
        phone_number2,
        email_type2,
        email_address2,
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
        person_recommend,
        age,
        birthdate,
        gender,
        ethnicities
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

export const updateParent = async ({
  firstname,
  lastname,
  phone_type,
  phone_number,
  email_type,
  email_address,
  phone_type2,
  phone_number2,
  email_type2,
  email_address2,
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
  person_recommend,
  age,
  birthdate,
  gender,
  ethnicities,
  parent_id
}) => {

  const db = makeDb();
  let result;

  try {

    result = await db.query(
      `
        UPDATE parent SET
        firstname=?,
        lastname=?,
        phone_type=?,
        phone_number=?,
        email_type=?,
        email_address=?,
        phone_type2=?,
        phone_number2=?,
        email_type2=?,
        email_address2=?,
        address=?,
        city=?,
        state=?,
        zip_code=?,
        occupation=?,
        employers_name=?,
        parent_goals=?,
        parent_child_goals=?,
        live_area=?,
        level_of_education=?,
        child_hs_grad=?,
        child_col_grad=?,
        person_recommend=?,
        age=?,
        birthdate=?,
        gender=?,
        ethnicities=?
        WHERE parent_id=UUID_TO_BIN(?)
      `,
      [
        firstname,
        lastname,
        phone_type,
        phone_number,
        email_type,
        email_address,
        phone_type2,
        phone_number2,
        email_type2,
        email_address2,
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
        person_recommend,
        age,
        birthdate,
        gender,
        ethnicities,
        parent_id
      ]
    )
  } catch(error) {
    console.log("update parent", error);
  } finally {
    await db.close();
    return result;
  }
}

export const addParentChildRelationship = async({
  child,
  parent,
  relationship
}) => {
  const db = makeDb();
  let result = {};

  try {
    result = await db.query(
      `INSERT INTO parent_child(
        id,
        child,
        parent,
        relationship
      ) VALUES (UUID_TO_BIN(UUID()), UUID_TO_BIN(?), UUID_TO_BIN(?), ?)`,
      [
        child,
        parent,
        relationship
      ]
    )
  } catch(err) {
    console.log("add parent error", err)
  } finally {
    await db.close();
    return result
  }
}

export const updateParentChildRelationship = async({
  id,
  relationship
}) => {
  const db = makeDb();
  let result = {};

  try {
    result = await db.query(
      `
        UPDATE parent_child SET
        relationship=?
        WHERE id=UUID_TO_BIN(?)
      `,
      [
        relationship,
        id
      ]
    )
  } catch(err) {
    console.log("add parent error", err)
  } finally {
    await db.close();
    return result
  }
}

export const getParentChildRelationship = async({
  child,
  parent
}) => {
  const db = makeDb();
  let result = {};

  try {
    result = await db.query(
      `
        SELECT 
        BIN_TO_UUID(id) as id,
        BIN_TO_UUID(child) as child,
        BIN_TO_UUID(parent) as parent,
        relationship
        FROM parent_child 
        WHERE child=UUID_TO_BIN(?) AND parent=UUID_TO_BIN(?)
      `,
      [
        child,
        parent
      ]
    )
  } catch(err) {
    console.log("add parent error", err)
  } finally {
    await db.close();
    return result
  }
}
