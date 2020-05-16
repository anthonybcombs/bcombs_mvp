import gql from "graphql-tag";

export const GET_EVENT_QUERY = gql`
  query Events($email: String!) {
    getEvents(email: $email) {
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

/*     description
      status
      type
      start_of_event
      end_of_event
      location
      */
