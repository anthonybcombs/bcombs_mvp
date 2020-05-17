import { makeDb } from "../../helpers/database";
import client, { getRedisKey } from "../../services/redis";
export const getUserTypes = async () => {
  const db = makeDb();
  const result = [];
  try {
    let userTypes;
    const userTypesCache = JSON.parse(await getRedisKey("userTypes"));
    if (userTypesCache === null) {
      userTypes = await db.query(
        "SELECT BIN_TO_UUID(ID) as id,name FROM user_types"
      );
      client.set("userTypes", JSON.stringify(userTypes));
      client.EXPIRE(["userTypes", "5"]);
    } else {
      userTypes = userTypesCache;
    }
    userTypes.forEach((userType) => {
      result.push({ id: userType.id, name: userType.name });
    });
    return result;
  } catch (error) {
    console.log(error);
  } finally {
    await db.close();
  }
};
