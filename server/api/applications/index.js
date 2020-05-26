import { makeDb } from "../../helpers/database";

export const getApplications = async () => {
  const db = makeDb();
  let result = [];
  try {
    const applications = await db.query (
      `SELECT 
        BIN_TO_UUID(id) as id, 
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
        class_teacher
        FROM application`,
    )
    result = applications;
  } catch (error) {
  } finally {
    await db.close();
    return result;
  }
};

export const getApplicationsByVendor = async (vendor) => {
  const db = makeDb();
  let result = [];
  try {
    const applications = await db.query (
      `SELECT 
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
        archived_date
        FROM application
        WHERE vendor=UUID_TO_BIN(?) and is_archived=0
        ORDER BY id DESC`,
        [vendor]
    )
    result = applications;
  } catch (error) {
    console.log("error", error);
  } finally {
    await db.close();
    return result;
  }
};

export const getArchivedApplicationsByVendor = async (vendor_id) => {
  const db = makeDb();
  let result = [];
  try {
    const applications = await db.query (
      `SELECT 
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
        archived_date
        FROM application 
        WHERE vendor=UUID_TO_BIN(?) and is_archived=1
        ORDER BY archived_date DESC`,
        [vendor_id]
    )
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
  student_status = "new_applicant_in_process"
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
        student_status
      ) VALUES (
        UUID_TO_BIN(UUID()), 
        UUID_TO_BIN(?), 
        UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      ]
    )

    lastId = result.insertId;
    application = await db.query("SELECT (BIN_TO_UUID(app_id)) as app_id FROM application WHERE id=?", [lastId]);
    application = application.length > 0 ? application[0]: "";

    console.log("application result", result);
  } catch(err) {
    console.log("add application error", err);
  } finally {
    await db.close();
    return application;
  }
}

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
  } catch(err) {
    console.log("Error", err);
    result.error = err;
  } finally {
    await db.close();
    return result;
  }
}

export const archivedApplication = async (app_id) => {
  const db = makeDb();
  let result = {};

  try {
    result = await db.query(
      `UPDATE application SET
        is_archived=1,
        archived_date=CURRENT_TIMESTAMP
        WHERE app_id=UUID_TO_BIN(?)`,
      [
        app_id
      ]
    );
  } catch(err) {
    result.error = err;
  } finally {
    await db.close();
    return result;
  }
}

export const unArchivedApplication = async (app_id) => {
  const db = makeDb();
  let result = {};

  try {
    result = await db.query(
      `UPDATE application SET
        is_archived=0
        WHERE app_id=UUID_TO_BIN(?)`,
      [
        app_id
      ]
    );
  } catch(err) {
    result.error = err;
  } finally {
    await db.close();
    return result;
  }
}
