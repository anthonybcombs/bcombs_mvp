import gql from "graphql-tag";

export const EVENT_CREATE_MUTATION = gql`
  mutation Event($event: EventInput!) {
    createEvent(event: $event) {
      id
      calendar_id
      name
      description
      status
      type
      start_of_event
      end_of_event
      location
      color
      visibility
      allowed_edit
      recurring
      recurring_end_date
      group_ids
      app_group_ids
      guests {
        email
        status
        user_id
        event_id
        profile_img
      }
    }
  }
`;

export const EVENT_UPDATE_MUTATION = gql`
  mutation Event($event: EventInput!) {
    updateEvent(event: $event) {
      id
      calendar_id
      name
      description
      status
      type
      start_of_event
      end_of_event
      location
      user_id
      color
      visibility
      allowed_edit
      recurring
      recurring_end_date
      group_ids
      app_group_ids
      guests {
        email
        status
        user_id
        event_id
        profile_img
      }
    }
  }
`;

export const EVENT_DELETE_MUTATION = gql`
  mutation Event($id: String!, $email: String!) {
    deleteEvent(id: $id, email: $email) {
      id
      calendar_id
      name
      description
      status
      type
      start_of_event
      end_of_event
      location
      user_id
      color
      guests {
        email
        status
        user_id
        event_id
        profile_img
      }
    }
  }
`;


export const EVENT_ATTENDANCE_UPDATE_MUTATION = gql`
  mutation Event($user: UserAttendanceInput) {
    createUpdateChildAttendance(user: $user) {
      status
    }
  }
`;
