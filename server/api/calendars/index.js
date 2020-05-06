import fetch from "node-fetch";
import { makeDb } from "../../helpers/database";
import randomColor from "../../helpers/randomColor";
import { s3BucketRootPath } from "../../helpers/aws";
import { getUserInfo } from "../users/";

export const getCalendars = async (creds) => {
  const db = makeDb();
  try {
    const UserInfo = await getUserInfo(creds);
    const rows = await db.query(
      "SELECT BIN_TO_UUID(id) as id,BIN_TO_UUID(user_id) as user_id,name,image,color from user_calendars WHERE BIN_TO_UUID(user_id)=?",
      [UserInfo.user_id]
    );
    const calendars = [];
    rows.forEach((calendar) => {
      if (calendar.image.length === 0) {
        calendar.image = "https://picsum.photos/200";
      }
      calendars.push(calendar);
    });
    return {
      status: {
        messageType: "info",
        message: "calendars rendered",
      },
      data: calendars,
    };
  } catch (error) {
    return {
      status: {
        messageType: "error",
        message: "there is an issue in get calendar endpoint",
      },
      data: [],
    };
  }
};
export const executeCreateCalendar = async (calendar) => {
  const db = makeDb();
  try {
    const UserInfo = await getUserInfo(calendar.creds);
    await db.query(
      "INSERT IGNORE INTO user_calendars (id,user_id,image,name,color) VALUES(UUID_TO_BIN(UUID()),UUID_TO_BIN(?),?,?,?)",
      [UserInfo.user_id, "", calendar.info.name, await randomColor(UserInfo)]
    );
    calendar.info.familyMembers.forEach(async (familyMemberId) => {
      if (familyMemberId !== "0") {
        await db.query(
          "INSERT IGNORE INTO user_calendars_family_member(calendar_id,family_member_id) VALUES(UUID_TO_BIN(?),UUID_TO_BIN(?))",
          [UserInfo.user_id, familyMemberId]
        );
      }
    });
    const insertedCalendar = await db.query(
      "SELECT BIN_TO_UUID(id) as id,color from user_calendars where user_id=UUID_TO_BIN(?) AND name=?",
      [UserInfo.user_id, calendar.info.name]
    );
    return {
      status: {
        messageType: "info",
        message: "calendar Created",
      },
      calendar: {
        id: insertedCalendar[0].id,
        user_id: UserInfo.user_id,
        name: calendar.info.name,
        color: insertedCalendar[0].color,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      status: {
        messageType: "error",
        message: "there is an issue in create calendar endpoint",
      },
      calendar: {},
    };
  }
};
