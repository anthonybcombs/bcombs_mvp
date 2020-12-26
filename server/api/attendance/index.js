
import { makeDb } from "../../helpers/database";


export const getChildAttendance = async applicationGroupId => {
  const db = makeDb();  
  let result = [];
  try{

    result = await db.query(`
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
      `,
    [applicationGroupId]);

    /*
    UPDATED QUERY - WILL IMPLEMENT TOMORROW
    
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
    FROM application,attendance,child, vendor_app_groups, 
    user_calendars_follow,parent, users, user_calendars_groups
    WHERE attendance.app_group_id=UUID_TO_BIN('a4f0bbef-44f2-11eb-8212-dafd2d0ae3ff') AND child.ch_id=attendance.child_id AND
           vendor_app_groups.app_grp_id=attendance.app_group_id AND
           user_calendars_follow.group_id=attendance.app_group_id AND
           parent.application=application.app_id AND
           parent.email_address=users.email AND
           users.id=user_calendars_follow.user_id AND
           user_calendars_groups.group_id=attendance.app_group_id AND
           user_calendars_groups.group_type= 'applications'

           */

    console.log('Get Child Attendance result',result)
  }catch (error) {
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
    if(attendance) {
      for(const att of attendance.attendance_list) {
        const response = await db.query(`SELECT attendance_id 
        FROM attendance WHERE app_group_id=UUID_TO_BIN(?) 
        AND child_id=UUID_TO_BIN(?) 
        AND attendance_date=?`,[
          attendance.app_group_id,
          att.child_id,
          attendance.attendance_date,
        ]);
        if(response.length === 0) {
          await db.query(
            `
              INSERT INTO attendance(
                app_group_id,
                child_id,
                attendance_status,
                is_excused,
                attendance_date,
                attendance_start_time,
                attendance_end_time,
                volunteer_hours,
                mentoring_hours,
                event_name,
                location
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
                ?
              )
            `,
            [
              attendance.app_group_id,
              att.child_id,
              att.attendance_status,
              att.is_excused || 0,
              attendance.attendance_date,
              attendance.attendance_start_time,
              attendance.attendance_end_time,
              att.volunteer_hours || 0,
              att.mentoring_hours || 0,
              attendance.event_name,
              attendance.location
            ]
          );
        }

        else{
          await db.query(
            `
            UPDATE attendance SET attendance_status=?,
              attendance_start_time=?,
              attendance_end_time=?,
              event_name=?,
              location=?,
              volunteer_hours=?,
              mentoring_hours=?,
              is_excused=?
            WHERE app_group_id=UUID_TO_BIN(?) 
              AND child_id=UUID_TO_BIN(?) 
              AND attendance_date=?
          `,
            [ 
            att.attendance_status,
            attendance.attendance_start_time,
            attendance.attendance_end_time,
            attendance.event_name,
            attendance.location,
            att.volunteer_hours || 0,
            att.mentoring_hours || 0,
            att.is_excused || 0,
            attendance.app_group_id,
            att.child_id,
            attendance.attendance_date,
            ]
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