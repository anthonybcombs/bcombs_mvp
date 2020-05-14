import fetch from "node-fetch";
import { makeDb } from "../../helpers/database";
import randomColor from "../../helpers/randomColor";
import {
  currentS3BucketName,
  s3Bucket,
  s3BucketRootPath,
} from "../../helpers/aws";
import { getUserInfo } from "../users/";

export const getCalendars = async (creds) => {
  const db = makeDb();
  try {
    const UserInfo = await getUserInfo(creds);
    const rows = await db.query(
      "SELECT BIN_TO_UUID(id) as id,BIN_TO_UUID(user_id) as user_id,name,color,visibilityType from user_calendars WHERE BIN_TO_UUID(user_id)=?",
      [UserInfo.user_id]
    );
    const calendars = [];
    rows.forEach((calendar) => {
      calendar.image = `https://bcombs-dev.s3.amazonaws.com/calendars/${calendar.user_id}/${calendar.id}/calendarBackground.jpg`;
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
  } finally {
    await db.close();
  }
};
export const executeCreateCalendar = async (calendar) => {
  const db = makeDb();
  try {
    const UserInfo = await getUserInfo(calendar.creds);
    await db.query(
      "INSERT IGNORE INTO user_calendars (id,user_id,name,color,visibilityType) VALUES(UUID_TO_BIN(UUID()),UUID_TO_BIN(?),?,?,?)",
      [
        UserInfo.user_id,
        calendar.info.name,
        await randomColor(UserInfo),
        calendar.info.visibilityType,
      ]
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
    const buf = Buffer.from(
      calendar.info.image.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
    var data = {
      Bucket: currentS3BucketName,
      Key: `calendars/${UserInfo.user_id}/${insertedCalendar[0].id}/calendarBackground.jpg`,
      Body: buf,
      ContentEncoding: "base64",
      ContentType: "image/jpeg",
      ACL: "public-read",
    };
    s3Bucket.putObject(data, function (err, data) {
      if (err) {
        console.log(err);
        console.log("Error uploading data: ", data);
      } else {
        console.log("succesfully uploaded the image!");
      }
    });
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
        visibilityType: calendar.info.visibilityType,
        image: `https://bcombs-dev.s3.amazonaws.com/calendars/${UserInfo.user_id}/${insertedCalendar.id}/calendarBackground.jpg`,
      },
    };
  } catch (error) {
    return {
      status: {
        messageType: "error",
        message: "there is an issue in create calendar endpoint",
      },
      calendar: {},
    };
  } finally {
    await db.close();
  }
};
export const executeEditCalendar = async (calendar) => {
  const db = makeDb();
  try {
    const UserInfo = await getUserInfo(calendar.creds);
    await db.query(
      "UPDATE user_calendars set user_id=UUID_TO_BIN(?),name=?,color=?,visibilityType=? where id=?",
      [
        UserInfo.user_id,
        calendar.info.name,
        calendar.info.color,
        calendar.info.visibilityType,
        calendar.id,
      ]
    );
  } catch (error) {
    console.log(error);
  } finally {
    await db.close();
  }
};
