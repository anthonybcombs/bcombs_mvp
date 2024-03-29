import { makeDb } from "../../helpers/database";
import { maskEmail } from '../../helpers/email';

export const getParentByApplication = async (id) => {
  const db = makeDb();
  let result = [];
  try {
    const parent = await db.query(
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
        ethnicities,
        users.is_profile_filled,
        users.last_login,
        users.last_verification_sent
        FROM parent
        LEFT JOIN users ON parent.email_address=users.email
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
    const parent = await db.query(
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

export const addDaycareParent = async ({
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
  is_parent_allow_shared = 0
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
    parent = parent.length > 0 ? parent[0] : "";

  } catch (err) {
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
    let currentAge = age || 0;

    if (birthdate) {
      let today = new Date();
      let birthDate = new Date(birthdate);
      currentAge = today.getFullYear() - birthDate.getFullYear();
    }

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
        ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        currentAge,
        birthdate === '' ? null : birthdate,
        gender,
        ethnicities,
        image,
        is_parent_allow_shared
      ]
    )

    lastId = result.insertId;
    parent = await db.query("SELECT (BIN_TO_UUID(parent_id)) as parent_id FROM parent WHERE id=?", [lastId]);
    parent = parent.length > 0 ? parent[0] : "";

  } catch (err) {
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
  } catch (error) {
    console.log("update parent", error);
  } finally {
    await db.close();
    return result;
  }
}

export const addParentChildRelationship = async ({
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
  } catch (err) {
    console.log("add parent error", err)
  } finally {
    await db.close();
    return result
  }
}

export const updateParentChildRelationship = async ({
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
  } catch (err) {
    console.log("add parent error", err)
  } finally {
    await db.close();
    return result
  }
}

export const getParentChildRelationship = async ({
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
  } catch (err) {
    console.log("add parent error", err)
  } finally {
    await db.close();
    return result
  }
}


export const getParentByVendorId = async ({
  vendorId,
  appGroupId = null,  // THIS IS FORM ID IF formType = 'forms'
  formType = null, 
  isVendorMode = false
}) => {
  const db = makeDb();
  let applications = [];

  try {
    let whereValues = [vendorId];

    const applicationQuery  =  `
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
      p.is_vendor_allow_shared,
      u.is_profile_filled
    FROM parent p

    CROSS JOIN application a ON p.application=a.app_id AND p.application=a.app_id
    CROSS JOIN vendor v ON a.vendor=v.id 

    LEFT JOIN users u ON u.email=p.email_address

    WHERE v.id=UUID_TO_BIN(?) ${!isVendorMode ? ` AND p.is_parent_allow_shared=1` : ' '}
  
    ${appGroupId ? ` AND a.class_teacher  LIKE '%${appGroupId}%'` : ''}
  `;
    
    const customApplicationQuery = `
    SELECT
      BIN_TO_UUID(ch.ch_id) as parent_id,
      BIN_TO_UUID(c.app_id) as application,
      ch.firstname as firstname, 
      ch.lastname as lastname,
      u.email as email_address,
      ch.phone_number as phone_number, 
      ch.phone_type as phone_type,
      ch.address as address,
      ch.city as city,
      ch.state as state,
      up.is_parent_allow_shared,
      ch.is_vendor_allow_shared,
      u.is_profile_filled
    FROM custom_application c,child ch, application_user a, user_profiles up, users u
    WHERE c.vendor=UUID_TO_BIN(?) 
    ${appGroupId ? ` AND c.form=UUID_TO_BIN(?)` : ' '}
    AND ch.ch_id=c.child
    AND a.custom_app_id=c.app_id
    AND u.id=up.user_id
    AND a.user_id=up.user_id
    ${!isVendorMode ? ` AND up.is_parent_allow_shared=1` : ' '}
  `;

    if (formType === 'mentoring') {
      applications = await db.query(applicationQuery, whereValues);
    }

    else if(formType === 'forms'){
      // HOLD CUSTOM APPLICATION FOR NOW
      //     ${appGroupId ? ` AND c.class_teacher  LIKE '%${appGroupId}%'` : ''}
      if(appGroupId) {
        whereValues = [
          ...whereValues,
          appGroupId
        ]
      }
      applications = await db.query(customApplicationQuery, whereValues);
      // for (const application of applications) {
      //   application.form_contents = application.form_contents ? Buffer.from(application.form_contents, "base64").toString("utf-8") : "{}";
      //   application.form_contents = JSON.parse(application.form_contents);
      // }
    }

    else {
      let mentoringContacts = await db.query(applicationQuery, whereValues);
      let formContacts = await db.query(customApplicationQuery, whereValues);
      applications = [...(mentoringContacts || []), ...( formContacts || [])]
    }



    for (let x = 0; x < applications.length; x++) {
      if (!applications[x].is_parent_allow_shared) {
        applications[x] = {
          parent_id: applications[x].parent_id,
          firstname: applications[x].firstname,
          lastname: applications[x].lastname,
          email_address: applications[x].email_address ? maskEmail(applications[x].email_address) : '',
          is_profile_filled: applications[x].is_profile_filled
        }
      }
    }

    applications = [...applications,];

  } catch (err) {
    console.log("getParentByVendor error", err)
  } finally {
    await db.close();
    return applications
  }
}

export const updateParentSharingByVendor = async ({
  vendor_id,
  parents = [],
  app_group_id = null,
  form_type = 'mentoring'
}) => {
  const db = makeDb();
  let result = [];
  try {
    for (let parent of parents) {

      const query = form_type === 'forms' ? `  
      UPDATE child SET
        is_vendor_allow_shared=?
      WHERE ch_id=UUID_TO_BIN(?)` : `  
      UPDATE parent SET
        is_vendor_allow_shared=?
      WHERE parent_id=UUID_TO_BIN(?)
  `;


      await db.query(query,
        [
          parent.is_vendor_allow_shared,
          parent.parent_id
        ]
      )


    }

    result = await getParentByVendorId({
      vendorId: vendor_id,
      appGroupId: app_group_id,
      formType: form_type
    });
    console.log('result', result)
  } catch (err) {
    console.log("updateParentSharingByVendor error", err)
    result = []
  } finally {
    await db.close();
    return result
  }
}