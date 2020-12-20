import gql from "graphql-tag";

export const GET_ATTENDANCE_QUERY = gql`
  query getAttendance($application_group_id: String!) {
    getAttendance(application_group_id: $application_group_id) {
      app_group_id
      attendance_date
      attendance_start_time
      attendance_end_time
      event_name
      location
      child_id
      firstname
      lastname
      attendance_status
      app_group_name
      volunteer_hours
    }
  }
`;
