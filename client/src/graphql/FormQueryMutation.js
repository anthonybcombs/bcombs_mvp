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
        category
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
              file {
                filename
                extension
                url
                data
              }
            }
            groupType
            settings {
              logic { 
                include 
                items
              }
              instruction { 
                include
                value 
              }
            }
            isActive
            allowAddField
            gridMax
            includeLogic
            includeValidation
            hasSettings
            supportMultiple
            showLabel
            format
          }
        }
        created_at
        updated_at
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
        category
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
              file {
                filename
                extension
                url
                data
              }
            }
            groupType
            settings {
              logic { 
                include
                items
              }
              instruction { 
                include
                value 
              }
            }
            isActive
            allowAddField
            gridMax
            includeLogic
            includeValidation
            hasSettings
            supportMultiple
            showLabel
            format
          }
        }
        created_at
        updated_at
      }
    }
  }
`;

export const FORM_DELETE_MUTATION = gql`
  mutation deleteCustomApplicationForm($application:CustomApplicationInput){
    deleteCustomApplicationForm(application:$application){
      messageType
      message
    }
  }
`;

export const FORM_SUBMIT_APPLICATION = gql`
  mutation submitCustomApplicationForm($application:SubmitCustomApplicationInput){
    submitCustomApplicationForm(application:$application){
      messageType
      message
    }
  }
`;

export const FORM_UPDATE_SUBMIT_APPLICATION = gql`
  mutation updateSubmitCustomApplication($application:UpdateCustomApplicationInput){
    updateSubmitCustomApplication(application:$application){
      messageType
      message
    }
  }
`;

//queries

export const GET_CUSTOM_APPLICATION_HISTORY = gql`
  query getCustomApplicationHistoryById($app_id: String!) {
    getCustomApplicationHistoryById(app_id: $app_id) {
      id
      app_history_id
      custom_app_id
      details
      updated_by
      updated_at
    }
  }
`;

export const GET_CUSTOM_APPLICATION_BY_ID = gql`
  query getCustomFormApplicantById($app_id:String){
    getCustomFormApplicantById(app_id:$app_id){
      id
      vendor
      form
      app_id
      application_date
      archived_date
      class_teacher
      color_designation
      verification
      student_status
      notes
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
            file {
              filename
              extension
              url
              data
            }
          }
          groupType
          settings {
            logic { 
              include 
              items
            }
            instruction { 
              include
              value 
            }
          }
          isActive
          allowAddField
          gridMax
          includeLogic
          includeValidation
          hasSettings
          supportMultiple
          showLabel
          format
        }
      }
    }
  }
`;

export const GET_APPLICANTS_BY_FORM = gql`
  query getCustomFormApplicants($form_id:String){
    getCustomFormApplicants(form_id:$form_id){
      received_reminder
      received_update
      id
      vendor
      form
      app_id
      application_date
      archived_date
      class_teacher
      color_designation
      verification
      student_status
      notes
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
            file {
              filename
              extension
              url
              data
            }
          }
          groupType
          settings {
            logic { 
              include 
              items
            }
            instruction { 
              include
              value 
            }
          }
          isActive
          allowAddField
          gridMax
          includeLogic
          includeValidation
          hasSettings
          supportMultiple
          showLabel
          format
        }
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
      category
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
            file {
              filename
              extension
              url
              data
            }
          }
          groupType
          settings {
            logic { 
              include 
              items
            }
            instruction { 
              include
              value 
            }
          }
          isActive
          allowAddField
          gridMax
          includeLogic
          includeValidation
          hasSettings
          supportMultiple
          showLabel
          format
        }
      }
      created_at
      updated_at
    }
  }
`;

export const GET_FORMS_BY_VENDOR = gql`
  query getVendorCustomApplicationForms($filter:CustomApplicationFormFilterInput){
    getVendorCustomApplicationForms(filter:$filter){
      id
      app_groups {
        id
        name
        app_grp_id
        form
        vendor
      }
      vendor
      user
      category
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
            file {
              filename
              extension
              url
              data
            }
          }
          groupType
          settings {
            logic { 
              include 
              items
            }
            instruction { 
              include
              value 
            }
          }
          isActive
          allowAddField
          gridMax
          includeLogic
          includeValidation
          hasSettings
          supportMultiple
          showLabel
          format
        }
      }
      created_at
      updated_at
    }
  }
`;