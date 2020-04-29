import gql from "graphql-tag";
export const GET_CONTACT_QUERY = gql`
  query Contact {
    contacts {
      id
      last_name
      first_name
      email
      phone_number
      relation
    }
  }
`;
