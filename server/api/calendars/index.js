import isBase64 from "is-base64";
import { makeDb } from "../../helpers/database";
import randomColor from "../../helpers/randomColor";
import {
  currentS3BucketName,
  uploadFile,
  s3BucketRootPath,
} from "../../helpers/aws";
import { getUserInfo } from "../users/";
export const getCalendar = async ({ id }) => {
  const db = makeDb();
  try {
    const calendarRows = await db.query(
      "SELECT BIN_TO_UUID(id) as id,BIN_TO_UUID(user_id) as user_id,name,color,visibilityType,updated_at from user_calendars WHERE BIN_TO_UUID(id)=? AND visibilityType=?",
      [id, "Public"]
    );
    const calendars = await new Promise((resolve, reject) => {
      const calendars = [];
      calendarRows.forEach(async (calendar) => {
        const db1 = makeDb();
        try {
          const calendarFamilyMembers = await db1.query(
            "SELECT BIN_TO_UUID(family_member_id) as family_member_id FROM user_calendars_family_member WHERE calendar_id=UUID_TO_BIN(?)",
            [calendar.id]
          );
          const calendarGroups = await db1.query(
            "SELECT BIN_TO_UUID(group_id) as group_id FROM user_calendars_groups WHERE calendar_id=UUID_TO_BIN(?)",
            [calendar.id]
          );
          const user = await db1.query(
            "SELECT email FROM users WHERE id=UUID_TO_BIN(?)",
            calendar.user_id
          );
          calendar.familyMembers = calendarFamilyMembers.map((familyMember) => {
            return familyMember.family_member_id;
          });
          calendar.groups = calendarGroups.map((group) => {
            return group.group_id;
          });
          calendar.email = user[0].email;
          calendar.image = `${s3BucketRootPath}calendars/${calendar.user_id}/${calendar.id}/calendarBackground.jpg`;
          calendars.push(calendar);
        } catch (error) {
          reject([]);
        } finally {
          resolve(calendars.sort((a, b) => b.updated_at - a.updated_at));
          await db1.close();
        }
      });
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
export const getCalendars = async (creds) => {
  const db = makeDb();
  try {
    const UserInfo = await getUserInfo(creds);
    const calendarRows = await db.query(
      "SELECT BIN_TO_UUID(id) as id,BIN_TO_UUID(user_id) as user_id,name,color,visibilityType,updated_at from user_calendars WHERE BIN_TO_UUID(user_id)=?",
      [UserInfo.user_id]
    );
    const calendars = await new Promise((resolve, reject) => {
      const calendars = [];
      calendarRows.forEach(async (calendar) => {
        const db1 = makeDb();
        try {
          const calendarFamilyMembers = await db1.query(
            "SELECT BIN_TO_UUID(family_member_id) as family_member_id FROM user_calendars_family_member WHERE calendar_id=UUID_TO_BIN(?)",
            [calendar.id]
          );
          const calendarGroups = await db1.query(
            "SELECT BIN_TO_UUID(group_id) as group_id FROM user_calendars_groups WHERE calendar_id=UUID_TO_BIN(?)",
            [calendar.id]
          );
          calendar.familyMembers = calendarFamilyMembers.map((familyMember) => {
            return familyMember.family_member_id;
          });
          calendar.groups = calendarGroups.map((group) => {
            return group.group_id;
          });
          calendar.image = `${s3BucketRootPath}calendars/${calendar.user_id}/${calendar.id}/calendarBackground.jpg`;
          calendars.push(calendar);
        } catch (error) {
          reject([]);
        } finally {
          resolve(calendars.sort((a, b) => b.updated_at - a.updated_at));
          await db1.close();
        }
      });
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
        message: "there is an issue in get calendars endpoint",
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
    const insertedCalendar = await db.query(
      "SELECT BIN_TO_UUID(id) as id,color from user_calendars where user_id=UUID_TO_BIN(?) AND name=?",
      [UserInfo.user_id, calendar.info.name]
    );

    calendar.info.familyMembers.forEach(async (familyMemberId) => {
      if (familyMemberId !== "0") {
        await db.query(
          "INSERT INTO user_calendars_family_member(calendar_id,family_member_id) VALUES(UUID_TO_BIN(?),UUID_TO_BIN(?))",
          [insertedCalendar[0].id, familyMemberId]
        );
      }
    });
    calendar.info.groups.forEach(async (groupId) => {
      await db.query(
        "INSERT INTO user_calendars_groups(calendar_id,group_id) VALUES(UUID_TO_BIN(?),UUID_TO_BIN(?))",
        [insertedCalendar[0].id, groupId]
      );
    });
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
    await uploadFile(data);
    return {
      status: {
        messageType: "info",
        message: "calendar created",
      },
      calendar: {
        id: insertedCalendar[0].id,
        user_id: UserInfo.user_id,
        name: calendar.info.name,
        color: insertedCalendar[0].color,
        visibilityType: calendar.info.visibilityType,
        image: `${s3BucketRootPath}calendars/${UserInfo.user_id}/${insertedCalendar[0].id}/calendarBackground.jpg`,
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
      "UPDATE user_calendars set user_id=UUID_TO_BIN(?),name=?,color=?,visibilityType=? WHERE id=UUID_TO_BIN(?)",
      [
        UserInfo.user_id,
        calendar.info.name,
        calendar.info.color,
        calendar.info.visibilityType,
        calendar.info.id,
      ]
    );
    await db.query(
      "DELETE FROM user_calendars_family_member WHERE calendar_id=UUID_TO_BIN(?)",
      [calendar.info.id]
    );
    await db.query(
      "DELETE FROM user_calendars_groups WHERE calendar_id=UUID_TO_BIN(?)",
      [calendar.info.id]
    );
    if (calendar.info.familyMembers.length > 0) {
      calendar.info.familyMembers.forEach(async (familyMemberId) => {
        if (familyMemberId !== "0") {
          await db.query(
            "INSERT INTO user_calendars_family_member(calendar_id,family_member_id) VALUES(UUID_TO_BIN(?),UUID_TO_BIN(?))",
            [calendar.info.id, familyMemberId]
          );
        }
      });
    }
    if (calendar.info.groups.length > 0) {
      calendar.info.groups.forEach(async (groupId) => {
        await db.query(
          "INSERT INTO user_calendars_groups(calendar_id,group_id) VALUES(UUID_TO_BIN(?),UUID_TO_BIN(?))",
          [calendar.info.id, groupId]
        );
      });
    }
    if (isBase64(calendar.info.image, { mimeRequired: true })) {
      const buf = Buffer.from(
        calendar.info.image.replace(/^data:image\/\w+;base64,/, ""),
        "base64"
      );
      var data = {
        Bucket: currentS3BucketName,
        Key: `calendars/${UserInfo.user_id}/${calendar.info.id}/calendarBackground.jpg`,
        Body: buf,
        ContentEncoding: "base64",
        ContentType: "image/jpeg",
        ACL: "public-read",
      };
      await uploadFile(data);
    }
    return {
      status: {
        messageType: "info",
        message: "calendar updated",
      },
      calendar: {
        id: calendar.info.id,
        user_id: UserInfo.user_id,
        name: calendar.info.name,
        color: calendar.info.color,
        visibilityType: calendar.info.visibilityType,
        image: `${s3BucketRootPath}calendars/${UserInfo.user_id}/${
          calendar.info.id
        }/calendarBackground.jpg?${Date.now()}`,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      message: "there is an issue in edit calendar endpoint.",
      calendar: {},
    };
  } finally {
    await db.close();
  }
};

export const executeDeleteCalendar = async (calendar) => {
  const db = makeDb();
  try {
    const UserInfo = await getUserInfo(calendar.creds);
    await db.query(
      "DELETE FROM user_calendars WHERE id=UUID_TO_BIN(?)",
      calendar.info.id
    );
    await db.query(
      "DELETE FROM user_calendars_family_member WHERE calendar_id=UUID_TO_BIN(?)",
      [calendar.info.id]
    );
    return {
      status: {
        messageType: "info",
        message: "calendar deleted",
      },
      calendar: {
        id: calendar.info.id,
        user_id: UserInfo.user_id,
        name: calendar.info.name,
        color: calendar.info.color,
        visibilityType: calendar.info.visibilityType,
        image: calendar.info.image,
      },
    };
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      message: "there is an issue in delete calendar endpoint.",
      calendar: {},
    };
  } finally {
    await db.close();
  }
};
