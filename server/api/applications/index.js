import { async } from "regenerator-runtime";
import { makeDb } from "../../helpers/database";

import { updateChild, getChildInformation, getChildChildRelationship } from "../child";
import { updateParent, getParentByApplication, getParentChildRelationship } from "../parents";

import {
  getVendorAppGroupsByVendorId,
  getVendorName,
  getVendorAppProgram,
  getVendorAppLocationSite
} from "../vendor";

export const getApplicationById = async id => {
  const db = makeDb();
  let result = [];
  try {
    const applications = await db.query(
      `SELECT 
        id,
        BIN_TO_UUID(app_id) as app_id, 
        BIN_TO_UUID(vendor) as vendor, 
        BIN_TO_UUID(child) as child,
        section1_signature,
        section1_date_signed,
        section2_signature,
        section2_date_signed,
        section3_signature,
        section3_date_signed,
        verification,
        student_status,
        color_designation,
        notes,
        class_teacher,
        application_date,
        archived_date,
        section1_text,
        section2_text,
        section3_text,
        section1_name,
        section2_name,
        section3_name,
        emergency_contacts
        FROM application
        WHERE id=?
        ORDER BY id DESC`,
      [id]
    );
    result = applications;
  } catch (error) {
    console.log("error", error);
  } finally {
    await db.close();
    return result;
  }
};

export const getApplicationByAppId = async (app_id, isHistory = false) => {
  const db = makeDb();
  let application;
  try {
    const applications = await db.query(
      `SELECT 
        id,
        BIN_TO_UUID(app_id) as app_id, 
        BIN_TO_UUID(vendor) as vendor, 
        BIN_TO_UUID(child) as child,
        section1_signature,
        section1_date_signed,
        section2_signature,
        section2_date_signed,
        section3_signature,
        section3_date_signed,
        verification,
        student_status,
        color_designation,
        notes,
        class_teacher,
        application_date,
        archived_date,
        section1_text,
        section2_text,
        section3_text,
        section1_name,
        section2_name,
        section3_name,
        emergency_contacts,
        is_daycare
        FROM application
        WHERE app_id=UUID_TO_BIN(?)
      `,
      [app_id]
    );

    if (applications.length > 0) {
      application = applications[0];
      const child = await getChildInformation(application.child);
      application.parents = await getParentByApplication(application.app_id);
      application.child = child.length > 0 ? child[0] : {};
      application.vendorName = await getVendorName(application.vendor);

      // application.vendorGroup = await getVendorAppGroupsByVendorId(
      //   application.vendor
      // );
      // application.vendorPrograms = await getVendorAppProgram(
      //   application.vendor
      // );
      // application.vendorLocationSites = await getVendorAppLocationSite(
      //   application.vendor
      // );

      application.vendorPrograms = [];
      application.vendorLocationSites = [];
      application.vendorGroup = [];

      let relationships = [];

      for (const appParent of application.parents) {
        let tempRel = await getParentChildRelationship({
          parent: appParent.parent_id,
          child: application.child.ch_id
        });

        if (tempRel.length > 0) relationships.push(tempRel[0]);
      }

      application.app_histories = [];

      application.relationships = relationships;

      application.chRelationships = await getChildChildRelationship(application.child.ch_id);
    }
  } catch (error) {
    console.log("getApplicationByAppId error", error);
  } finally {
    await db.close();
    return application;
  }
};

export const getApplicationsByVendor = async vendor => {
  const db = makeDb();
  let result = [];
  try {
    console.log("getApplicationsByVendor vendor !!!!!!!!!!!!!!! ", vendor);
    const applications = await db.query(
      `SELECT 
        id,
        BIN_TO_UUID(app_id) as app_id, 
        BIN_TO_UUID(vendor) as vendor, 
        BIN_TO_UUID(child) as child,
        section1_signature,
        section1_date_signed,
        section2_signature,
        section2_date_signed,
        section3_signature,
        section3_date_signed,
        verification,
        student_status,
        color_designation,
        notes,
        class_teacher,
        application_date,
        archived_date,
        section1_text,
        section2_text,
        section3_text,
        section1_name,
        section2_name,
        section3_name,
        emergency_contacts,
        is_daycare
        FROM application
        WHERE vendor=UUID_TO_BIN(?) and is_archived=0
        ORDER BY id DESC`,
      [vendor]
    );
    result = applications;
  } catch (error) {
    console.log("error", error);
  } finally {
    await db.close();
    return result;
  }
};

export const getApplicationsByAppGroup = async ({
  app_group,
  is_customform
}) => {
  const db = makeDb();
  let result = [];
  try {

  
    if(is_customform) {
      let applications = await db.query(
        `SELECT 
          id,
          BIN_TO_UUID(form) as form,
          BIN_TO_UUID(vendor) as vendor,
          BIN_TO_UUID(app_id) as app_id,
          CONVERT(form_contents USING utf8) as form_contents,
          application_date,
          archived_date,
          class_teacher,
          color_designation,
          verification,
          student_status,
          notes
        FROM custom_application
        WHERE ( class_teacher = ? OR 
          class_teacher LIKE ? ) AND 
          is_archived=0
        ORDER BY id DESC`,
        [app_group, `%${app_group}%`]
      );

      for (let application of applications) {
        application.form_contents = application.form_contents ? Buffer.from(application.form_contents, "base64").toString("utf-8") : "{}";
        application.form_contents = JSON.parse(application.form_contents);
      }

      result = applications;
    } else {
      const applications = await db.query(
        `SELECT 
          id,
          BIN_TO_UUID(app_id) as app_id, 
          BIN_TO_UUID(vendor) as vendor, 
          BIN_TO_UUID(child) as child,
          section1_signature,
          section1_date_signed,
          section2_signature,
          section2_date_signed,
          section3_signature,
          section3_date_signed,
          verification,
          student_status,
          color_designation,
          notes,
          class_teacher,
          application_date,
          archived_date,
          section1_text,
          section2_text,
          section3_text,
          section1_name,
          section2_name,
          section3_name,
          emergency_contacts,
          is_daycare
          FROM application
          WHERE class_teacher LIKE '%${app_group}%' and is_archived=0
          ORDER BY id DESC`
      );
      result = applications;
    }

  } catch (error) {
    console.log("error", error);
  } finally {
    await db.close();
    return result;
  }
};

export const getArchivedApplicationsByVendor = async vendor_id => {
  const db = makeDb();
  let result = [];
  try {
    const applications = await db.query(
      `SELECT 
        id,
        BIN_TO_UUID(app_id) as app_id, 
        BIN_TO_UUID(vendor) as vendor, 
        BIN_TO_UUID(child) as child,
        section1_signature,
        section1_date_signed,
        section2_signature,
        section2_date_signed,
        section3_signature,
        section3_date_signed,
        verification,
        student_status,
        color_designation,
        notes,
        class_teacher,
        application_date,
        archived_date,
        section1_text,
        section2_text,
        section3_text,
        section1_name,
        section2_name,
        section3_name,
        emergency_contacts
        FROM application 
        WHERE vendor=UUID_TO_BIN(?) and is_archived=1
        ORDER BY archived_date DESC`,
      [vendor_id]
    );
    result = applications;
  } catch (error) {
    console.log("error", error);
  } finally {
    await db.close();
    return result;
  }
};

export const createApplication = async ({
  vendor,
  child,
  section1_signature,
  section1_date_signed,
  section2_signature,
  section2_date_signed,
  section3_signature,
  section3_date_signed,
  verification = "waiting_for_verification",
  student_status = "new_applicant_in_process",
  section1_text,
  section2_text,
  section3_text,
  section1_name,
  section2_name,
  section3_name,
  class_teacher,
  emergency_contacts,
  is_daycare
}) => {
  const db = makeDb();
  let result = {};
  let lastId = "";
  let application;

  try {
    result = await db.query(
      `INSERT INTO application(
        app_id,
        vendor,
        child,
        section1_signature,
        section1_date_signed,
        section2_signature,
        section2_date_signed,
        section3_signature,
        section3_date_signed,
        verification,
        student_status,
        section1_text,
        section2_text,
        section3_text,
        section1_name,
        section2_name,
        section3_name,
        class_teacher,
        emergency_contacts,
        is_daycare
      ) VALUES (
        UUID_TO_BIN(UUID()), 
        UUID_TO_BIN(?), 
        UUID_TO_BIN(?), 
        ?, ?, ?, ?, ?, ?, 
        ?, ?, ?, ?, ?, ?, 
        ?, ?, ?, ?, ?)`,
      [
        vendor,
        child,
        section1_signature,
        section1_date_signed,
        section2_signature,
        section2_date_signed,
        section3_signature,
        section3_date_signed,
        verification,
        student_status,
        section1_text,
        section2_text,
        section3_text,
        section1_name,
        section2_name,
        section3_name,
        class_teacher,
        emergency_contacts,
        is_daycare
      ]
    );

    lastId = result.insertId;

    await db.query(
      "INSERT INTO vendor_app_groups_to_student (app_grp_id,child_id,type) values(?,UUID_TO_BIN(?),?)",
      [
        class_teacher ? `UUID_TO_BIN(${class_teacher})` : null,
        child,
        'bcombs'
      ]
    );

    application = await db.query(
      "SELECT (BIN_TO_UUID(app_id)) as app_id FROM application WHERE id=?",
      [lastId]
    );
    application = application.length > 0 ? application[0] : "";

    console.log("application result", result);
  } catch (err) {
    console.log("add application error", err);
  } finally {
    await db.close();
    return application;
  }
};

// const isStudentExistInGroup = async (groupId, childId) => {
//   try {
//     const currentApplication = await db.query('SELECT app_grp_id,child_id FROM vendor_app_groups_to_student WHERE app_grp_id=? AND child_id=?', [groupId, childId]);
//     return currentApplication && currentApplication[0] ? currentApplication[0] : null;
//   } catch (err) {
//     return null
//   }
// }

export const updateApplication = async ({
  verification,
  student_status,
  color_designation,
  class_teacher,
  notes,
  app_id
}) => {
  const db = makeDb();
  let result = {};
  try {
    console.log('Update Application Class Teacher', class_teacher)
    const currentApplication = await db.query('SELECT BIN_TO_UUID(child) as child, class_teacher FROM application WHERE app_id=UUID_TO_BIN(?)', [app_id]);
    result = await db.query(
      `UPDATE application SET
      verification=?,
      student_status=?,
      color_designation=?,
      class_teacher=?,
      notes=?
      WHERE app_id=UUID_TO_BIN(?)`,
      [
        verification,
        student_status,
        color_designation,
        class_teacher,
        notes,
        app_id
      ]
    );
    if (class_teacher && currentApplication && currentApplication[0]) {
      let previousClassTeacher = currentApplication && currentApplication[0] && currentApplication[0].class_teacher;
      previousClassTeacher = previousClassTeacher && previousClassTeacher.split(',');
      const teacher = class_teacher && class_teacher.split(',');
      for (let groupId of teacher) {
        if(!previousClassTeacher.includes(groupId)) {
          await db.query(
            "INSERT INTO vendor_app_groups_to_student (app_grp_id,child_id,type) values(UUID_TO_BIN(?),UUID_TO_BIN(?),?)",
            [
              groupId,
              currentApplication[0].child,
              'bcombs'
            ]);
        }
      }

      for (let groupId of previousClassTeacher) {
        if(!teacher.includes(groupId)) {
          await db.query(
            "DELETE FROM vendor_app_groups_to_student WHERE app_grp_id=UUID_TO_BIN(?) AND child_id=UUID_TO_BIN(?)",
            [
              groupId,
              currentApplication[0].child
            ]);
        }
      }

    }
  } catch (err) {
    console.log("Error", err);
    result.error = err;
  } finally {
    await db.close();
    return result;
  }
};

export const archivedApplication = async app_id => {
  const db = makeDb();
  let result = {};

  try {
    result = await db.query(
      `UPDATE application SET
        is_archived=1,
        archived_date=CURRENT_TIMESTAMP
        WHERE app_id=UUID_TO_BIN(?)`,
      [app_id]
    );
  } catch (err) {
    result.error = err;
  } finally {
    await db.close();
    return result;
  }
};

export const unArchivedApplication = async app_id => {
  const db = makeDb();
  let result = {};

  try {
    result = await db.query(
      `UPDATE application SET
        is_archived=0
        WHERE app_id=UUID_TO_BIN(?)`,
      [app_id]
    );
  } catch (err) {
    result.error = err;
  } finally {
    await db.close();
    return result;
  }
};

export const updateEmergencyConctacts = async (app_id, emergencyContacts) => {
  const db = makeDb();
  let result = {};

  try {
    result = await db.query(
      `UPDATE application SET
        emergency_contacts=?
        WHERE app_id=UUID_TO_BIN(?)`,
      [emergencyContacts, app_id]
    );
  } catch (err) {
    console.log("update emergency contacts", error);
  } finally {
    await db.close();
    return result;
  }
};

export const updateApplicationTC = async ({
  section1_signature,
  section1_date_signed,
  section2_signature,
  section2_date_signed,
  section3_signature,
  section3_date_signed,
  section1_text,
  section2_text,
  section3_text,
  section1_name,
  section2_name,
  section3_name,
  app_id
}) => {
  const db = makeDb();
  let result = {};

  try {
    result = await db.query(
      `UPDATE application SET
        section1_signature=?,
        section1_date_signed=?,
        section2_signature=?,
        section2_date_signed=?,
        section3_signature=?,
        section3_date_signed=?,
        section1_text=?,
        section2_text=?,
        section3_text=?,
        section1_name=?,
        section2_name=?,
        section3_name=?
        WHERE app_id=UUID_TO_BIN(?)`,
      [
        section1_signature,
        section1_date_signed,
        section2_signature,
        section2_date_signed,
        section3_signature,
        section3_date_signed,
        section1_text,
        section2_text,
        section3_text,
        section1_name,
        section2_name,
        section3_name,
        app_id
      ]
    );
  } catch (err) {
    console.log("update terms and conditions", error);
  } finally {
    await db.close();
    console.log("update tc result", result);
    return result;
  }
};

export const saveApplication = async ({
  app_id,
  child,
  parents,
  emergency_contacts,
  tc_signatures
}) => {
  let childResult = await updateChild(child);
  let parentResult;
  let ecResult;
  let tcResult;
  let p_updatedRows = false;
  let ec_updatedRows = false;
  let tc_updatedRows = false;

  if (emergency_contacts) {
    ecResult = await updateEmergencyConctacts(app_id, emergency_contacts);

    if (ecResult && ecResult.changedRows > 0) {
      ec_updatedRows = true;
    }
  }

  if (tc_signatures) {
    tc_updatedRows = await updateApplicationTC(tc_signatures);

    if (tcResult && tcResult.changedRows > 0) {
      tc_updatedRows = true;
    }
  }

  for (let parent of parents) {
    console.log("parent 222", parent);
    parentResult = await updateParent(parent);
    if (parentResult && parentResult.changedRows > 0) {
      p_updatedRows = true;
    }
  }

  if (
    (childResult && childResult.changedRows > 0) ||
    p_updatedRows ||
    ec_updatedRows ||
    tc_updatedRows
  ) {
    return true;
  }
  return false;
};

export const getApplicationHistoryById = async app_id => {
  const db = makeDb();
  let result;

  try {
    result = db.query(
      `
      SELECT 
        id,
        BIN_TO_UUID(app_history_id) as app_history_id,
        BIN_TO_UUID(app_id) as app_id,
        details,
        updated_at,
        updated_by
      FROM application_history
      WHERE app_id=UUID_TO_BIN(?)
      ORDER BY id DESC
    `,
      [app_id]
    );
  } catch (error) {
    console.log("get application by id", error);
  } finally {
    await db.close();
    return result;
  }
};

export const getCustomApplicationHistoryById = async custom_app_id => {
  const db = makeDb();
  let result;

  try {
    result = db.query(
      `
      SELECT 
        id,
        BIN_TO_UUID(app_history_id) as app_history_id,
        BIN_TO_UUID(custom_app_id) as custom_app_id,
        details,
        updated_at,
        updated_by
      FROM application_history
      WHERE custom_app_id=UUID_TO_BIN(?)
      ORDER BY id DESC
    `,
      [custom_app_id]
    );
  } catch (error) {
    console.log("get application by id", error);
  } finally {
    await db.close();
    return result;
  }
};

export const addApplicationHistory = async ({
  app_id = "",
  custom_app_id = "",
  details,
  updated_by
}) => {
  const db = makeDb();
  let result;


  try {

    if (app_id) {
      result = await db.query(
        `
          INSERT INTO application_history(
            app_history_id,
            app_id,
            details,
            updated_by
          ) VALUES (
            UUID_TO_BIN(UUID()),
            UUID_TO_BIN(?),
            ?, ?
          )
       `,
        [app_id, details, updated_by]
      );
    } else {
      result = await db.query(
        `
          INSERT INTO application_history(
            app_history_id,
            custom_app_id,
            details,
            updated_by
          ) VALUES (
            UUID_TO_BIN(UUID()),
            UUID_TO_BIN(?),
            ?, ?
          )
       `,
        [custom_app_id, details, updated_by]
      );
    }
  } catch (error) {
    console.log("add application history", error);
  } finally {
    await db.close();
    return result;
  }
};

export const addApplicationUser = async ({ user_id, app_id = "", custom_app_id = '' }) => {
  const db = makeDb();
  let result;

  let values = custom_app_id !== '' ? [app_id, custom_app_id, user_id] : [app_id, user_id]
  try {
    if (app_id) {
      await db.query(
        `
          INSERT INTO application_user(
            app_user_id,
            app_id,
            user_id
          ) VALUES (
            UUID_TO_BIN(UUID()),
            UUID_TO_BIN(?),
            UUID_TO_BIN(?)
          )
        `,
        [app_id, user_id]
      );
    } else {
      await db.query(
        `
          INSERT INTO application_user(
            app_user_id,
            custom_app_id,
            user_id
          ) VALUES (
            UUID_TO_BIN(UUID()),
            UUID_TO_BIN(?),
            UUID_TO_BIN(?)
          )
        `,
        [custom_app_id, user_id]
      );
    }

  } catch (error) {
    console.log("add application user error", error);
  } finally {
    await db.close();
    return result;
  }
};

export const getAppReceivedReminder = async ({
  app_id,
  is_customform = false
}) => {
  const db = makeDb();
  let application = {};

  try {
    let queriedApps;

    if(is_customform) {
      queriedApps = await db.query(
        `
          SELECT 
            id,
            received_reminder,
            received_update
          FROM application_user
          WHERE custom_app_id=UUID_TO_BIN(?)
        `,
        [app_id]
      );
  
    } else {
      queriedApps = await db.query(
        `
          SELECT 
            id,
            received_reminder,
            received_update
          FROM application_user
          WHERE app_id=UUID_TO_BIN(?)
        `,
        [app_id]
      );
    }
    application = queriedApps.length > 0 ? queriedApps[0] : {}
  } catch (error) {
    console.log("get user applications", error);
  } finally {
    await db.close();
    return application
  }
}

export const getUserApplicationsByUserId = async user_id => {
  const db = makeDb();
  let applications = [];

  try {
    const userApplications = await db.query(
      `
        SELECT 
          id,
          BIN_TO_UUID(app_id) as app_id,
          received_reminder,
          received_update
        FROM application_user
        WHERE user_id=UUID_TO_BIN(?) AND is_archived=0
        ORDER BY id DESC
      `,
      [user_id]
    );
    for (const ua of userApplications) {
      if (ua.app_id) {
        let application = await getApplicationByAppId(ua.app_id);
        application.received_reminder = !!ua.received_reminder;
        application.received_update = !!ua.received_update;
        applications.push(application);
      }
    }
  } catch (error) {
    console.log("get user applications", error);
  } finally {
    await db.close();
    return applications;
  }
};

export const getApplicationHistoryByUser = async id => {
  const db = makeDb();
  let auditTrails = [];
  console.log("Get Application History By User 1", id);
  //let vendorId = id;
  try {
    // const mainVendor = await db.query(
    //   `select BIN_TO_UUID(users.id) as user_id
    //   from vendor_admin,vendor,users WHERE vendor_admin.user=users.id AND
    //   vendor.user=vendor_admin.user AND
    //   users.id=UUID_TO_BIN(?)`,
    //   [id]
    // );
    // console.log("getApplicationHistoryByUser mainVendor", mainVendor);
    // if (mainVendor && mainVendor.length > 0) {
    //   vendorId = mainVendor[0].user_id;
    //   console.log("Vendor ID", vendorId);
    //   console.log("Sub ID", id);
    // }

    auditTrails = await db.query(
      `SELECT application_history.id,
        BIN_TO_UUID(application_history.app_history_id) as app_history_id,
        BIN_TO_UUID(application_history.app_id) as app_id,
        application_history.details,
        application_history.updated_at,
        application_history.updated_by 
      FROM application_history,application,parent, vendor, vendor_admin WHERE
        application_history.app_id = application.app_id AND 
        application.app_id=parent.application  AND 
        application.vendor = vendor.id AND
        (vendor.user=UUID_TO_BIN(?) OR  
        (application.vendor = vendor_admin.vendor AND 
          vendor_admin.vendor=vendor.id AND 
          vendor_admin.user=UUID_TO_BIN(?)
        )) GROUP BY application_history.id
      `,
      [id, id]
    );

    console.log("Get Application History By User 2", auditTrails);
  } catch (error) {
    console.log("get user applications", error);
  } finally {
    await db.close();
    return auditTrails;
  }
};

export const createCustomApplication = async ({
  user,
  vendor,
  form_contents,
  category
}) => {
  const db = makeDb();
  let result = {};
  let lastId = "";
  let application;

  try {
    console.log('form_contents createCustomApplication',form_contents)
    result = await db.query(
      `INSERT INTO vendor_custom_application(
        form_id,
        user,
        vendor,
        form_contents,
        category,
        form_name
      ) VALUES (
        UUID_TO_BIN(UUID()),
        UUID_TO_BIN(?),
        UUID_TO_BIN(?),
        ?, ?, ?)`,
      [
        user,
        vendor,
        form_contents,
        category,
        form_contents.formTitle
      ]
    );

    lastId = result.insertId;

    application = await db.query(
      `SELECT 
        id,
        BIN_TO_UUID(form_id) as form_id,
        BIN_TO_UUID(user) as user,
        BIN_TO_UUID(vendor) as vendor,
        CONVERT(form_contents USING utf8) as form_contents,
        created_at,
        category,
        status
      FROM vendor_custom_application 
      WHERE id=?`,
      [lastId]
    );

    if (application.length > 0) {
      application = application[0];
      application.form_contents = application.form_contents ? Buffer.from(application.form_contents, "base64").toString("utf-8") : "{}";
      console.log("get custom application string", application);
      application.form_contents = JSON.parse(application.form_contents);
    } else {
      application = ""
    }

    console.log("application result", result);
  } catch (err) {
    console.log("create custom application error", err);
  } finally {
    await db.close();
    return application;
  }
};

export const updateCustomApplicationForm = async ({
  form_id,
  user,
  vendor,
  form_contents,
  category
}) => {
  const db = makeDb();
  let result;
  let application;

  try {
    const currentDate = new Date();
    result = await db.query(
      `
        UPDATE vendor_custom_application SET
        form_contents=?,
        updated_at=?,
        category=?
        WHERE form_id=UUID_TO_BIN(?)
      `,
      [
        form_contents,
        currentDate,
        category,
        form_id
      ]
    )

    application = await db.query(
      `SELECT 
        id,
        BIN_TO_UUID(form_id) as form_id,
        BIN_TO_UUID(user) as user,
        BIN_TO_UUID(vendor) as vendor,
        CONVERT(form_contents USING utf8) as form_contents,
        created_at,
        updated_at,
        category,
        status
      FROM vendor_custom_application 
      WHERE form_id=UUID_TO_BIN(?)`,
      [form_id]
    );

    if (application.length > 0) {
      application = application[0];
      application.form_contents = application.form_contents ? Buffer.from(application.form_contents, "base64").toString("utf-8") : "{}";
      console.log("get custom application string", application);
      application.form_contents = JSON.parse(application.form_contents);
    } else {
      application = ""
    }

  } catch (err) {
    console.log("update custom application form error", error);
  } finally {
    await db.close();
    return application;
  }
}

export const deleteCustomApplicationForm = async ({
  form_id
}) => {
  const db = makeDb();
  let result;

  try {
    result = await db.query(
      `
        UPDATE vendor_custom_application SET
        status='deleted'
        WHERE form_id=UUID_TO_BIN(?)
      `,
      [
        form_id
      ]
    )

  } catch (err) {
    console.log("delete custom application form error", error);
  } finally {
    await db.close();
    return result;
  }
}


export const getCustomApplicationFormByFormId = async form_id => {
  const db = makeDb();
  let application;
  try {
    application = await db.query(
      `
        SELECT
        id,
        BIN_TO_UUID(form_id) as form_id,
        BIN_TO_UUID(user) as user,
        BIN_TO_UUID(vendor) as vendor,
        CONVERT(form_contents USING utf8) as form_contents,
        created_at,
        updated_at,
        category,
        status
        FROM vendor_custom_application
        WHERE form_id=UUID_TO_BIN(?) AND status <> 'deleted'
      `,
      [
        form_id
      ]
    )

    if (application.length > 0) {
      application = application[0];
      application.form_contents = application.form_contents ? Buffer.from(application.form_contents, "base64").toString("utf-8") : "{}";
      console.log("get custom application string", application);
      application.form_contents = JSON.parse(application.form_contents);
    } else {
      application = ""
    }

    console.log("get custom application", application);
  } catch (err) {
    console.log("get custom application by form id", err);
  } finally {
    await db.close();
    return application;
  }
}

export const getVendorCustomApplicationForms = async ({ vendor, category = "" }) => {
  const db = makeDb();
  let applications = [];
  try {

    if (category) {
      applications = await db.query(
        `
          SELECT
          id,
          BIN_TO_UUID(form_id) as form_id,
          BIN_TO_UUID(user) as user,
          BIN_TO_UUID(vendor) as vendor,
          CONVERT(form_contents USING utf8) as form_contents,
          created_at,
          updated_at,
          category,
          status
          FROM vendor_custom_application
          WHERE vendor=UUID_TO_BIN(?) AND category=(?) AND status <> 'deleted'
          ORDER BY updated_at DESC
        `,
        [
          vendor,
          category
        ]
      )
    } else {
      applications = await db.query(
        `
          SELECT
          id,
          BIN_TO_UUID(form_id) as form_id,
          BIN_TO_UUID(user) as user,
          BIN_TO_UUID(vendor) as vendor,
          CONVERT(form_contents USING utf8) as form_contents,
          created_at,
          updated_at,
          category,
          status
          FROM vendor_custom_application
          WHERE vendor=UUID_TO_BIN(?) AND status <> 'deleted'
          ORDER BY updated_at DESC
        `,
        [
          vendor
        ]
      )
    }

    for (let application of applications) {
      application.form_contents = application.form_contents ? Buffer.from(application.form_contents, "base64").toString("utf-8") : "{}";
      console.log("get custom application string", application);
      application.form_contents = JSON.parse(application.form_contents);

      let appGroups = await db.query(
        `
          SELECT
            id,
            BIN_TO_UUID(app_grp_id) as app_grp_id,
            BIN_TO_UUID(form) as form,
            BIN_TO_UUID(vendor) as vendor,
            name
          FROM vendor_app_groups
          WHERE form=UUID_TO_BIN(?)
        `,
        [application.form_id]
      )

      application.app_groups = appGroups;
    }

  } catch (err) {
    console.log("get custom application by form id", err);
    applications = [];
  } finally {
    await db.close();
    return applications;
  }
}

export const submitCustomApplication = async ({
  vendor,
  form,
  child = null,
  form_contents
}) => {
  const db = makeDb();
  let result = {};
  let lastId = "";
  let application;
  try {
    console.log('submitCustomApplication',form_contents)
    result = await db.query(
      `INSERT INTO custom_application(
        app_id,
        vendor,
        form,
        child,
        form_contents
      ) VALUES (
        UUID_TO_BIN(UUID()), 
        UUID_TO_BIN(?), 
        UUID_TO_BIN(?),
        UUID_TO_BIN(?),
        ?)`,
      [
        vendor,
        form,
        child,
        form_contents
      ]
    );

    lastId = result.insertId;
    application = await db.query(
      "SELECT (BIN_TO_UUID(app_id)) as app_id FROM custom_application WHERE id=?",
      [lastId]
    );
    application = application.length > 0 ? application[0] : "";

    console.log("custom application result", result);
  } catch (err) {
    console.log("submit custom application error", err);
  } finally {
    await db.close();
    return application;
  }
}

export const updateSubmitCustomApplication = async ({
  app_id,
  form_contents,
  class_teacher = "",
  color_designation = "",
  verification = "",
  student_status = "",
  notes = ""
}) => {
  const db = makeDb();
  let result = {};

  try {
    result = await db.query(`
      UPDATE custom_application SET
      form_contents=?,
      class_teacher=?,
      color_designation=?,
      verification=?,
      student_status=?,
      notes=?
      WHERE app_id=UUID_TO_BIN(?)
    `, [
      form_contents,
      class_teacher,
      color_designation,
      verification,
      student_status,
      notes,
      app_id
    ])
  } catch (err) {
    console.log("update custom application error", error);
  } finally {
    console.log('update success');
    await db.close();
    return result;
  }
}

export const getCustomFormApplicants = async ({ form_id, is_archived = 0 }) => {
  const db = makeDb();
  let applications;
  try {

    applications = await db.query(
      `
        SELECT
        id,
        BIN_TO_UUID(form) as form,
        BIN_TO_UUID(vendor) as vendor,
        BIN_TO_UUID(app_id) as app_id,
        BIN_TO_UUID(child) as child,
        CONVERT(form_contents USING utf8) as form_contents,
        application_date,
        archived_date,
        class_teacher,
        color_designation,
        verification,
        student_status,
        notes
        FROM custom_application
        WHERE form=UUID_TO_BIN(?) AND is_archived=?
        ORDER BY application_date DESC
      `,
      [
        form_id,
        is_archived
      ]
    )

    console.log("applications", applications);

    for (const application of applications) {
      application.form_contents = application.form_contents ? Buffer.from(application.form_contents, "base64").toString("utf-8") : "{}";
      console.log("get custom application string", application);
      application.form_contents = JSON.parse(application.form_contents);
      const child = await getChildInformation(application.child);
      application.child = child.length > 0 ? child[0] : {};
    }

  } catch (err) {
    console.log("get custom application by form id", err);
  } finally {
    await db.close();
    return applications;
  }
}

export const getCustomFormApplicantById = async ({ app_id, is_archived = 0 }) => {
  const db = makeDb();
  let applications;
  try {

    applications = await db.query(
      `
        SELECT
        id,
        BIN_TO_UUID(form) as form,
        BIN_TO_UUID(vendor) as vendor,
        BIN_TO_UUID(app_id) as app_id,
        CONVERT(form_contents USING utf8) as form_contents,
        application_date,
        archived_date,
        class_teacher,
        color_designation,
        verification,
        student_status,
        notes
        FROM custom_application
        WHERE app_id=UUID_TO_BIN(?) AND is_archived=?
      `,
      [
        app_id,
        is_archived
      ]
    )
    console.log('applicationsss', applications)
    for (const application of applications) {
      application.form_contents = application.form_contents ? Buffer.from(application.form_contents, "base64").toString("utf-8") : "{}";
      application.form_contents = JSON.parse(application.form_contents);
    }

    applications = applications.length > 0 ? applications[0] : {};

  } catch (err) {
    console.log("get custom application by form id", err);
  } finally {
    await db.close();
    return applications;
  }
}

export const getUserCustomApplicationsByUserId = async user_id => {
  const db = makeDb();
  let applications = [];

  try {
    const userApplications = await db.query(
      `
        SELECT 
          id,
          BIN_TO_UUID(custom_app_id) as custom_app_id,
          received_reminder,
          received_update
        FROM application_user
        WHERE user_id=UUID_TO_BIN(?) AND is_archived=0
        ORDER BY id DESC
      `,
      [user_id]
    );

    for (const ua of userApplications) {
      if (ua.custom_app_id) {
        let application = await getCustomFormApplicantById({ app_id: ua.custom_app_id });
        application.received_reminder = !!ua.received_reminder;
        application.received_update = !!ua.received_update;
        applications.push(application);
      }
    }
  } catch (error) {
    console.log("get user custom applications", error);
  } finally {
    await db.close();
    return applications;
  }
};

export const getApplicationByAppGroup = async ({
  app_grp_id,
  is_form = false
}) => {
  const db = makeDb();
  let applications;
  try {
    if (is_form) {
      applications = await db.query(
        `
          SELECT
          id,
          BIN_TO_UUID(app_id) as app_id
          FROM custom_application
          WHERE class_teacher LIKE '%${app_grp_id}%' and is_archived=0
        `
      )
    } else {
      applications = await db.query(
        `
          SELECT
          id,
          BIN_TO_UUID(app_id) as app_id
          FROM application
          WHERE class_teacher LIKE '%${app_grp_id}%' AND is_archived=0
        `
      )
    }

  } catch (err) {
    console.log("get custom application by form id", err);
  } finally {
    await db.close();
    return applications;
  }
}

export const getCustomApplicationByVendorId = async (vendor) => {
  const db = makeDb();
  let applications;
  console.log('getCustomApplicationByVendor vendor', vendor)
  try {
    applications = await db.query(
      `SELECT
        id,
        BIN_TO_UUID(app_id) as app_id,
        BIN_TO_UUID(form) as form,
        class_teacher
        FROM custom_application
        WHERE vendor=UUID_TO_BIN(?)
      `,
      [
        vendor
      ]
    );
    console.log('getCustomApplicationByVendor vendor', applications)

  } catch (err) {
    console.log("get custom application by form id", err);
  } finally {
    await db.close();
    return applications;
  }
}

export const updateApplicationUser = async ({
  application,
  custom_app_id,
  received_reminder,
  received_update
}) => {
  const db = makeDb();
  let result;

  try {

    if(application) {
      result = await db.query(
        `UPDATE application_user SET
        received_reminder=?,
        received_update=?
        WHERE app_id=UUID_TO_BIN(?)`,
        [
          received_reminder,
          received_update,
          application
        ]
      );
    } else if(custom_app_id) {
      result = await db.query(
        `UPDATE application_user SET
        received_reminder=?,
        received_update=?
        WHERE custom_app_id=UUID_TO_BIN(?)`,
        [
          received_reminder,
          received_update,
          custom_app_id
        ]
      );
    } else {
      console.log('no app id');
    }

  } catch (err) {
    console.log('err', err);
    result = err;
  } finally {
    db.close();
    return result;
  }
}
