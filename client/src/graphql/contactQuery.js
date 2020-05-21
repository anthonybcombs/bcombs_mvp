import gql from "graphql-tag";

export const GET_CONTACT_QUERY = gql`
  query Contact($email: String!) {
    getContact(email: $email) {
      id
      last_name
      first_name
      email
      phone_number
      relation
      user_id
      added_by
    }
  }
`;
