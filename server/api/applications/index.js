import { makeDb } from "../../helpers/database";

import { updateChild, getChildInformation } from "../child";
import { updateParent, getParentByApplication } from "../parents";

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
        emergency_contacts
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
      application.vendorGroup = await getVendorAppGroupsByVendorId(
        application.vendor
      );
      application.vendorPrograms = await getVendorAppProgram(
        application.vendor
      );
      application.vendorLocationSites = await getVendorAppLocationSite(
        application.vendor
      );

      application.app_histories = [];
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

    console.log("getApplicationsByVendor !!!!!!!!!!!!!!!", result);
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

export const addApplicationHistory = async ({
  app_id,
  details,
  updated_by
}) => {
  const db = makeDb();
  let result;

  try {
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
  } catch (error) {
    console.log("add application history", error);
  } finally {
    await db.close();
    return result;
  }
};

export const addApplicationUser = async ({ user_id, app_id }) => {
  const db = makeDb();
  let result;

  try {
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
  } catch (error) {
    console.log("add application user error", error);
  } finally {
    await db.close();
    return result;
  }
};

export const getUserApplicationsByUserId = async user_id => {
  const db = makeDb();
  let applications = [];

  try {
    const userApplications = await db.query(
      `
        SELECT 
          id,
          BIN_TO_UUID(app_id) as app_id
        FROM application_user
        WHERE user_id=UUID_TO_BIN(?)
        ORDER BY id DESC
      `,
      [user_id]
    );

    for (const ua of userApplications) {
      const application = await getApplicationByAppId(ua.app_id);
      applications.push(application);
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
