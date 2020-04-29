import gql from "graphql-tag";

export const DELETE_CONTACT_MUTATION = gql`
  mutation Contact($id: String!) {
    deleteContacts(id: $id) {
      id
      email
      first_name
      last_name
      phone_number
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
   
    }
  }
`;
