import gql from "graphql-tag";

export const FORM_ADD_MUTATION = gql`
  mutation createCustomApplicationForm($application:CustomApplicationInput){
    createCustomApplicationForm(application:$application){
      messageType
      message
      form {
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
              options {
                name
                label
                tag
              }
              columns {
                label
                value
              }
              rows {
                row
              }
              min {
                value
                label
              }
              max {
                value
                label
              }
              scale {
                min
                max
              }
              scaleLabels {
                left
                center
                right
              }
              items {
                label
                rank
              }
              limit
              errorMessage
              allowTypes {
                label
                ext
                selected
              }
              isMultiple
              requireAddOption
              fixedWidth
            }
            groupType
            settings {
              logic { include }
              instruction { include }
            }
            isActive
            allowAddField
            gridMax
            includeLogic
            includeValidation
            hasSettings
            supportMultiple
          }
        }
        created_at
      }
    }
  }
`;

export const FORM_UPDATE_MUTATION = gql`
  mutation updateCustomApplicationForm($application:CustomApplicationInput){
    updateCustomApplicationForm(application:$application){
      messageType
      message
      form {
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
              options {
                name
                label
                tag
              }
              columns {
                label
                value
              }
              rows {
                row
              }
              min {
                value
                label
              }
              max {
                value
                label
              }
              scale {
                min
                max
              }
              scaleLabels {
                left
                center
                right
              }
              items {
                label
                rank
              }
              limit
              errorMessage
              allowTypes {
                label
                ext
                selected
              }
              isMultiple
              requireAddOption
              fixedWidth
            }
            groupType
            settings {
              logic { include }
              instruction { include }
            }
            isActive
            allowAddField
            gridMax
            includeLogic
            includeValidation
            hasSettings
            supportMultiple
          }
        }
        created_at
      }
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
            options {
              name
              label
              tag
            }
            columns {
              label
              value
            }
            rows {
              row
            }
            min {
              value
              label
            }
            max {
              value
              label
            }
            scale {
              min
              max
            }
            scaleLabels {
              left
              center
              right
            }
            items {
              label
              rank
            }
            limit
            errorMessage
            allowTypes {
              label
              ext
              selected
            }
            isMultiple
            requireAddOption
            fixedWidth
          }
          groupType
          settings {
            logic { include }
            instruction { include }
          }
          isActive
          allowAddField
          gridMax
          includeLogic
          includeValidation
          hasSettings
          supportMultiple
        }
      }
      created_at
    }
  }
`;

export const GET_FORMS_BY_VENDOR = gql`
  query getVendorCustomApplicationForm($vendor_id:String!){
    getVendorCustomApplicationForm(vendor_id:$vendor_id){
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
            options {
              name
              label
              tag
            }
            columns {
              label
              value
            }
            rows {
              row
            }
            min {
              value
              label
            }
            max {
              value
              label
            }
            scale {
              min
              max
            }
            scaleLabels {
              left
              center
              right
            }
            items {
              label
              rank
            }
            limit
            errorMessage
            allowTypes {
              label
              ext
              selected
            }
            isMultiple
            requireAddOption
            fixedWidth
          }
          groupType
          settings {
            logic { include }
            instruction { include }
          }
          isActive
          allowAddField
          gridMax
          includeLogic
          includeValidation
          hasSettings
          supportMultiple
        }
      }
      created_at
    }
  }
`;