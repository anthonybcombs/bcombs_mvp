import { makeDb } from "../../helpers/database";

// import { getUserGroups } from "../../api/groups";

// import { sort, distinct, sortByDate } from "../../helpers/array";
import {
  currentS3BucketName,
  s3BucketRootPath,
  uploadFile
} from "../../helpers/aws";

import {
  getVendorCustomApplicationForms,
  getCustomApplicationFormByFormId
} from "../applications";
import moment from 'moment';

export const getVendors = async () => {
  const db = makeDb();
  try {
    const result = await db.query(
      `SELECT 
        BIN_TO_UUID(id) as id, 
        BIN_TO_UUID(user) as user,
        id2,
        name, 
        section1_text,
        section2_text,
        section3_text,
        section1_name,
        section2_name,
        section3_name,
        section1_show,
        section2_show,
        section3_show,
        logo,
        is_default
        FROM vendor`
    );
    return result;
  } catch (error) {
    console.log(error);
  } finally {
    await db.close();
  }
};

export const getVendorsIdByUser = async (user) => {
  const db = makeDb();
  let result;
  let vendors = [];

  try {
    result = await db.query(
      `
        SELECT 
          DISTINCT BIN_TO_UUID(id) as id,
          vendor.id2
        FROM vendor 
        WHERE user=UUID_TO_BIN(?)
      `,
      [user]
    );

    console.log('RESULTTTTTTTTTTTTTTTTTTTTTT 1', result)

    if (result.length > 0) {
      vendors.push(...result);
    }

    result = await db.query(
      `
        SELECT 
          DISTINCT BIN_TO_UUID(vendor) as id
        FROM vendor_admin
        WHERE user=UUID_TO_BIN(?)
      `,
      [user]
    );

    if (result.length > 0) {
      vendors.push(...result);
    }
  } catch (err) {
    console.log("error", error);
  } finally {
    await db.close();
    return vendors;
  }
};

export const getVendorsByUserId = async (user, withApplications = true) => {
  const db = makeDb();
  let result;

  let vendors = [];
  try {

    const getVendorByUserQuery = `SELECT 
      BIN_TO_UUID(v.id) as id, 
      BIN_TO_UUID(v.user) as user,
      BIN_TO_UUID(v.user) as vendor_user,
      v.id2,
      v.name, 
      v.section1_text,
      v.section2_text,
      v.section3_text,
      v.section1_name,
      v.section2_name,
      v.section3_name,
      v.section1_show,
      v.section2_show,
      v.section3_show,
      v.created_at as created_at,
      v.is_daycare,
      v.logo,
      v.is_default
    FROM vendor v
    WHERE v.user=UUID_TO_BIN(?)
    ORDER BY v.id2 ASC
    `;

    result = await db.query(getVendorByUserQuery,[user]);

    // const hasLotForm = result.some(item => item.name.includes('LOT') );

    // if(!hasLotForm && result[0]) {
    //   await db.query(
    //     `INSERT INTO vendor(id, user, name)
    //     VALUES(UUID_TO_BIN(UUID()), UUID_TO_BIN(?), ?)
    //     `,
    //     [user, `${result[0].name} LOT`]
    //   );
    //   result = await db.query(getVendorByUserQuery,[user]);
  
    // }



    if (result && result.length > 0) {
      if (withApplications) {
        for (let i = 0; i < result.length; i++) {
          result[i].app_programs = await getVendorAppProgram(result[i].id);
          result[i].location_sites = await getVendorAppLocationSite(result[i].id);
          result[i].app_groups = await getVendorAppGroupsByVendorId(result[i].id);

          result[i].forms = await getVendorCustomApplicationForms({ vendor: result[i].id });

          vendors.push(result[i]);
        }
      }
      else {
        for (let i = 0; i < result.length; i++) {
          result[i].app_programs = []
          result[i].location_sites = []
          result[i].app_groups = []

          result[i].forms = []
        }
        vendors = [...result]
      }

    }


    let result2 = await db.query(
      `
        SELECT 
          BIN_TO_UUID(v.id) as id, 
          BIN_TO_UUID(v.user) as user,
          BIN_TO_UUID(v.user) as vendor_user,
          v.id2,
          v.name, 
          v.section1_text,
          v.section2_text,
          v.section3_text,
          v.section1_name,
          v.section2_name,
          v.section3_name,
          v.section1_show,
          v.section2_show,
          v.section3_show,
          v.is_daycare,
          v.logo,
          v.is_default,
          va.created_at as created_at
        FROM vendor v, vendor_admin va
        WHERE va.user = UUID_TO_BIN(?) AND va.vendor = v.id
      `,
      [user]
    );
    console.log("Resultttt 1", result2);
    if (result2 && result2.length > 0) {


      if (withApplications) {
        for (let i = 0; i < result2.length; i++) {
          result2[i].app_programs = await getVendorAppProgram(result2[i].id);
          result2[i].location_sites = await getVendorAppLocationSite(
            result2[i].id
          );
          result2[i].app_groups = await getVendorAppGroupsByVendorId(
            result2[i].id
          );

          result2[i].forms = await getVendorCustomApplicationForms({ vendor: result2[i].id });

          vendors.push(result2[i]);
        }
      }
      else {
        for (let i = 0; i < result2.length; i++) {
          result2[i].app_programs = []
          result2[i].location_sites = []
          result2[i].app_groups = []

          result2[i].forms = []
        }
        vendors = [...result]
        vendors = [...vendors, ...result2]
      }

    }


    // if (vendors.length > 0) {
    //   vendors = sortByDate(vendors);
    // }
    console.log("Vendorsssszzz", vendors);
  } catch (error) {
    console.log("Error", error);
  } finally {
    await db.close();
    console.log("getVendorsByUserId", vendors);
    return vendors.reverse();
  }
};

export const getVendorById2 = async (id2) => {
  const db = makeDb();
  let result;
  try {
    result = await db.query(
      `SELECT 
        BIN_TO_UUID(v.id) as id, 
        BIN_TO_UUID(v.user) as user,
        v.id2,
        v.name, 
        v.section1_text,
        v.section2_text,
        v.section3_text,
        v.section1_name,
        v.section2_name,
        v.section3_name,
        v.section1_show,
        v.section2_show,
        v.section3_show,
        v.is_daycare,
        v.logo,
        v.is_default
      FROM vendor v
      WHERE v.id2=?`,
      [id2]
    );

    if (result && result.length > 0) {
      for (let i = 0; i < result.length; i++) {
        result[i].app_programs = await getVendorAppProgram(result[i].id);
        result[i].location_sites = await getVendorAppLocationSite(result[i].id);
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    await db.close();
    return result;
  }
};

export const getVendorById = async (id) => {
  const db = makeDb();
  let result;
  try {
    result = await db.query(
      `SELECT 
        BIN_TO_UUID(v.id) as id, 
        BIN_TO_UUID(v.user) as user,
        v.id2,
        v.name, 
        v.section1_text,
        v.section2_text,
        v.section3_text,
        v.section1_name,
        v.section2_name,
        v.section3_name,
        v.section1_show,
        v.section2_show,
        v.section3_show,
        v.is_daycare,
        v.logo,
        v.is_default
      FROM vendor v
      WHERE v.id=UUID_TO_BIN(?)`,
      [id]
    );

    if (result && result.length > 0) {
      for (let i = 0; i < result.length; i++) {
        result[i].app_programs = await getVendorAppProgram(result[i].id);
        result[i].location_sites = await getVendorAppLocationSite(result[i].id);
        result[i].vendorGroup = await getVendorAppGroupsByVendorId(
          result[i].id
        );
      }
    }
  } catch (error) {
    console.log(error);
  } finally {
    await db.close();
    return result;
  }
};

export const checkIfAdminVendorExists = async ({ user, vendor, form }) => {
  const db = makeDb();

  try {

    if (form && form != 'default') {
      const rows = await db.query(
        `SELECT 
          BIN_TO_UUID(vendor) as vendor 
        FROM vendor_admin
        WHERE user=UUID_TO_BIN(?) AND vendor=UUID_TO_BIN(?) AND form=UUID_TO_BIN(?)`,
        [user, vendor, form]
      );

      if (rows.length > 0) {
        return {
          is_exists: true,
        };
      }

      return {
        is_exists: false,
      };
    } else {
      const rows = await db.query(
        `SELECT 
          BIN_TO_UUID(vendor) as vendor 
        FROM vendor_admin
        WHERE user=UUID_TO_BIN(?) AND vendor=UUID_TO_BIN(?)`,
        [user, vendor]
      );

      if (rows.length > 0) {
        return {
          is_exists: true,
        };
      }

      return {
        is_exists: false,
      };
    }

  } catch (error) {
    console.log("error update admin", error);
  } finally {
    await db.close();
  }
};

export const updateVendorAdmins = async ({ user, vendor, name }) => {
  const db = makeDb();
  let result;

  try {
    result = await db.query(
      `UPDATE vendor_admin SET name=? WHERE user=UUID_TO_BIN(?) AND vendor=UUID_TO_BIN(?)`,
      [name, user, vendor]
    );
  } catch (error) {
    console.log("error update admin", error);
  } finally {
    await db.close();
    return result;
  }
};

export const addVendorAdmins = async ({
  user,
  vendor,
  name,
  form,
  isLotForm = 0
}) => {
  const db = makeDb();
  let result;
  try {

    result = form ? await db.query(
      `INSERT INTO vendor_admin(id, user, vendor, form, name, is_lotform)
      VALUES(UUID_TO_BIN(UUID()), UUID_TO_BIN(?), UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?)`,
      [user, vendor, form, name, isLotForm])
      :
      await db.query(
        `INSERT INTO vendor_admin(id, user, vendor, name, is_lotform)
      VALUES(UUID_TO_BIN(UUID()), UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?)`,
        [user, vendor, name, isLotForm])

  } catch (error) {
    console.log("error", error);
  } finally {
    await db.close();
    return result;
  }
};

export const deleteVendorAdmins = async ({ user, vendor }) => {
  const db = makeDb();
  let result;
  try {
    result = await db.query(
      `DELETE 
      FROM vendor_admin 
      WHERE user=UUID_TO_BIN(?) AND vendor=UUID_TO_BIN(?)`,
      [user, vendor]
    );

    console.log("delete admin success");
  } catch (error) {
    console.log("delete admin error", error);
  } finally {
    await db.close();
    return result;
  }
};

export const getVendorAdminsByUser = async (user) => {
  let result = [];

  const db = makeDb();

  try {
    result = await db.query(
      `SELECT
        BIN_TO_UUID(id) as id,
        BIN_TO_UUID(vendor) as vendor,
        BIN_TO_UUID(form) as form,
        BIN_TO_UUID(user) as user,
        is_lotform
      FROM vendor_admin
      WHERE user=UUID_TO_BIN(?)
      `, [user]
    )
  } catch (err) {
    console.log('err', err);
    result = []
  } finally {
    db.close();
    return result
  }
}

export const getVendorAdmins = async (vendor) => {
  const db = makeDb();
  let result;
  let admins = [];
  try {

    result = await db.query(
      `
        SELECT 
          BIN_TO_UUID(va.id) as id,
          BIN_TO_UUID(v.id) as vendor, 
          BIN_TO_UUID(va.user) as user,
          va.name,
          v.name as vendorName,
          u.email,
          BIN_TO_UUID(va.form) as form,
          va.is_lotform
        FROM vendor v, users u, vendor_admin va
        WHERE va.vendor = UUID_TO_BIN(?) AND 
          v.id = UUID_TO_BIN(?) AND 
          va.vendor = v.id AND 
          va.user = u.id
        ORDER BY va.created_at DESC
      `,
      [vendor, vendor]
    );

    if (result.length > 0) {
      for (let item of result) {
        item.isOwner = false;
        let form = item.form ? await getCustomApplicationFormByFormId(item.form) : "";

        item.formTitle = item.form ? form.form_contents.formTitle : "";
        item.form = item.form ? form.form_id : "";

        admins.push(item);
      }
    }

    //admins = sortByDate(admins, "name");
  } catch (error) {
    console.log("error", error);
  } finally {
    await db.close();
    return admins;
  }
};

export const getVendorAppProgram = async (vendor) => {
  const db = makeDb();
  let result;

  try {
    result = await db.query(
      `SELECT 
          id,
          BIN_TO_UUID(vendor_program_id) as vendor_program_id,
          BIN_TO_UUID(vendor) as vendor,
          BIN_TO_UUID(user) as user,
          name,
          created_at
        FROM vendor_program
        WHERE vendor=UUID_TO_BIN(?)`,
      [vendor]
    );
  } catch (error) {
    console.log("get vendor app program", error);
  } finally {
    await db.close();
    return result;
  }
};

export const getVendorAppLocationSite = async (vendor) => {
  const db = makeDb();
  let result;

  try {
    result = await db.query(
      `SELECT 
        id,
        BIN_TO_UUID(vendor_location_site_id) as vendor_location_site_id,
        BIN_TO_UUID(vendor) as vendor,
        BIN_TO_UUID(user) as user,
        name,
        created_at
      FROM vendor_location_site
      WHERE vendor=UUID_TO_BIN(?)`,
      [vendor]
    );
  } catch (error) {
    console.log("get vendor app location site", error);
  } finally {
    await db.close();
    return result;
  }
};

export const addVendor = async ({ user, name = "" }) => {
  const db = makeDb();
  let result;
  let vendor;
  try {
    console.log("ADD VENDORRR");
    result = await db.query(
      `INSERT INTO vendor(id, user, name)
      VALUES(UUID_TO_BIN(UUID()), UUID_TO_BIN(?), ?)
      `,
      [user, name]
    );

    vendor = await db.query(
      `SELECT 
        BIN_TO_UUID(id) as id, 
        BIN_TO_UUID(user) as user,
        id2,
        name, 
        section1_text,
        section2_text,
        section3_text,
        section1_name,
        section2_name,
        section3_name,
        section1_show,
        section2_show,
        section3_show      
        FROM vendor WHERE user=UUID_TO_BIN(?)`,
      [user]
    );
    vendor = vendor.length > 0 ? vendor : [];
  } catch (err) {
    console.log(err);
  } finally {
    await db.close();
    return vendor;
  }
};

export const createVendor = async ({
  user,
  name,
  section1_text,
  section2_text,
  section3_text,
  section1_name,
  section2_name,
  section3_name,
  section1_show,
  section2_show,
  section3_show,
  logo,
  is_daycare
}) => {
  const db = makeDb();
  let result;
  let vendor;
  let lastId;
  try {
    console.log("ADD VENDORRR");
    result = await db.query(
      `INSERT INTO vendor(
        id, 
        user, 
        name, 
        section1_text,
        section2_text,
        section3_text,
        section1_name,
        section2_name,
        section3_name,
        section1_show,
        section2_show,
        section3_show,
        logo,
        is_daycare)
      VALUES(UUID_TO_BIN(UUID()), UUID_TO_BIN(?), 
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        user,
        name,
        section1_text,
        section2_text,
        section3_text,
        section1_name,
        section2_name,
        section3_name,
        section1_show,
        section2_show,
        section3_show,
        logo,
        is_daycare
      ]
    );

    lastId = result.insertId;

    vendor = await db.query(
      `SELECT 
        BIN_TO_UUID(id) as id, 
        BIN_TO_UUID(user) as user,
        id2,
        name, 
        section1_text,
        section2_text,
        section3_text,
        section1_name,
        section2_name,
        section3_name,
        section1_show,
        section2_show,
        section3_show,
        logo      
        FROM vendor WHERE id2=?`,
      [lastId]
    );
    vendor = vendor.length > 0 ? vendor[0] : {};
  } catch (err) {
    console.log(err);
  } finally {
    console.log('new vendor 1', vendor);
    await db.close();
    return vendor;
  }
}

export const updateVendor = async ({
  id,
  user,
  name,
  section1_text,
  section2_text,
  section3_text,
  section1_name,
  section2_name,
  section3_name,
  section1_show,
  section2_show,
  section3_show,
}) => {
  const db = makeDb();
  try {
    await db.query(
      `UPDATE vendor SET 
      name=?,
      section1_text=?,
      section2_text=?,
      section3_text=?,
      section1_name=?,
      section2_name=?,
      section3_name=?,
      section1_show=?,
      section2_show=?,
      section3_show=?
      WHERE id=UUID_TO_BIN(?)`,
      [
        name,
        section1_text,
        section2_text,
        section3_text,
        section1_name,
        section2_name,
        section3_name,
        section1_show,
        section2_show,
        section3_show,
        id,
      ]
    );

    let vendors = await getVendors();
    vendors = vendors.filter((vendor) => {
      return id == vendor.id;
    });

    const vendor = vendors.length > 0 ? vendors[0] : null;

    return vendor;
  } catch (err) {
    console.log(err);
  } finally {
    await db.close();
  }
};

export const getAppGroupsByUserId = async (user) => {
  const db = makeDb();
  console.log("getAppGroupsByUserId user", user);
  let appGroupsResult = [];
  try {
    appGroupsResult = await db.query(
      `SELECT 
        id, 
        BIN_TO_UUID(app_grp_id) as app_grp_id, 
        BIN_TO_UUID(user) as user, 
        BIN_TO_UUID(vendor) as vendor,
        BIN_TO_UUID(form) as form, 
        size, 
        name, 
        pool_id,
        created_at
      FROM vendor_app_groups 
      WHERE user=UUID_TO_BIN(?)`,
      [user]
    );
    console.log("getAppGroupsByUserId appGroupsResult", appGroupsResult);
  } catch (error) {
    console.log("error", error);
  } finally {
    await db.close();
    return appGroupsResult;
  }
};

export const getAppGroupsByVendor = async (vendor) => {
  const db = makeDb();
  console.log("getAppGroupsByVendor vendor", vendor);
  let appGroupsResult = [];
  try {
    appGroupsResult = await db.query(
      `SELECT 
        id, 
        BIN_TO_UUID(app_grp_id) as app_grp_id, 
        BIN_TO_UUID(user) as user, 
        BIN_TO_UUID(vendor) as vendor,
        BIN_TO_UUID(form) as form, 
        size, 
        name, 
        pool_id,
        created_at
      FROM vendor_app_groups 
      WHERE vendor=UUID_TO_BIN(?) OR vendor IS NULL`,
      [vendor]
    );
    console.log("getAppGroupsByVendor appGroupsResult", appGroupsResult);
  } catch (error) {
    console.log("error", error);
  } finally {
    await db.close();
    return appGroupsResult;
  }
};

export const getVendorAppGroupsByVendorId = async (vendor) => {
  const db = makeDb();
  console.log("getVendorAppGroupsByVendorId VENDOR ID", vendor);
  let appGroupsResult = [];
  try {
    appGroupsResult = await db.query(
      `SELECT 
        id, 
        BIN_TO_UUID(app_grp_id) as app_grp_id, 
        BIN_TO_UUID(user) as user, 
        BIN_TO_UUID(vendor) as vendor, 
        BIN_TO_UUID(form) as form, 
        size, 
        name,
        pool_id,
        created_at
      FROM vendor_app_groups 
      WHERE vendor=UUID_TO_BIN(?) `,
      [vendor]
    );

    // const isLotFormGroupExist = appGroupsResult.some(item => item.name === 'Lot Form');

    // if(!isLotFormGroupExist) {
    //   result = await db.query(
    //     `INSERT INTO vendor_app_groups(app_grp_id, user, vendor, size, name, pool_id)
    //     VALUES(UUID_TO_BIN(UUID()), UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?, ?)`,
    //     [user_id, vendor, size, name, pool_id]
    //   );
    // }

  } catch (error) {
    console.log("error", error);
  } finally {
    await db.close();
    return appGroupsResult;
  }
};

export const getVendorAppGroupsByFormId = async (form) => {
  const db = makeDb();

  let appGroupsResult = [];
  try {
    appGroupsResult = await db.query(
      `SELECT 
        id, 
        BIN_TO_UUID(app_grp_id) as app_grp_id, 
        BIN_TO_UUID(user) as user, 
        BIN_TO_UUID(vendor) as vendor, 
        BIN_TO_UUID(form) as form, 
        size, 
        name,
        pool_id,
        created_at
      FROM vendor_app_groups 
      WHERE form=UUID_TO_BIN(?)`,
      [form]
    );
  } catch (error) {
    console.log("error", error);
  } finally {
    await db.close();
    return appGroupsResult;
  }
};

export const getAppGroupByPool = async (pool_id) => {
  const db = makeDb();

  let appGroupsResult = [];
  try {
    appGroupsResult = await db.query(
      `SELECT
        BIN_TO_UUID(app_grp_id) as app_grp_id
      FROM vendor_app_groups 
      WHERE pool_id=?`,
      [pool_id]
    );
  } catch (error) {
    console.log("error", error);
  } finally {
    await db.close();
    return appGroupsResult;
  }
};

export const getAppGroupById = async (app_grp_id) => {
  const db = makeDb();

  let appGroupsResult = [];
  try {
    appGroupsResult = await db.query(
      `SELECT
        id, 
        BIN_TO_UUID(app_grp_id) as app_grp_id, 
        BIN_TO_UUID(user) as user, 
        BIN_TO_UUID(vendor) as vendor, 
        BIN_TO_UUID(form) as form, 
        size, 
        name,
        pool_id,
        created_at
      FROM vendor_app_groups 
      WHERE app_grp_id=UUID_TO_BIN(?)`,
      [app_grp_id]
    );
  } catch (error) {
    console.log("error", error);
  } finally {
    await db.close();
    return appGroupsResult;
  }
};

export const addAppGroup = async ({
  user_id,
  vendor,
  form,
  size,
  name,
  email,
  pool_id
}) => {
  const db = makeDb();

  let result;
  try {
    if (vendor) {
      result = await db.query(
        `INSERT INTO vendor_app_groups(app_grp_id, user, vendor, size, name, pool_id)
        VALUES(UUID_TO_BIN(UUID()), UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?, ?)`,
        [user_id, vendor, size, name, pool_id]
      );
    }

    if (form) {
      result = await db.query(
        `INSERT INTO vendor_app_groups(app_grp_id, user, form, size, name, pool_id)
        VALUES(UUID_TO_BIN(UUID()), UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?, ?)`,
        [user_id, form, size, name, pool_id]
      );
    }
  } catch (error) {
    console.log("error", error);
  } finally {
    await db.close();
    return result;
  }
};

//app_grp_id
export const editAppGroup = async ({ app_grp_id, email, name, size }) => {
  const db = makeDb();
  let result;
  try {
    result = await db.query(
      `UPDATE vendor_app_groups SET size=?,name=? WHERE app_grp_id=UUID_TO_BIN(?) `,
      [size, name, app_grp_id]
    );
  } catch (error) {
    console.log("error", error);
  } finally {
    await db.close();
    return result;
  }
};

export const deleteAppGroup = async ({ app_grp_id, pool_id }) => {
  const db = makeDb();
  let result;
  try {
    if (pool_id) {
      result = await db.query(
        `DELETE FROM vendor_app_groups WHERE pool_id=? `,
        [pool_id]
      );
    } else if (app_grp_id) {
      result = await db.query(
        `DELETE FROM vendor_app_groups WHERE app_grp_id=UUID_TO_BIN(?) `,
        [app_grp_id]
      );
    }
  } catch (error) {
    console.log("error", error);
  } finally {
    await db.close();
    return result;
  }
};

export const getVendorName = async (vendor) => {
  const db = makeDb();

  let result;

  try {
    result = await db.query(
      `SELECT 
        name
      FROM vendor
      WHERE id=UUID_TO_BIN(?)`,
      [vendor]
    );

    if (result && result.length > 0) {
      result = result[0].name;
    }
  } catch (error) {
    console.log(error);
  } finally {
    await db.close();
    return result;
  }
};

export const getArchivedGroupByVendor = async (vendor) => {
  const db = makeDb();

  let result = [];

  try {
    result = await db.query(
      `SELECT BIN_TO_UUID(vendor_id) as vendor_id,
        BIN_TO_UUID(app_group_id) as app_group_id,
        app_group_type,
        archived_group_id
        FROM archived_groups
       WHERE vendor_id=UUID_TO_BIN(?)`,
      [vendor]
    );
  } catch (error) {
    console.log(error);
  } finally {
    await db.close();
    return result;
  }
};

export const addArchivedGroupByVendor = async (archivedGroup = []) => {
  const db = makeDb();

  let result = [];
  let currentArchivedGroups = null;
  try {
    if (archivedGroup.length > 0) {
      currentArchivedGroups = await getArchivedGroupByVendor(
        archivedGroup[0].vendor_id
      );
    }

    for (let archGroup of archivedGroup) {
      const isExist =
        currentArchivedGroups &&
        currentArchivedGroups.find(
          (grp) =>
            grp.vendor_id === archGroup.vendor_id &&
            grp.app_group_id === archGroup.app_group_id
        );

      if (!isExist) {
        await db.query(
          `INSERT INTO archived_groups(vendor_id,app_group_id, app_group_type)
        VALUES(UUID_TO_BIN(?), UUID_TO_BIN(?), ?)`,
          [
            archGroup.vendor_id,
            archGroup.app_group_id,
            archGroup.app_group_type,
          ]
        );
      }
    }

    if (archivedGroup.length > 0) {
      result = await getArchivedGroupByVendor(archivedGroup[0].vendor_id);
    }
  } catch (error) {
    console.log(error);
  } finally {
    await db.close();
    return result;
  }
};

export const deleteArchivedGroup = async (archivedroupIds = [], vendorId) => {
  const db = makeDb();
  let results = [];
  console.log('deleteArchivedGroup archivedroupIds', archivedroupIds)
  console.log('deleteArchivedGroup vendorId', vendorId)
  try {
    await db.query(
      `DELETE FROM archived_groups
       WHERE archived_group_id IN (${archivedroupIds.join(
        ","
      )}) AND vendor_id=UUID_TO_BIN(?)
      `,
      [vendorId]
    );

    results = await getArchivedGroupByVendor(vendorId);
    console.log('deleteArchivedGroup results', results)
  } catch (err) {
    console.log("Error deleteArchivedGroup", err);
    return [];
  } finally {
    await db.close();
    return results;
  }
};

export const createGroupReminder = async ({
  vendor,
  form,
  date_reminder,
  is_customForm,
  fields,
  form_name
}) => {
  const db = makeDb();
  let result;

  try {
    const addGroupReminder = await db.query(
      `
        INSERT INTO vendor_reminder(
          vendor_reminder_id,
          vendor,
          form,
          date_reminder,
          is_customform,
          fields,
          form_name
        ) VALUES (
          UUID_TO_BIN(UUID()),
          UUID_TO_BIN(?),
          ${form ? `UUID_TO_BIN(?)` : `?`},
          ?,?,?,?
        )
      `,
      [
        vendor,
        form,
        date_reminder,
        is_customForm,
        fields,
        form_name
      ]
    )

    const lastId = addGroupReminder.insertId;

    let reminder = await db.query(
      `SELECT (BIN_TO_UUID(vendor_reminder_id)) as vendor_reminder_id 
        FROM vendor_reminder
        WHERE id=?`,
      [lastId]
    );

    result = reminder.length > 0 ? reminder[0] : "";

  } catch (err) {
    console.log('err', err);
    result = false;
  } finally {
    db.close();
    return result;
  }
}

export const getGroupReminderByCurrentDate = async () => {
  const db = makeDb();
  let result;
  const currentDate = moment().format('YYYY-MM-DD');
  console.log('currentDate', currentDate);
  try {
    let vendorReminders = await db.query(
      `
        SELECT
          id,
          BIN_TO_UUID(vendor_reminder_id) as vendor_reminder_id,
          BIN_TO_UUID(vendor) as vendor,
          BIN_TO_UUID(form) as form,
          date_reminder,
          is_customform,
          fields
        FROM vendor_reminder 
        WHERE date_reminder = ? AND active = 1
      `,
      [currentDate]
    )

    for (let vr of vendorReminders) {
      vr.app_groups = await getAppGroupReminderByVendorReminder(vr.vendor_reminder_id);
    }

    result = vendorReminders;

  } catch (err) {
    console.log('err', err);
    result = [];
  } finally {
    db.close();
    return result;
  }
}

export const updateGroupReminderStatus = async ({
  vendor_reminder_id,
  active
}) => {
  const db = makeDb();
  let result;
  try {
    result = await db.query(
      `UPDATE vendor_reminder 
      SET active=?
      WHERE vendor_reminder_id=UUID_TO_BIN(?) `,
      [active, vendor_reminder_id]
    );
  } catch (error) {
    console.log("error", error);
  } finally {
    await db.close();
    return result;
  }
}

export const getVendorApplicationReminder = async vendor => {
  const db = makeDb();
  let result;

  try {
    let vendorReminders = await db.query(
      `
        SELECT
          id,
          BIN_TO_UUID(vendor_reminder_id) as vendor_reminder_id,
          BIN_TO_UUID(vendor) as vendor,
          BIN_TO_UUID(form) as form,
          form_name,
          date_reminder,
          is_customform,
          fields,
          active
        FROM vendor_reminder 
        WHERE vendor=UUID_TO_BIN(?)
        ORDER BY id DESC
      `,
      [vendor]
    )

    for (let vr of vendorReminders) {
      vr.app_groups = await getAppGroupReminderByVendorReminder(vr.vendor_reminder_id);
    }

    result = vendorReminders;
  } catch (err) {
    console.log('getVendorApplicationReminder err', err);
    result = [];
  } finally {
    db.close();
    return result;
  }
}

export const getAppGroupReminderByVendorReminder = async vendor_reminder => {
  const db = makeDb();
  let result;
  try {

    let appGroups = [];
    let grs = await db.query(
      `
        SELECT
          id,
          BIN_TO_UUID(group_vendor_reminder_id) as group_vendor_reminder_id,
          BIN_TO_UUID(app_group) as app_group,
          BIN_TO_UUID(vendor_reminder) as vendor_reminder
        FROM group_vendor_reminder 
        WHERE vendor_reminder=UUID_TO_BIN(?)
      `,
      [vendor_reminder]
    )

    for (let gr of grs) {

      let appGroup = await db.query(
        `
          SELECT
            BIN_TO_UUID(app_grp_id) as app_grp_id,
            name
          FROM vendor_app_groups
          WHERE app_grp_id=UUID_TO_BIN(?)
        `,
        [gr.app_group]
      )

      console.log('appGroup', appGroup);

      appGroup = appGroup.length > 0 ? appGroup[0] : {};

      if (appGroup && appGroup.app_grp_id)
        appGroups.push(appGroup);
    }

    result = appGroups;
  } catch (err) {
    console.log('getAppGroupReminderByVendorReminder err', err);
    result = [];
  } finally {
    db.close();
    console.log('result', result);
    return result;
  }
}

export const createAppGroupReminder = async ({
  app_group,
  vendor_reminder
}) => {
  const db = makeDb();
  let result;

  try {
    result = await db.query(
      `
        INSERT INTO group_vendor_reminder(
          group_vendor_reminder_id,
          app_group,
          vendor_reminder
        ) VALUES (
          UUID_TO_BIN(UUID()),
          UUID_TO_BIN(?),
          UUID_TO_BIN(?)
        )
      `,
      [
        app_group,
        vendor_reminder
      ]
    )

  } catch (err) {
    console.log('err', err);
    result = {};
  } finally {
    db.close();
    return result;
  }
}

export const updateLogo = async ({
  vendor_id,
  logo = ''
}) => {


  const db = makeDb();

  try {
    const buf = logo && logo !== '' ? Buffer.from(
      logo.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    ) : null;
    const s3Payload = logo && logo !== '' ? {
      Bucket: currentS3BucketName,
      Key: `logo/${vendor_id}/logo-${vendor_id}.png`,
      Body: buf,
      ContentEncoding: "base64",
      ContentType: "image/png",
      ACL: "public-read"
    } : {};

    if (logo && logo !== '') {
      await uploadFile(s3Payload);
    }

    await db.query(
      `UPDATE vendor SET 
      logo=?
      WHERE id=UUID_TO_BIN(?)`,
      [
        s3Payload?.Key || '',
        vendor_id
      ]
    );

    let vendors = await getVendors();
    vendors = vendors.find((vendor) => {
      return vendor_id == vendor.id;
    });

    let vendor = vendors ? vendors : null;
    vendor.logo = vendor.logo
      ? `${s3BucketRootPath}${vendor.logo}`
      : null;
    return vendor;

  } catch (err) {
    console.log(err);
  } finally {
    await db.close();
  }
};


export const setDefaultVendor = async ({
  user_id,
  vendor_id
}) => {
  const db = makeDb();
  let vendors = [];
  console.log('useridddd', user_id)
  console.log('useridddd vendor_id', vendor_id)
  try {

    if (vendor_id) {
      await db.query(`UPDATE vendor
        SET is_default = CASE
        WHEN id=UUID_TO_BIN(?) THEN 1
        ELSE 0
        END
        WHERE user=UUID_TO_BIN(?);
      `,
        [vendor_id, user_id]
      );
    }
    else {
      await db.query(`UPDATE vendor
        SET is_default = 0
        WHERE user=UUID_TO_BIN(?);
      `,
        [user_id]
      );
    }



    const response = await db.query(`    
      SELECT 
        BIN_TO_UUID(v.id) as id, 
        BIN_TO_UUID(v.user) as user,
        BIN_TO_UUID(v.user) as vendor_user,
        v.id2,
        v.name, 
        v.section1_text,
        v.section2_text,
        v.section3_text,
        v.section1_name,
        v.section2_name,
        v.section3_name,
        v.section1_show,
        v.section2_show,
        v.section3_show,
        v.created_at as created_at,
        v.is_daycare,
        v.logo,
        v.is_default
      FROM vendor v
      WHERE v.user=UUID_TO_BIN(?)
      ORDER BY v.id2 ASC
    `,
      [user_id]
    );

    vendors = response;

  }
  catch (error) {
    console.log('Vendor Default Error', error)
    return []
  } finally {
    await db.close();
    return vendors
  }

}

