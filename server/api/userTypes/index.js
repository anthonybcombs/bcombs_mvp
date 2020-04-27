import { makeDb } from "../../helpers/database";

export const getUserTypes = async () => {
  const db = makeDb();
  const result = [];
  try {
    const userTypes = await db.query(
      "SELECT BIN_TO_UUID(ID) as id,name FROM user_types"
    );
    userTypes.forEach((userType) => {
      result.push({ id: userType.id, name: userType.name });
    });
    return result;
  } catch (error) {
  } finally {
    await db.close();
  }
};
