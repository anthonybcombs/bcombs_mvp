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
  calendar_ids = [],
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
        user_id, date_added ) VALUES (UUID_TO_BIN(?),?,?,?,?,?,?,?,?,UUID_TO_BIN(?),NOW())`,
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
      let eventAttendeesValueQuery = guests.reduce((accumulator, userId) => {
        accumulator += `(UUID_TO_BIN("${id}"),UUID_TO_BIN("${userId}"),"Pending"),`;
        return accumulator;
      }, "");

      eventAttendeesValueQuery = eventAttendeesValueQuery.substring(
        0,
        eventAttendeesValueQuery.length - 1
      );

      await db.query(
        "INSERT IGNORE INTO `event_attendee`(`event_id`,`user_id`,`status`) VALUES " +
          eventAttendeesValueQuery
      );
    }
    if (calendar_ids.length > 0) {
      let eventCalendarQuery = calendar_ids.reduce(
        (accumulator, calendarId) => {
          accumulator += `(UUID_TO_BIN("${id}"),UUID_TO_BIN("${calendarId}"),NOW()),`;
          return accumulator;
        },
        ""
      );

      eventCalendarQuery = eventCalendarQuery.substring(
        0,
        eventCalendarQuery.length - 1
      );

      await db.query(
        "INSERT IGNORE INTO `event_calendar`(`event_id`,`calendar_id`,`date_added`) VALUES " +
          eventCalendarQuery
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
        BIN_TO_UUID(events.id) as id,
        BIN_TO_UUID(event_calendar.calendar_id) as calendar_id,
        events.name,
        events.description,
        events.status,
        events.type,
        events.start_of_event,
        events.end_of_event,
        events.location  
      FROM events INNER JOIN event_calendar
      ON events.id = event_calendar.event_id   
      WHERE events.user_id = UUID_TO_BIN(?)`,
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
