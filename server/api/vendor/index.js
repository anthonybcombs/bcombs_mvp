import { makeDb } from "../../helpers/database";

export const getVendors = async () => {
  const db = makeDb();
  const result = [];
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
        from vendor`
    );
    return result;
  } catch (error) {
  } finally {
    await db.close();
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
