import gql from "graphql-tag";
export const GROUP_UPDATE_MUTATION = gql`
  mutation Group($group: GroupInput!) {
    updateGroup(group: $group) {
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
        pool_id
        form
        user
        app_grp_id
      }
    }
  }
`;

export const GROUP_DELETE_MUTATION = gql`
  mutation Group($id: String!, $email: String!) {
    deleteGroup(id: $id, email: $email) {
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
        pool_id
        form
        user
        app_grp_id
      }
    }
  }
`;

export const GROUP_CREATE_MUTATION = gql`
  mutation Group($group: GroupInput!) {
    createGroup(group: $group) {
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
        pool_id
        form
        user
        app_grp_id
      }
    }
  }
`;
