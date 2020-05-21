import gql from "graphql-tag";

export const DELETE_CONTACT_MUTATION = gql`
  mutation Contact($id: String!, $user_id: String!, $added_by_id: String!) {
    deleteContacts(id: $id, user_id: $user_id, added_by_id: $added_by_id) {
      id
      email
      first_name
      last_name
      phone_number
      relation
      user_id
      added_by
    }
  }
`;

export const UPDATE_CONTACT_MUTATION = gql`
  mutation Contact($contact: ContactInput!) {
    updateContact(contact: $contact) {
      id
      email
      first_name
      last_name
      phone_number
      relation
      user_id
      added_by
    }
  }
`;

export const CONTACT_CREATE_MUTATION = gql`
  mutation Contact($contact: ContactInput!) {
    createContact(contact: $contact) {
      id
      email
      first_name
      last_name
      phone_number
      relation
      user_id
      added_by
    }
  }
`;
