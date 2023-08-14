import { makeDb } from "../../helpers/database";

export const getParentByApplication = async (id) => {
  const db = makeDb();
  let result = [];
  try {
    const parent = await db.query (
      `SELECT 
        BIN_TO_UUID(parent_id) as parent_id,
        new_parentId,
        firstname,
        lastname,
        image,
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

export const getParentInformation = async (id) => {
  const db = makeDb();
  let result = [];
  try {
    const parent = await db.query (
      `SELECT 
        BIN_TO_UUID(parent_id) as parent_id,
        new_parentId,
        firstname,
        lastname,
        image,
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
        WHERE parent_id=UUID_TO_BIN(?)`,
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
  birthdate = null,
  gender,
  ethnicities,
  image,
  is_parent_allow_shared  = 0
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
        ethnicities,
        image,
        is_parent_allow_shared
      ) VALUES (UUID_TO_BIN(UUID()), UUID_TO_BIN(?),
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?)`,
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
        ethnicities,
        image,
        is_parent_allow_shared
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
  birthdate = null,
  gender,
  ethnicities,
  image,
  is_parent_allow_shared
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
        ethnicities,
        image,
        is_parent_allow_shared
      ) VALUES (UUID_TO_BIN(UUID()), UUID_TO_BIN(?),
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        birthdate === '' ? null : birthdate,
        gender,
        ethnicities,
        image,
        is_parent_allow_shared
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
  parent_id,
  image,
  is_parent_allow_shared = 0
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
        ethnicities=?,
        image=?,
        is_parent_allow_shared=?
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
        image,
        is_parent_allow_shared,
        parent_id,
 
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


export const getParentByVendorId = async({
  vendorId, 
  appGroupId = null,
  formType = 'mentoring'
}) => {
  const db = makeDb();
  let result = [];

  try {
    let whereValues = [vendorId];

    result = formType === 'mentoring'  ? await db.query(
      `
        SELECT 
          BIN_TO_UUID(p.parent_id) as parent_id,
          BIN_TO_UUID(p.application) as application,
          p.firstname, 
          p.lastname, 
          p.email_address,
          p.email_type,
          p.phone_number,
          p.phone_type,
          p.occupation,
          p.parent_goals,
          p.parent_child_goals,
          p.live_area,
          p.level_of_education,
          p.child_hs_grad,
          p.child_col_grad,
          p.address,
          p.city,
          p.state,
          p.zip_code,
          p.phone_type2,
          p.phone_number2,
          p.email_type2,
          p.email_address2,
          p.person_recommend,
          p.age,
          p.birthdate,
          p.gender,
          p.ethnicities,
          p.image,
          p.is_parent_allow_shared,
          p.is_vendor_allow_shared
        FROM parent p,vendor v,application  a
        WHERE a.vendor=v.id AND v.id=UUID_TO_BIN(?)
        AND p.application=a.app_id
        ${appGroupId ? ` AND a.class_teacher  LIKE '%${appGroupId}%'` : ''}
      `,
      [
        whereValues
      ]
    ) : await db.query(
      `
        SELECT 
          BIN_TO_UUID(p.parent_id) as parent_id,
          BIN_TO_UUID(p.application) as application,
          p.firstname, 
          p.lastname, 
          p.email_address,
          p.email_type,
          p.phone_number,
          p.phone_type,
          p.occupation,
          p.parent_goals,
          p.parent_child_goals,
          p.live_area,
          p.level_of_education,
          p.child_hs_grad,
          p.child_col_grad,
          p.address,
          p.city,
          p.state,
          p.zip_code,
          p.phone_type2,
          p.phone_number2,
          p.email_type2,
          p.email_address2,
          p.person_recommend,
          p.age,
          p.birthdate,
          p.gender,
          p.ethnicities,
          p.image,
          p.is_parent_allow_shared,
          p.is_vendor_allow_shared
        FROM parent p,vendor v,application  a
        WHERE a.vendor=v.id AND v.id=UUID_TO_BIN(?)
        AND p.application=a.app_id
        ${appGroupId ? ` AND a.class_teacher  LIKE '%${appGroupId}%'` : ''}
      `,
      [
        whereValues
      ]
    );
      
    for(let x = 0; x < result.length; x++) {
        if(!result[x].is_parent_allow_shared) {
          result[x] = {
            parent_id: result[x].parent_id, 
            firstname:  result[x].firstname, 
            lastname: result[x].lastname, 
            email_address: result[x].email_address
          }
        }
    }

  } catch(err) {
    console.log("getParentByVendor error", err)
  } finally {
    await db.close();
    return result
  }
}

export const updateParentSharingByVendor = async({
  vendor_id,
  parents = []
}) => {
  const db = makeDb();
  let result = [];
  console.log('updateParentSharingByVendor vendor_id',vendor_id)
  try {
    for(let parent of parents) {
      console.log('parentttttt', parent)
      await db.query(
        `  
          UPDATE parent SET
            is_vendor_allow_shared=?
          WHERE parent_id=UUID_TO_BIN(?)
        `,
        [ 
          parent.is_vendor_allow_shared,
          parent.parent_id
        ]
      )
    }

    result = await getParentByVendorId({
      vendorId: vendor_id
    });
    console.log('result',result)
  } catch(err) {
    console.log("updateParentSharingByVendor error", err)
    result = []
  } finally {
    await db.close();
    return result
  }
}