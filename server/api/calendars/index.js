import fetch from "node-fetch";
import { makeDb } from "../../helpers/database";
import { s3BucketRootPath } from "../../helpers/aws";
import { getUserInfo } from "../users/";

export const executeCreateCalendar = async (calendar) => {
  try {
    const UserInfo = await getUserInfo(calendar.creds);
    await db.query(
      "INSERT IGNORE INTO user_calendars (id,user_id,image,name) VALUES(UUID_TO_BIN(UUID()),UUID_TO_BIN(?),?,?)",
      [id, UserInfo.info.user_id, calendarInfo.name]
    );
  } catch (error) {
    return error;
  }
};
