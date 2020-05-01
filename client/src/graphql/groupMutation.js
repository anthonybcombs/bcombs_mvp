import gql from "graphql-tag";
export const GROUP_UPDATE_MUTATION = gql`
  mutation Group($group: GroupInput!) {
    updateGroup(group: $group) {
      id
      name
      contacts
    }
  }
`;

export const GROUP_DELETE_MUTATION = gql`
  mutation Group($id: String!, $email: String!) {
    deleteGroup(id: $id, email: $email) {
      id
      name
      contacts
    }
  }
`;
