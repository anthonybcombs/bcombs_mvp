import { makeDb } from "../../helpers/database";
import {
  getTemplateInvitationStrings,
  sendInvitation,
  sendCancelledEvent,
  sendReScheduledEvent,
} from "../../helpers/email";
import { getUserFromDatabase } from "../index";

import { getMemberByMultipleGroupId } from "../groups";

export const createNewEvent = async (data) => {
  const {
    id,
    name,
    description,
    status,
    type,
    start_of_event,
    end_of_event,
    time,
    location,
    visibility,
    recurring,
    auth_email,
    calendar_ids = [],
    guests = [],
    group_ids: [],
  } = data;
  const db = makeDb();
  let result = {};
  let updatedGuestIds = [];
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
        visibility,
        recurring,
        user_id, date_added ) VALUES (UUID_TO_BIN(?),?,?,?,?,?,?,?,?,?,?,UUID_TO_BIN(?),NOW())`,
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
        visibility,
        recurring,
        currentUser.id,
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
    if (data.group_ids.length > 0) {
      let groupVisibilityQuery = data.group_ids.reduce(
        (accumulator, groupId) => {
          accumulator += `(UUID_TO_BIN("${id}"),UUID_TO_BIN("${groupId}"),NOW()),`;
          return accumulator;
        },
        ""
      );
      groupVisibilityQuery = groupVisibilityQuery.substring(
        0,
        groupVisibilityQuery.length - 1
      );

      await db.query(
        "INSERT IGNORE INTO `event_visibility`(`event_id`,`group_id`,`date_added`) VALUES " +
          groupVisibilityQuery
      );

      let members = await getMemberByMultipleGroupId(data.group_ids);
      updatedGuestIds = [...new Set([...guests, ...members])];
    }

    const formattedRecipients = await formatRecipient(updatedGuestIds, id, db);

    // sendInvitation({
    //   eventOwnerEmail: auth_email,
    //   eventName: name,
    //   eventId: id,
    //   eventStartDate: start_of_event,
    //   eventEndDate: end_of_event,
    //   recipients: formattedRecipients
    // });

    result = await getUserEvents(auth_email);
    // console.log("createNewEvent Result", result);
  } catch (err) {
    console.log("createNewEvent error", err);
  } finally {
    await db.close();
    return result;
  }
};

export const getUserEvents = async (email, calendars = []) => {
  const db = makeDb();
  let result = [];
  let guests = [];
  try {
    const currentUser = await getUserFromDatabase(email);
    if (currentUser) {
      const events = await db.query(
        `SELECT 
          BIN_TO_UUID(events.id) as id,
          BIN_TO_UUID(event_calendar.calendar_id) as calendar_id,
          BIN_TO_UUID(events.user_id) as user_id,
          events.name,
          events.description,
          events.status,
          events.type,
          events.start_of_event,
          events.end_of_event,
          events.location,
          events.visibility,
          events.recurring,
          user_calendars.color
        FROM events , event_calendar, user_calendars 
        WHERE events.id = event_calendar.event_id AND 
          user_calendars.id=event_calendar.calendar_id AND 
          user_calendars.user_id = UUID_TO_BIN(?) AND 
          events.user_id = UUID_TO_BIN(?) 
        UNION 
        SELECT 
          DISTINCT  BIN_TO_UUID(events.id) as id,
          BIN_TO_UUID(event_calendar.calendar_id) as calendar_id,
          BIN_TO_UUID(events.user_id) as user_id,
          events.name,
          events.description,
          events.status,
          events.type,
          events.start_of_event,
          events.end_of_event,
          events.location ,
          events.visibility,
          events.recurring,
          user_calendars.color
        FROM events ,event_calendar, event_attendee, user_calendars
        WHERE  events.id=event_calendar.event_id AND 
          event_attendee.event_id=events.id AND 
          user_calendars.id=event_calendar.calendar_id AND 
          user_calendars.user_id = UUID_TO_BIN(?) AND 
          event_attendee.user_id = UUID_TO_BIN(?) AND 
          (event_attendee.status = "Yes" OR event_attendee.status = "Maybe");`,
        [currentUser.id, currentUser.id, currentUser.id, currentUser.id]
      );

      if (events.length > 0) {
        let eventIds = events.map((item) => item.id);
        eventIds = eventIds.map((eventId) => `UUID_TO_BIN("${eventId}")`);
        guests = await db.query(
          `SELECT users.email, event_attendee.status,
            BIN_TO_UUID(event_attendee.event_id) as event_id,
            BIN_TO_UUID(event_attendee.user_id) as user_id,
            users.profile_img
            FROM event_attendee INNER JOIN users
            ON users.id = event_attendee.user_id
           WHERE event_attendee.event_id IN (${eventIds.join(",")}) `
        );
        guests = JSON.parse(JSON.stringify(guests));

        let groups = await db.query(`
          SELECT BIN_TO_UUID(event_visibility.event_id) as event_id ,BIN_TO_UUID(event_visibility.group_id) as group_id
          FROM event_visibility 
          WHERE event_visibility.event_id IN (${eventIds.join(",")})`);
        groups = JSON.parse(JSON.stringify(groups));

        result = events.map((event) => {
          const invitedGuest = guests.filter(
            (guest) => guest.event_id === event.id
          );
          const sharedGroups = groups
            .filter((group) => group.event_id === event.id)
            .map((group) => group.group_id);
          return {
            ...event,
            guests: [...(invitedGuest || [])],
            group_ids: [...(sharedGroups || [])],
          };
        });
      } else {
        result = events;
      }
    }
  } catch (err) {
    console.log("getUserEvents error", err);
  } finally {
    await db.close();
    console.log("getUserEvents results", result);
    console.log(
      "getUserEvents ***********************************************"
    );
    return result;
  }
};

export const editEvents = async (data) => {
  console.log("Edit Event ", data);
  const {
    id,
    name,
    description,
    status,
    type,
    start_of_event,
    end_of_event,
    time,
    visibility,
    recurring,
    location,
    auth_email,
    calendar_ids = [],
    guests = [],
    removed_guests = [],
    group_ids: [],
  } = data;
  const db = makeDb();
  let results = [];
  try {
    const currentEvent = await db.query(
      `SELECT name,status FROM events where id=UUID_TO_BIN(?)`,
      [id]
    );
    await db.query(
      "UPDATE `events` SET name=?,description=?,status=?,start_of_event=?,end_of_event=?,location=?,type=?,visibility=?,recurring=? WHERE id=UUID_TO_BIN(?)",
      [
        name,
        description,
        status,
        start_of_event,
        end_of_event,
        location,
        type,
        visibility,
        recurring,
        id,
      ]
    );

    if (guests.length > 0) {
      await addEventAttendee(guests, id, db);
    }

    if (removed_guests.length > 0) {
      let eventAttendeeQuery = removed_guests.map((currentItem) => {
        return `(UUID_TO_BIN("${id}"),UUID_TO_BIN("${currentItem}"))`;
      });
      eventAttendeeQuery = eventAttendeeQuery.join(",");
      await db.query(
        "DELETE FROM `event_attendee`  WHERE (event_id, user_id) IN (" +
          eventAttendeeQuery +
          ")"
      );
    }

    if (data.group_ids.length > 0) {
      let groupVisibilityQuery = data.group_ids.reduce(
        (accumulator, groupId) => {
          accumulator += `(UUID_TO_BIN("${id}"),UUID_TO_BIN("${groupId}"),NOW()),`;
          return accumulator;
        },
        ""
      );
      groupVisibilityQuery = groupVisibilityQuery.substring(
        0,
        groupVisibilityQuery.length - 1
      );

      await db.query(
        "INSERT IGNORE INTO `event_visibility`(`event_id`,`group_id`,`date_added`) VALUES " +
          groupVisibilityQuery
      );
    }

    console.log("currentEventStatus ", currentEvent[0].status);

    console.log("currentEventStatus statuss", status);

    if (currentEvent[0].status !== status) {
      if (status === "Cancelled") {
        let notifiedMembers = await getMembers(id, db);
        sendCancelledEvent({
          eventName: name,
          recipients: notifiedMembers,
        });
      } else if (status === "Re-Scheduled") {
        let notifiedMembers = await getMembers(id, db);
        sendReScheduledEvent({
          eventName: name,
          eventStartDate: start_of_event,
          eventEndDate: end_of_event,
          recipients: notifiedMembers,
        });
      }
    }

    results = await getUserEvents(auth_email);
  } catch (err) {
    console.log("editEvents error", err);
  } finally {
    await db.close();
    return results;
  }
};

export const removeEvents = async (id, email) => {
  const db = makeDb();
  let result = [];
  try {
    const currentUser = await getUserFromDatabase(email);
    if (currentUser) {
      await db.query(
        "DELETE FROM `events` WHERE id=UUID_TO_BIN(?) AND user_id=UUID_TO_BIN(?)",
        [id, currentUser.id]
      );
      await db.query(
        "DELETE FROM event_attendee WHERE event_id=UUID_TO_BIN(?)",
        [id]
      );
      await db.query(
        "DELETE FROM event_calendar WHERE event_id=UUID_TO_BIN(?)",
        [id]
      );

      await db.query(
        "DELETE FROM event_visibility WHERE event_id=UUID_TO_BIN(?)",
        [id]
      );
      result = await getUserEvents(email);
    }
  } catch (error) {
    console.log("removeEvents Error", error);
  } finally {
    await db.close();
    return result;
  }
};

export const getInvitedEvents = async (email) => {
  const db = makeDb();
  let result = [];
  try {
    const currentUser = await getUserFromDatabase(email);
    results = await db.query(
      `SELECT 
        BIN_TO_UUID(events.id) as id,
        events.name,
        event_attendee.status,
        event_atendee.user_id
       FROM event_atendee,events WHERE event_attendee.event_id=events.id AND event_attendee.user_id=UUID_TO_BIN(?)
     `,
      [currentUser.id]
    );
    results = JSON.parse(JSON.stringify(results));
  } catch (error) {
  } finally {
    await db.close();
    return result;
  }
};

const addEventAttendee = async (guestIds, eventId, db) => {
  try {
    let eventAttendeesValueQuery = guestIds.reduce((accumulator, userId) => {
      accumulator += `(UUID_TO_BIN("${eventId}"),UUID_TO_BIN("${userId}"),"Pending"),`;
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
  } catch (err) {
    console.log("addEventAttendee error", err);
  } finally {
    return "success";
  }
};

//eventOwnerEmail, guests, id, name
const formatRecipient = async (guests, eventId, db) => {
  let userWithCalendars = [];
  try {
    const formatGuestIds = guests.map((guestId) => `UUID_TO_BIN("${guestId}")`);

    if (formatGuestIds.length > 0) {
      const userDetails = await db.query(
        `SELECT user_profiles.first_name,
                user_profiles.last_name,
                BIN_TO_UUID(user_profiles.user_id) as user_id ,
                users.email,
                event_attendee.status
        FROM user_profiles,users, event_attendee, events
        WHERE users.id IN (${formatGuestIds.join(
          ","
        )}) AND users.id = user_profiles.user_id AND users.id = event_attendee.user_id AND events.id = event_attendee.event_id AND events.id = UUID_TO_BIN(?)`,
        [eventId]
      );

      let userCalendars = await db.query(
        `SELECT name,BIN_TO_UUID(id) as id ,BIN_TO_UUID(user_id) as user_id FROM user_calendars WHERE user_id IN (${formatGuestIds.join(
          ","
        )})`
      );
      userCalendars = JSON.parse(JSON.stringify(userCalendars));

      userWithCalendars = userDetails.map((item) => {
        const currentCalendar = userCalendars.filter(
          (calendar) => calendar.user_id === item.user_id
        );

        console.log("Send Invite Emails Current Calendar", currentCalendar);
        return {
          ...item,
          calendars: currentCalendar,
        };
      });
    }
  } catch (err) {
    console.log("Send Invite Emails err", err);
  } finally {
    return userWithCalendars;
  }
};

const getMembers = async (id, db) => {
  let results = [];
  try {
    results = await db.query(
      `SELECT users.email 
      FROM events,users,event_attendee
      WHERE events.id = UUID_TO_BIN(?)
      AND event_attendee.event_id = events.id
      AND event_attendee.user_id = users.id
      UNION
      SELECT users.email 
      FROM events,users, event_visibility, \`groups\` as gr, group_members
      WHERE 
      events.id = UUID_TO_BIN(?)
      AND events.visibility = 'Custom'
      AND event_visibility.event_id = events.id 
      AND event_visibility.group_id = gr.id
      AND gr.id = group_members.group_id 
      AND group_members.user_id = users.id
      OR events.id  NOT IN (event_visibility.event_id)
      GROUP BY users.email;
        `,
      [id, id]
    );
    results = JSON.parse(JSON.stringify(results));
  } catch (err) {
    console.log("Errors GetMembers ", err);
  } finally {
    return results;
  }
};
