import gql from "graphql-tag";

export const FORM_ADD_MUTATION = gql`
  mutation createCustomApplicationForm($application:CustomApplicationInput){
    createCustomApplicationForm(application:$application){
      messageType
      message
    }
  }
`;

export const GET_FORM_BY_FORM_ID = gql`
  query getCustomApplicationsByFormId($form_id:String!){
    getCustomApplicationsByFormId(form_id:$form_id){
      id
      vendor
      user
      form_id
      form_contents {
        formTitle
        formData {
          id
          label
          type
          fields {
            id
            label
            type
            tag
            placeholder
            column
            value
            required
            validation {
              include
              items {
                error
                errorField
                option
                type
                value
              }
            }
          }
          groupType
          settings {
            logic { include }
            instruction { include }
          }
          isActive
          allowAddField
          gridMax
        }
      }
      created_at
    }
  }
`;