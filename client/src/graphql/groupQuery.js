import gql from "graphql-tag";

export const GET_USER_GROUP_QUERY = gql`
  query GetUserGroup($email: String!) {
    getUserGroup(email: $email) {
      joined_groups {
        id
        name
        contacts
      }
      created_groups {
        id
        name
        contacts
      }
      application_groups {
        id
        name
        size
        vendor
        user
        app_grp_id
      }
    }
  }
`;

export const GET_GROUP_MEMBERS_QUERY = gql`
  query GetGroupMembers($id: String!) {
    getGroupMembers(id: $id) {
      user_id
      email
      last_name
      first_name
      profile_img
    }
  }
`;
