import { makeDb } from "../../helpers/database";

import { getUserGroups } from "../../api/groups";

import { sort, distinct } from "../../helpers/array"

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
        section3_show
        FROM vendor`
    );
    return result;
  } catch (error) {
    console.log(error);
  } finally {
    await db.close();
  }
};

export const getVendorsIdByUser = async user => {
  const db = makeDb();
  let result;
  let vendors = [];

  try {
    result = await db.query(
      `
        SELECT 
          DISTINCT BIN_TO_UUID(id) as id
        FROM vendor 
        WHERE user=UUID_TO_BIN(?)
      `,
      [user]
    );

    if(result.length > 0) {vendors.push(...result)}

    result = await db.query(
      `
        SELECT 
          DISTINCT BIN_TO_UUID(vendor) as id
        FROM vendor_admin
        WHERE user=UUID_TO_BIN(?)
      `,
      [user]
    );

    if(result.length > 0) {vendors.push(...result)}

  } catch(err) {
    console.log("error", error);
  } finally {
    await db.close();
    return vendors;
  }
}

export const getVendorsByUserId = async user => {
  const db = makeDb();
  let result;

  let vendors = [];
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
        v.section3_show
      FROM vendor v
      WHERE v.user=UUID_TO_BIN(?)`,
      [user]
    );

    if (result && result.length > 0) {
      for(let i = 0; i < result.length; i++) {
        result[i].app_programs = await getVendorAppProgram(result[i].id);
        result[i].location_sites = await getVendorAppLocationSite(result[i].id);
        vendors.push(result[i]);
      }
    }

    result = await db.query(
      `
        SELECT 
          BIN_TO_UUID(v.id) as id, 
          BIN_TO_UUID(va.user) as user,
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
          v.section3_show
        FROM vendor v, vendor_admin va
        WHERE va.user = UUID_TO_BIN(?) AND va.vendor = v.id
      `,
      [user]
    );

    if (result && result.length > 0) {
      for(let i = 0; i < result.length; i++) {
        result[i].app_programs = await getVendorAppProgram(result[i].id);
        result[i].location_sites = await getVendorAppLocationSite(result[i].id);
        vendors.push(result[i]);
      }
    }
    
  } catch (error) {
    console.log(error);
  } finally {
    await db.close();
    return vendors;
  }
};

export const getVendorById2 = async id2 =>  {
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
        v.section3_show
      FROM vendor v
      WHERE v.id2=?`,
      [id2]
    );

    if (result && result.length > 0) {
      for(let i = 0; i < result.length; i++) {
        result[i].app_programs = []
        result[i].location_sites = []
      }
    }

  } catch (error) {
    console.log(error);
  } finally {
    await db.close();
    return result;
  }
}

export const checkIfAdminVendorExists = async ({
  user,
  vendor
}) => {
  const db = makeDb();

  try {
    const rows = await db.query(
      `SELECT 
        BIN_TO_UUID(vendor) as vendor 
      FROM vendor_admin
      WHERE user=UUID_TO_BIN(?) AND vendor=UUID_TO_BIN(?)`,
      [user, vendor]
    );

    if(rows.length > 0) {
      return {
        is_exists: true
      }
    }

    return {
      is_exists: false
    }
  } catch (error) {
    console.log("error update admin", error);
  } finally {
    await db.close();
  }
}

export const updateVendorAdmins = async ({
  user,
  vendor,
  name
}) => {
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
}

export const addVendorAdmins = async ({
  user,
  vendor,
  name
}) => {
  const db = makeDb();
  let result;
  try {
    result = await db.query(
      `INSERT INTO vendor_admin(id, user, vendor, name)
      VALUES(UUID_TO_BIN(UUID()), UUID_TO_BIN(?), UUID_TO_BIN(?), ?)`,
      [user, vendor, name]
    );
  } catch (error) {
    console.log("error", error);
  } finally {
    await db.close();
    return result;
  }
}

export const deleteVendorAdmins = async ({
  user,
  vendor
}) => {
  const db = makeDb();
  let result;
  try {
    result = await db.query(
      `DELETE FROM vendor_admin WHERE user=UUID_TO_BIN(?) AND vendor=UUID_TO_BIN(?)`,
      [user, vendor]
    )
  } catch (error) {
    console.log("delete admin error", error);
  } finally {
    await db.close();
    return result;
  }
}

export const getVendorAdmins = async (vendor) => {
  const db = makeDb();
  let result;
  let admins = [];
  try {
    // result = await db.query(
    //   `
    //     SELECT 
    //       BIN_TO_UUID(v.id) as vendor, 
    //       BIN_TO_UUID(u.id) as user,
    //       v.name as vendorName,
    //       u.email
    //     FROM vendor v, users u
    //     WHERE v.id = UUID_TO_BIN(?) AND u.id = v.user
    //     ORDER BY v.name ASC
    //   `,
    //   [vendor]
    // );

    // if(result.length > 0) {
    //   for(let item of result) {
    //     item.isOwner = true;
    //     admins.push(item);
    //   }
    // }

    result = await db.query(
      `
        SELECT 
          BIN_TO_UUID(v.id) as vendor, 
          BIN_TO_UUID(va.user) as user,
          va.name,
          v.name as vendorName,
          u.email
        FROM vendor v, users u, vendor_admin va
        WHERE va.vendor = UUID_TO_BIN(?) AND v.id = UUID_TO_BIN(?) AND va.vendor = v.id AND va.user = u.id
        ORDER BY va.name ASC
      `,
      [vendor, vendor]
    );

    if(result.length > 0) {
      for(let item of result) {
        item.isOwner = false;
        admins.push(item);
      }
    }

    admins = sort(admins, "name");

  } catch (error) {
    console.log("error", error);
  } finally {
    await db.close();
    return admins;
  }
}

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
      VALUES(UUID_TO_BIN(UUID()), UUID_TO_BIN(?))
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
  section3_show
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
        id
      ]
    );

    let vendors = await getVendors();
    vendors = vendors.filter(vendor => {
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

export const getVendorAppGroups = async user_id => {
  const db = makeDb();

  let appGroupsResult = [];
  try {
    appGroupsResult = await db.query(
      `SELECT 
        id, 
        BIN_TO_UUID(app_grp_id) as app_grp_id, 
        BIN_TO_UUID(user) as user, 
        BIN_TO_UUID(vendor) as vendor, 
        size, 
        name, 
        created_at 
      FROM vendor_app_groups 
      WHERE user=UUID_TO_BIN(?)`,
      [user_id]
    );
  } catch (error) {
    console.log("error", error);
  } finally {
    await db.close();
    return appGroupsResult;
  }
};

export const getVendorAppGroupsByVendorId = async vendor => {
  const db = makeDb();

  let appGroupsResult = [];
  try {
    appGroupsResult = await db.query(
      `SELECT 
        id, 
        BIN_TO_UUID(app_grp_id) as app_grp_id, 
        BIN_TO_UUID(user) as user, 
        BIN_TO_UUID(vendor) as vendor, 
        size, 
        name, 
        created_at 
      FROM vendor_app_groups 
      WHERE vendor=UUID_TO_BIN(?)`,
      [vendor]
    );
  } catch (error) {
    console.log("error", error);
  } finally {
    await db.close();
    return appGroupsResult;
  }
};

export const addAppGroup = async ({ user_id, vendor, size, name, email }) => {
  const db = makeDb();

  let result;
  try {
    result = await db.query(
      `INSERT INTO vendor_app_groups(app_grp_id, user, vendor, size, name)
      VALUES(UUID_TO_BIN(UUID()), UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?)`,
      [user_id, vendor, size, name]
    );
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

export const deleteAppGroup = async ({ id }) => {
  console.log("INSIDE DELETE APP GROUP ID", id);
  const db = makeDb();
  let result;
  try {
    result = await db.query(
      `DELETE FROM vendor_app_groups WHERE app_grp_id=UUID_TO_BIN(?) `,
      [id]
    );
  } catch (error) {
    console.log("error", error);
  } finally {
    await db.close();
    return result;
  }
};

export const getVendorName = async vendor => {
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
