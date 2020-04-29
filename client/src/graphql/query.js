import gql from "graphql-tag";
export const USER_TYPES_QUERY = gql`
  query UserTypeQuery {
    userTypes {
      id
      name
    }
  }
`;

export const IS_USER_EXIST_QUERY = gql`
  query IsUserExits($email: String!) {
    users(email: $email) {
      email
    }
  }
`;
