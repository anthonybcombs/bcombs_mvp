import randomColor from "randomcolor";
import { makeDb } from "./database";
export default async (UserInfo) => {
  const db = makeDb();
  const color = randomColor();
  try {
    while (true) {
      const rows = await db.query(
        "SELECT BIN_TO_UUID(id) as id from user_calendars WHERE BIN_TO_UUID(user_id)=? AND color=?",
        [UserInfo.user_id, color]
      );
      if (rows.length === 0) {
        return color;
        break;
      }
    }
  } catch (error) {
    console.log(error);
    return color;
  }
};
