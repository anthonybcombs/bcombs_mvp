import gql from "graphql-tag";

export const ATTENDANCE_UPDATE_MUTATION = gql`
  mutation updateAttendance($attendance: AttendanceInput) {
    updateAttendance(attendance: $attendance) {
      app_group_id
      attendance_date
      attendance_start_time
      event_name
      location
      attendance_list {
        app_id
        attendance_status
        child_id
        vendor
        volunteer_hours
        mentoring_hours
        is_excused
      }
    }
  }
`;