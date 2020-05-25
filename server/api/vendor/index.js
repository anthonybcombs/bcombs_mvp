import { makeDb } from "../../helpers/database";

export const getVendors = async () => {
  const db = makeDb();
  try {
    const result = await db.query(
      `SELECT 
        BIN_TO_UUID(id) as id, 
        BIN_TO_UUID(user) as user, 
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

export const addVendor = async ({
  user
}) => {
  const db = makeDb();
  let result;
  let vendor;
  try {
    result = await db.query(
      `INSERT INTO vendor(id, user)
      VALUES(UUID_TO_BIN(UUID()), UUID_TO_BIN(?))
      `,
      [user]
    );

    vendor = await db.query(
      `SELECT 
        BIN_TO_UUID(id) as id, 
        BIN_TO_UUID(user) as user, 
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
        FROM vendor WHERE user=?`, [user]);
    vendor = vendor.length > 0 ? vendor[0]: "";
  } catch(err) {
    console.log(err);
  } finally {
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
    vendors = vendors.filter((vendor) => {
      return id == vendor.id
    });

    const vendor = (vendors.length > 0) ? vendors[0] : null;

    return vendor;

  } catch(err) {
    console.log(err);
  } finally {
    await db.close();
  }
}
