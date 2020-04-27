import gql from "graphql-tag";
export const USER_TYPES_QUERY = gql`
  query UserTypeQuery {
    userTypes {
      id
      name
    }
  }
`;
