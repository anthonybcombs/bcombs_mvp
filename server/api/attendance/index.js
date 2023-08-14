
import { makeDb } from "../../helpers/database";

import { getChildByChildId, getGroupByChildId } from '../child';


export const getChildEventAttendance = async applicationGroupId => {
  const db = makeDb();
  let result = [];

  try {
    console.log('getChildEventAttendance', applicationGroupId)
    result = await db.query(`
    SELECT BIN_TO_UUID(ucg.group_id) app_group_id,
      BIN_TO_UUID(ucg.calendar_id) calendar_id ,
      BIN_TO_UUID(evnt.id) event_id ,
      evnt.name as event_name,
      evnt.type as type,
      evnt.start_of_event as start_of_event,
      evnt.end_of_event as end_of_event,
      evnt.recurring as recurring,
      evnt.recurring_end_date as recurring_end_date
    FROM user_calendars_groups as ucg
    INNER JOIN event_calendar ec
    ON ec.calendar_id=ucg.calendar_id
    INNER JOIN event_visibility ev
    ON ev.group_id=ucg.group_id AND 
      ev.group_type = 'application'
    INNER JOIN events evnt 
    ON evnt.id=ev.event_id  AND evnt.id=ec.event_id
    ${applicationGroupId === 'all' ? 'WHERE ucg.group_id=UUID_TO_BIN(?)' : ''};
    `,


      [applicationGroupId]);
  } catch (error) {
    console.log("Get child attendance error", error);
    return null;
  } finally {
    await db.close();
    return result;
  }

}

export const getChildAttendance = async (applicationGroupId, attendanceType = 'bcombs') => {
  const db = makeDb();
  let result = [];
  try {
    const field = applicationGroupId === 'all' ? 'app.vendor' : 'att.app_group_id'
    console.log('Get Child Attendance applicationGroupId', applicationGroupId)
    const currentQuery = attendanceType === 'bcombs' ?
      ` SELECT BIN_TO_UUID(att.app_group_id) as app_group_id,
        BIN_TO_UUID(att.child_id) as child_id,
        BIN_TO_UUID(usr.id) as user_id,
        att.attendance_type,
        att.attendance_date,
        att.attendance_start_time,
        att.attendance_end_time,
        att.attendance_status,
        att.mentoring_hours,
        att.volunteer_hours,
        att.event_name,
        att.location,
        att.description,
        att.is_excused,
        BIN_TO_UUID(att.event_id) as event_id,
        ch.firstname,
        ch.lastname,
        ch.gender,
        ch.image,
        vag.name as app_group_name,
        ucf.is_following
      FROM  attendance att
      INNER JOIN child ch 
      ON ch.ch_id=att.child_id
      INNER JOIN application app
      ON app.child=ch.ch_id
      LEFT JOIN vendor_app_groups vag
      ON vag.app_grp_id=att.app_group_id AND
        vag.vendor=app.vendor
        LEFT JOIN parent pr
      ON pr.application=app.app_id
      LEFT JOIN users usr
      ON usr.email=pr.email_address
      LEFT JOIN user_calendars_groups ucg
      ON ucg.group_id=att.app_group_id AND
        ucg.group_type='applications'
      LEFT JOIN user_calendars_follow ucf
      ON ucf.user_id=usr.id AND
        ucf.group_id=att.app_group_id
        WHERE ${applicationGroupId === 'all' ? `` : `${field}=UUID_TO_BIN(?) AND`} att.attendance_type='bcombs'` :
      `SELECT BIN_TO_UUID(att.app_group_id) as app_group_id,
        BIN_TO_UUID(att.child_id) as child_id,
        att.attendance_date,
        att.attendance_start_time,
        att.attendance_end_time,
        att.attendance_status,
        att.attendance_type,
        att.mentoring_hours,
        att.volunteer_hours,
        att.event_name,
        att.location,
        att.description,
        att.is_excused
      FROM  attendance att
      INNER JOIN custom_application ch 
      ON ch.app_id=att.child_id
      WHERE ${applicationGroupId === 'all' ? `` : `${field}=UUID_TO_BIN(?) AND`}
      att.attendance_type = 'forms'`;

    result = await db.query(currentQuery, [applicationGroupId]);
    console.log('ATTENDANCE RESULT', result)
    /*
    SELECT BIN_TO_UUID(attendance.app_group_id) as app_group_id,
      BIN_TO_UUID(attendance.child_id) as child_id,
      attendance.attendance_date,
      attendance.attendance_start_time,
      attendance.attendance_end_time,
      attendance.attendance_status,
      attendance.mentoring_hours,
      attendance.volunteer_hours,
      attendance.event_name,
      attendance.location,
      attendance.is_excused,
      child.firstname,
      child.lastname,
      child.gender,
      vendor_app_groups.name as app_group_name,
      user_calendars_follow.is_following
    FROM application, attendance, child, vendor_app_groups, 
      user_calendars_follow, parent, users, user_calendars_groups
    WHERE  attendance.app_group_id=UUID_TO_BIN(?) AND 
      child.ch_id=attendance.child_id AND
      application.child=child.ch_id AND
      vendor_app_groups.app_grp_id=attendance.app_group_id AND
      parent.application=application.app_id AND
      application.vendor=vendor_app_groups.vendor AND
      parent.email_address=users.email AND
      ((user_calendars_follow.user_id = users.id AND 
        user_calendars_follow.group_id = user_calendars_groups.group_id AND
        user_calendars_follow.group_id = vendor_app_groups.app_grp_id) OR
        users.id NOT IN (
          SELECT user_calendars_follow.user_id FROM user_calendars_follow ,user_calendars_groups
          WHERE user_calendars_follow.group_id = user_calendars_groups.group_id AND 
            user_calendars_follow.user_id is not null)
        ) AND 
        user_calendars_groups.group_id=attendance.app_group_id AND 
        user_calendars_groups.group_type= 'applications';
           */

    console.log('Get Child Attendance result', result)
  } catch (error) {
    console.log("Get child attendance error", error);
    return null;
  } finally {
    await db.close();
    return result;
  }
}

export const updateChildAttendance = async (attendance) => {
  const db = makeDb();
  let result = [];
  try {
    console.log('Update Child Attendance', attendance)
    if (attendance) {
      for (const att of attendance.attendance_list) {
        let groupId = att.app_group_id || attendance.app_group_id;
        groupId = groupId && groupId.split(',');
        groupId = groupId[0];
        const response = await db.query(`SELECT attendance_id 
        FROM attendance WHERE app_group_id=UUID_TO_BIN(?) 
        AND child_id=UUID_TO_BIN(?) 
        AND attendance_date=?`, [
          att.app_group_id || attendance.app_group_id,
          att.child_id,
          attendance.attendance_date,
        ]);
        if (response.length === 0) {

          let queryValues = [
            groupId,
            att.child_id,
            att.attendance_status,
            attendance.attendance_type,
            att.is_excused || 0,
            attendance.attendance_date,
            attendance.attendance_start_time,
            attendance.attendance_end_time,
            att.volunteer_hours || 0,
            att.mentoring_hours || 0,
            attendance.event_name,
            attendance.location,
            attendance.description,
          ]
          if (att.event_id) {
            queryValues = [
              ...queryValues,
              att.event_id
            ]
          }

          await db.query(
            `
              INSERT INTO attendance(
                app_group_id,
                child_id,
                attendance_status,
                attendance_type,
                is_excused,
                attendance_date,
                attendance_start_time,
                attendance_end_time,
                volunteer_hours,
                mentoring_hours,
                event_name,
                location,
                description
                ${att.event_id ? `,event_id` : ''}
              ) VALUES (
                UUID_TO_BIN(?),
                UUID_TO_BIN(?),
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                ?
                ${att.event_id ? `,UUID_TO_BIN(?)` : ''}
              )
            `,
            queryValues
          );
        }

        else {

          let queryValues = [
            att.attendance_status,
            attendance.attendance_start_time,
            attendance.attendance_end_time,
            attendance.event_name,
            attendance.location,
            attendance.description || '',
            att.volunteer_hours || 0,
            att.mentoring_hours || 0,
            att.is_excused || 0,
            groupId,
            att.child_id,
            attendance.attendance_date,
          ]
          if (att.event_id) {
            queryValues = [
              ...queryValues,
              att.event_id
            ]
          }
          await db.query(
            `
            UPDATE attendance SET attendance_status=?,
              attendance_start_time=?,
              attendance_end_time=?,
              event_name=?,
              location=?,
              description=?,
              volunteer_hours=?,
              mentoring_hours=?,
              is_excused=?
              ${att.event_id ? `,event_id` : ''}
            WHERE app_group_id=UUID_TO_BIN(?) 
              AND child_id=UUID_TO_BIN(?) 
              AND attendance_date=?
              ${att.event_id ? ` AND event_id=UUID_TO_BIN(?)` : ''}
              
          `,
            queryValues
          );


        }

      }

    }

  } catch (error) {
    console.log("add application user error", error);
    return null;
  } finally {
    await db.close();
    return [];
  }
};


export const updateAttendanceByChild = async (user) => {
  let results = {};
  try {
    let currentGroupId = null;
    const child = await getChildByChildId(user.child_id);

    if (child) {
      console.log('updateAttendanceByChild child', child.id)
      const groups = [1, 2]// await getGroupByChildId(child.id);
      console.log('updateAttendanceByChild groups', groups)
      if (groups.length > 0) {
        currentGroupId = '805ddb0d-eec9-11ea-8212-dafd2d0ae3ff'  // groups[0].app_grp_id;

        await updateChildAttendance({
          attendance_list: [
            {
              app_group_id: currentGroupId,
              child_id: child.id,
              attendance_status: 'Present',
              is_excused: 0,
              volunteer_hours: 0,
              mentoring_hours: 0,
              event_name: '',
              event_id: user.event_id,
              location: '',
              description: ''
            }
          ],
          attendance_type: 'bcombs',
          attendance_date: user.attendance_date,
          attendance_start_time: user.attendance_start_time,
          attendance_end_time: user.attendance_end_time,
        })

        results = {
          status: 'Success',
        }
      }
    }


  } catch (err) {
    results = {
      status: 'Error',
      message: err
    }
  }

  finally {
    await db.close();
    return results;
  }
}

export const getAttendanceByEventId = async (eventId, applicationGroupId = null, attendanceType = null) => {
  const db = makeDb();
  let results = {};
  try {

    const field = applicationGroupId === 'all' ? 'app.vendor' : 'att.app_group_id'


    const currentQuery = attendanceType === 'forms' ?

      `SELECT BIN_TO_UUID(att.app_group_id) as app_group_id,
        BIN_TO_UUID(att.child_id) as child_id,
        BIN_TO_UUID(att.app_group_id) as app_group_id,
        ch.firstname,
        ch.lastname,
        ch.gender,
        ch.image
        att.attendance_date,
        att.attendance_start_time,
        att.attendance_end_time,
        att.attendance_status,
        att.attendance_type,
        att.mentoring_hours,
        att.volunteer_hours,
        att.event_name,
        att.location,
        att.description,
        att.is_excused,
        bce.title as event_title
      FROM  attendance att
      INNER JOIN custom_application ch 
      ON ch.app_id=att.child_id
      INNER JOIN bc_calendar_event bce 
      ON bce.id=BIN_TO_UUID(att.event_id)
      WHERE  att.attendance_type = 'forms' AND att.event_id=UUID_TO_BIN(?)
    ${applicationGroupId ? ` AND ${field}=UUID_TO_BIN(?) ` : ''}
    ` : ` SELECT 
        BIN_TO_UUID(att.event_id) as event_id,
        BIN_TO_UUID(att.child_id) as child_id,
        att.attendance_type,
        att.attendance_date,
        att.attendance_start_time,
        att.attendance_end_time,
        att.attendance_status,
        att.mentoring_hours,
        att.volunteer_hours,
        att.event_name,
        att.location,
        att.description,
        att.is_excused,
        bce.title as event_title
      FROM  attendance att
      INNER JOIN child ch 
      ON ch.ch_id=att.child_id

      INNER JOIN bc_calendar_event bce 
      ON bce.id=BIN_TO_UUID(att.event_id)

      WHERE  att.attendance_type='bcombs'
      AND att.event_id=UUID_TO_BIN(?)
      ${applicationGroupId ? ` AND ${field}=UUID_TO_BIN(?)` : ''}
  `;


    let values = [eventId];

    if (applicationGroupId) {
      values.push(applicationGroupId)
    }

    console.log('currentQuery', currentQuery)
    console.log('valuessssssss', values)


    let response = await db.query(currentQuery, values);
    console.log('responseeeeeeeee', response)
    results = response
  }
  catch (err) {
    console.log('error', err)
    results = [];
  }
  finally {
    await db.close();
    return results;
  }
}