import fetch from "node-fetch";
import { makeDb } from "../../helpers/database";
import { s3BucketRootPath } from "../../helpers/aws";
import { getUserInfo } from "../users/";

export const executeCreateCalendar = async (calendar) => {
  const db = makeDb();
  try {
    const UserInfo = await getUserInfo(calendar.creds);

    await db.query(
      "INSERT IGNORE INTO user_calendars (id,user_id,image,name) VALUES(UUID_TO_BIN(UUID()),UUID_TO_BIN(?),?,?)",
      [UserInfo.user_id, "", calendar.info.name]
    );
    calendar.info.familyMembers.forEach(async (familyMemberId) => {
      console.log(familyMemberId);
      await db.query(
        "INSERT INTO user_calendars_family_member(calendar_id,family_member_id) VALUES(UUID_TO_BIN(?),UUID_TO_BIN(?))",
        [UserInfo.user_id, familyMemberId]
      );
    });
    const insertedCalendar = await db.query(
      "SELECT BIN_TO_UUID(id) as id from user_calendars where user_id=UUID_TO_BIN(?) AND name=?",
      [UserInfo.user_id, calendar.info.name]
    );
    return {
      status: {
        messageType: "info",
        message: "calendar Created",
      },
      info: {
        id: insertedCalendar[0].id,
        user_id: UserInfo.user_id,
        name: calendar.info.name,
      },
    };
  } catch (error) {
    return {
      status: {
        messageType: "error",
        message: "there is an issue in create calendar endpoint",
      },
      info: {},
    };
  }
};
