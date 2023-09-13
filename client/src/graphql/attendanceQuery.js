import gql from "graphql-tag";

export const GET_ATTENDANCE_QUERY = gql`
  query getAttendance($application_group_id: String!, $attendance_type: String) {
    getAttendance(application_group_id: $application_group_id, attendance_type: $attendance_type) {
      app_group_id
      attendance_date
      attendance_start_time
      attendance_end_time
      event_name
      location
      child_id
      firstname
      lastname
      attendance_status
      attendance_type
      app_group_name
      mentoring_hours
      volunteer_hours
      is_excused
      is_following
      image
      event_id
    }
  }
`;


export const GET_EVENT_ATTENDANCE_QUERY = gql`
  query getEventAttendance($application_group_id: String!) {
    getEventAttendance(application_group_id: $application_group_id) {
      app_group_name
      app_group_id
      group_id
      calendar_id
      event_id
      event_name
      type
      start_of_event
      end_of_event
      recurring
      recurring_end_date
    }
  }
`;

// new_childId
export const GET_ATTENDANCE_BY_EVENT = gql`
  query getAttendanceByEvent($event_id: String!, $application_group_id: String, $attendance_type: String) {
    getAttendanceByEvent(event_id: $event_id, application_group_id: $application_group_id, attendance_type: $attendance_type) {
      app_group_id
      attendance_type
      attendance_date
      attendance_start_time
      attendance_end_time
      event_name
      location
      description
      firstname
      lastname
      attendance_status
      child_id   
      new_childId
      image
      mentoring_hours
      volunteer_hours
      is_excused
      is_following
      app_group_name
      event_id
      event_title
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
          }
        }
    }
  }
`;




