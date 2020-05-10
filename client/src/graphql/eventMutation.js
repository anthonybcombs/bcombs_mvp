import gql from "graphql-tag";

export const EVENT_CREATE_MUTATION = gql`
  mutation Event($event: EventInput!) {
    createEvent(event: $event) {
      id
      name
    }
  }
`;
