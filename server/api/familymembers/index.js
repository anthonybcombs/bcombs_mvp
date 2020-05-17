import { makeDb } from "../../helpers/database";
import { getUserInfo } from "../users/";
export const getFamilyMembers = async (creds) => {
  const db = makeDb();
  let result;
  try {
    const UserInfo = await getUserInfo(creds);
    const rows = await db.query(
      "SELECT BIN_TO_UUID(id) as id,BIN_TO_UUID(user_id) as user_id,first_name as firstname,last_name as lastname,gender,family_relationship as familyrelationship,birth_date as dateofbirth,zip_code as zipcode,type,added_at from family_members where user_id=UUID_TO_BIN(?)",
      [UserInfo.user_id]
    );
    console.log(rows);
    result = rows;
  } catch (error) {
    console.log(error);
  } finally {
    await db.close();
    return result;
  }
};
