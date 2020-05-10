import { makeDb } from "../../helpers/database";
import { getUserFromDatabase } from "../index";

export const createNewEvent = async ({
  id,
  name,
  description,
  status,
  type,
  start_of_event,
  end_of_event,
  time,
  location,
  auth_email,
  guests = []
}) => {
  const db = makeDb();
  let result = {};
  try {
    const currentUser = await getUserFromDatabase(auth_email);
    await db.query(
      `INSERT INTO events(
        id,
        name,
        description,
        status,
        type,
        start_of_event,
        end_of_event,
        time,
        location,
        user_id ) VALUES (UUID_TO_BIN(?),?,?,?,?,?,?,?,?,UUID_TO_BIN(?))`,
      [
        id,
        name,
        description,
        status,
        type,
        start_of_event,
        end_of_event,
        time,
        location,
        currentUser.id
      ]
    );

    if (guests.length > 0) {
      let groupMemberValuesQuery = guests.reduce((accumulator, userId) => {
        accumulator += `(UUID_TO_BIN("${id}"),UUID_TO_BIN("${userId}"),"Pending"),`;
        return accumulator;
      }, "");

      groupMemberValuesQuery = groupMemberValuesQuery.substring(
        0,
        groupMemberValuesQuery.length - 1
      );

      await db.query(
        "INSERT IGNORE INTO `event_attendee`(`event_id`,`user_id`,`status`) VALUES " +
          groupMemberValuesQuery
      );
    }

    result = {
      id,
      name
    };
  } catch (err) {
    console.log("createNewEvent error", err);
  } finally {
    await db.close();
    return result;
  }
};

export const getUserEvents = async email => {
  const db = makeDb();
  let result = [];
  try {
    const currentUser = await getUserFromDatabase(email);
    const rows = await db.query(
      `SELECT 
        BIN_TO_UUID(id) as id,
        name,
        description,
        status,
        type,
        start_of_event,
        end_of_event,
        location  
      from events WHERE user_id = UUID_TO_BIN(?)`,
      [currentUser.id]
    );
    console.log("Get User Events", rows);
    result = rows;
  } catch (err) {
    console.log("getUserEvents error", err);
  } finally {
    db.close();
    return result;
  }
};
