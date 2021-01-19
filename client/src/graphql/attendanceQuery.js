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
      mentoring_hours
      volunteer_hours
      is_excused
      is_following
    }
  }
`;


export const GET_EVENT_ATTENDANCE_QUERY = gql`
  query getEventAttendance($application_group_id: String!) {
    getEventAttendance(application_group_id: $application_group_id) {
      app_group_name
      app_group_id
      group_id
      calendar_id
      event_id
      event_name
      type
      start_of_event
      end_of_event
      recurring
      recurring_end_date
    }
  }
`;


