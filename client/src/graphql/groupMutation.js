import gql from "graphql-tag";
export const GROUP_UPDATE_MUTATION = gql`
  mutation Group($file: File, $group: GroupInput) {
    signIn(file: $file, group: $group) {
      id
      name
      visibility
    }
  }
`;
