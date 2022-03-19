import gql from "graphql-tag";

export const APPLICATION_ADD_MUTATION = gql`
  mutation application($applications: [ApplicationInput]) {
    addApplication(applications: $applications) {
      messageType
      message
      childs {
        tempId
        newId
      }
      parents {
        tempId
        newId
      }
    }
  }
`;

export const DAYCARE_APPLICATION_ADD_MUTATION = gql`
  mutation application($daycare: DaycareMainInput) {
    addDaycareApplication(daycare: $daycare) {
      messageType
      message
    }
  }
`;

export const APPLICATION_UPDATE_MUTATION = gql`
  mutation applications($application: UpdateApplicationInput!) {
    updateApplication(application: $application) {
      messageType
      message
    }
  }
`;

export const ARCHIVED_APPLICATION_MUTATION = gql`
  mutation application($app_ids: [String]) {
    archivedApplications(app_ids: $app_ids) {
      messageType
      message
    }
  }
`;

export const UNARCHIVED_APPLICATION_MUTATION = gql`
  mutation application($app_ids: [String]) {
    unarchivedApplications(app_ids: $app_ids) {
      messageType
      message
    }
  }
`;

export const APPLICATION_SAVE_MUTATION = gql`
  mutation application($application: SaveApplicationUserInput) {
    saveApplication(application: $application) {
      messageType
      message
    }
  }
`;

export const GET_APPLICATION_HISTORY = gql`
  query getApplicationHistory($app_id: String!) {
    getApplicationHistory(app_id: $app_id) {
      id
      app_history_id
      app_id
      details
      updated_by
      updated_at
    }
  }
`;

export const GET_USER_APPLICATION_HISTORY = gql`
  query getUserApplicationHistory($id: String!) {
    getUserApplicationHistory(id: $id) {
      id
      app_history_id
      app_id
      details
      updated_by
      updated_at
    }
  }
`;

export const GET_APPLICATIONS_QUERY = gql`
  query applications($vendor_id: String!) {
    getVendorApplications(vendor_id: $vendor_id) {
      received_reminder
      received_update
      id
      app_id
      vendor
      is_daycare
  
      child {
        ch_id     
        new_childId   
        firstname
        lastname
        image
        age
        birthdate
        gender
        phone_type
        phone_number
        email_type
        email_address
        phone_type2
        phone_number2
        email_type2
        email_address2
        address
        city
        state
        zip_code
        location_site
        ethnicities
        programs
        school_name
        school_phone
        has_suspended
        reason_suspended
        year_taken
        hobbies
        life_events
        career_goals
        colleges
        affiliations
        awards
        accomplishments
        mentee_gain_program
        grade_number
        grade_desc
        class_rank
        gpa_quarter_year
        gpa_quarter_q1
        gpa_quarter_q2
        gpa_quarter_q3
        gpa_quarter_q4
        gpa_cumulative_year
        gpa_cumulative_q1
        gpa_cumulative_q2
        gpa_cumulative_q3
        gpa_cumulative_q4
        doctor_name
        doctor_phone
        hospital_preference
        hospital_phone
        child_lives_with
        nickname
        is_child_transferring
        does_child_require_physical_education_service
        history_prev_diseases
        child_currently_doctors_care
        reasons_previous_hospitalizations
        comments_suggestion
        list_special_dietary
        list_any_allergies
        mental_physical_disabilities
        medical_action_plan
        list_fears_unique_behavior
        transfer_reason
        prev_school_phone
        prev_school_city
        prev_school_address
        prev_school_attended
        prev_school_state
        prev_school_zip_code
        preffered_start_date
        current_classroom
        primary_language
        needed_days
        schedule_tour
        voucher

        is_entrepreneur
        include_in_directory
        business_name
        business_website
        business_phone
        business_email
        business_industry
        business_address
        business_description
        employment_status
        allergies_to_medicine
        food_allergies
        insect_allergies
        other_allergies
        current_medications
        health_insurance_information
      }
      parents {
        parent_id
        new_parentId
        firstname
        lastname
        image
        phone_type
        phone_number
        email_type
        email_address
        password
        occupation
        employers_name
        parent_goals
        parent_child_goals
        live_area
        level_of_education
        child_hs_grad
        child_col_grad
        emergency_contacts
        phone_type2
        phone_number2
        email_type2
        email_address2
        person_recommend
        address
        city
        state
        zip_code
        age
        birthdate
        gender
        ethnicities
      }
      section1_signature
      section1_date_signed
      section2_signature
      section2_date_signed
      section3_signature
      section3_date_signed
      verification
      student_status
      color_designation
      notes
      application_date
      archived_date
      class_teacher
      section1_text
      section2_text
      section3_text
      section1_name
      section2_name
      section3_name
      emergency_contacts
      vendorPrograms {
        id
        vendor_program_id
        vendor
        user
        name
        created_at
      }
      vendorLocationSites {
        id
        vendor_location_site_id
        vendor
        user
        name
        created_at
      }
      relationships {
        id
        parent
        child
        relationship
      }
      chRelationships {
        id
        child
        child2
        details {
          firstname
        }
        relationship
      }
    }
  }
`;

export const GET_APPLICATION_ID_QUERY = gql`
  query applications($id: String!) {
    getApplicationById(id: $id) {
      id
      app_id
      vendor
      is_daycare
 
      child {
        ch_id        
        firstname
        lastname
        age
        image
        birthdate
        gender
        phone_type
        phone_number
        email_type
        email_address
        phone_type2
        phone_number2
        email_type2
        email_address2
        address
        city
        state
        zip_code
        location_site
        ethnicities
        programs
        school_name
        school_phone
        has_suspended
        reason_suspended
        year_taken
        hobbies
        life_events
        career_goals
        colleges
        affiliations
        awards
        accomplishments
        mentee_gain_program
        grade_number
        grade_desc
        class_rank
        gpa_quarter_year
        gpa_quarter_q1
        gpa_quarter_q2
        gpa_quarter_q3
        gpa_quarter_q4
        gpa_cumulative_year
        gpa_cumulative_q1
        gpa_cumulative_q2
        gpa_cumulative_q3
        gpa_cumulative_q4
        doctor_name
        doctor_phone
        hospital_preference
        hospital_phone
        child_lives_with
        nickname
        is_child_transferring
        does_child_require_physical_education_service
        history_prev_diseases
        child_currently_doctors_care
        reasons_previous_hospitalizations
        comments_suggestion
        list_special_dietary
        list_any_allergies
        mental_physical_disabilities
        medical_action_plan
        list_fears_unique_behavior
        transfer_reason
        prev_school_phone
        prev_school_city
        prev_school_address
        prev_school_attended
        prev_school_state
        prev_school_zip_code
        preffered_start_date
        current_classroom
        primary_language
        needed_days
        schedule_tour
        voucher
        is_entrepreneur
        include_in_directory
        business_name
        business_website
        business_phone
        business_email
        business_industry
        business_address
        business_description
        employment_status
        allergies_to_medicine
        food_allergies
        insect_allergies
        other_allergies
        current_medications
        health_insurance_information
      }
      parents {
        parent_id
        firstname
        lastname
        image
        phone_type
        phone_number
        email_type
        email_address
        password
        occupation
        employers_name
        parent_goals
        parent_child_goals
        live_area
        level_of_education
        child_hs_grad
        child_col_grad
        emergency_contacts
        phone_type2
        phone_number2
        email_type2
        email_address2
        person_recommend
        address
        city
        state
        zip_code
        age
        birthdate
        gender
        ethnicities
      }
      section1_signature
      section1_date_signed
      section2_signature
      section2_date_signed
      section3_signature
      section3_date_signed
      verification
      student_status
      color_designation
      notes
      application_date
      archived_date
      class_teacher
      section1_text
      section2_text
      section3_text
      section1_name
      section2_name
      section3_name
      emergency_contacts
      vendorPrograms {
        id
        vendor_program_id
        vendor
        user
        name
        created_at
      }
      vendorLocationSites {
        id
        vendor_location_site_id
        vendor
        user
        name
        created_at
      }
      relationships {
        id
        parent
        child
        relationship
      }
      chRelationships {
        id
        child
        child2
        details {
          firstname
        }
        relationship
      }
    }
  }
`;

export const GET_APPLICATION_USER_ID_QUERY = gql`
  query getUserApplicationsByUserId($user_id: String!) {
    getUserApplicationsByUserId(user_id: $user_id) {
      applications {
        received_reminder
        received_update
        id
        app_id
        vendor
        vendorName
        vendorGroup {
          id
          name
          size
          vendor
          user
          app_grp_id
        }
        is_daycare

        child {
          ch_id        
          firstname
          lastname
          image
          age
          birthdate
          gender
          phone_type
          phone_number
          email_type
          email_address
          phone_type2
          phone_number2
          email_type2
          email_address2
          address
          city
          state
          zip_code
          location_site
          ethnicities
          programs
          school_name
          school_phone
          has_suspended
          reason_suspended
          year_taken
          hobbies
          life_events
          career_goals
          colleges
          affiliations
          awards
          accomplishments
          mentee_gain_program
          grade_number
          grade_desc
          class_rank
          gpa_quarter_year
          gpa_quarter_q1
          gpa_quarter_q2
          gpa_quarter_q3
          gpa_quarter_q4
          gpa_cumulative_year
          gpa_cumulative_q1
          gpa_cumulative_q2
          gpa_cumulative_q3
          gpa_cumulative_q4
          doctor_name
          doctor_phone
          hospital_preference
          hospital_phone
          child_lives_with
          nickname
          is_child_transferring
          does_child_require_physical_education_service
          history_prev_diseases
          child_currently_doctors_care
          reasons_previous_hospitalizations
          comments_suggestion
          list_special_dietary
          list_any_allergies
          mental_physical_disabilities
          medical_action_plan
          list_fears_unique_behavior
          transfer_reason
          prev_school_phone
          prev_school_city
          prev_school_address
          prev_school_attended
          prev_school_state
          prev_school_zip_code
          preffered_start_date
          current_classroom
          primary_language
          needed_days
          schedule_tour
          voucher
          is_entrepreneur
          include_in_directory
          business_name
          business_website
          business_phone
          business_email
          business_industry
          business_address
          business_description
          employment_status
          allergies_to_medicine
          food_allergies
          insect_allergies
          other_allergies
          current_medications
          health_insurance_information
        }
        parents {
          parent_id
          firstname
          lastname
          image
          phone_type
          phone_number
          email_type
          email_address
          password
          occupation
          employers_name
          parent_goals
          parent_child_goals
          live_area
          level_of_education
          child_hs_grad
          child_col_grad
          emergency_contacts
          phone_type2
          phone_number2
          email_type2
          email_address2
          person_recommend
          address
          city
          state
          zip_code
          age
          birthdate
          gender
          ethnicities
        }
        section1_signature
        section1_date_signed
        section2_signature
        section2_date_signed
        section3_signature
        section3_date_signed
        verification
        student_status
        color_designation
        notes
        application_date
        archived_date
        class_teacher
        section1_text
        section2_text
        section3_text
        section1_name
        section2_name
        section3_name
        app_histories {
          id
          app_history_id
          app_id
          details
          updated_by
          updated_at
        }
        emergency_contacts
        vendorPrograms {
          id
          vendor_program_id
          vendor
          user
          name
          created_at
        }
        vendorLocationSites {
          id
          vendor_location_site_id
          vendor
          user
          name
          created_at
        }
        relationships {
          id
          parent
          child
          relationship
        }
        chRelationships {
          id
          child
          child2
          details {
            firstname
          }
          relationship
        }
      }
      customApplications {
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
          }
        }
      }
    }
  }
`;

export const GET_ARCHIVED_APPLICATIONS_QUERY = gql`
  query applications($vendor_id: String!) {
    getVendorArchivedApplications(vendor_id: $vendor_id) {
      id
      app_id
      vendor
      is_daycare
      child {
        ch_id        
        firstname
        lastname
        image
        age
        birthdate
        gender
        phone_type
        phone_number
        email_type
        email_address
        phone_type2
        phone_number2
        email_type2
        email_address2
        address
        city
        state
        zip_code
        location_site
        ethnicities
        programs
        school_name
        school_phone
        has_suspended
        reason_suspended
        year_taken
        hobbies
        life_events
        career_goals
        colleges
        affiliations
        awards
        accomplishments
        mentee_gain_program
        grade_number
        grade_desc
        class_rank
        gpa_quarter_year
        gpa_quarter_q1
        gpa_quarter_q2
        gpa_quarter_q3
        gpa_quarter_q4
        gpa_cumulative_year
        gpa_cumulative_q1
        gpa_cumulative_q2
        gpa_cumulative_q3
        gpa_cumulative_q4
        doctor_name
        doctor_phone
        hospital_preference
        hospital_phone
        child_lives_with
        nickname
        is_child_transferring
        does_child_require_physical_education_service
        history_prev_diseases
        child_currently_doctors_care
        reasons_previous_hospitalizations
        comments_suggestion
        list_special_dietary
        list_any_allergies
        mental_physical_disabilities
        medical_action_plan
        list_fears_unique_behavior
        transfer_reason
        prev_school_phone
        prev_school_city
        prev_school_address
        prev_school_attended
        prev_school_state
        prev_school_zip_code
        preffered_start_date
        current_classroom
        primary_language
        needed_days
        schedule_tour
        voucher
        is_entrepreneur
        include_in_directory
        business_name
        business_website
        business_phone
        business_email
        business_industry
        business_address
        business_description
        employment_status
        allergies_to_medicine
        food_allergies
        insect_allergies
        other_allergies
        current_medications
        health_insurance_information
      }
      parents {
        parent_id
        firstname
        lastname
        image
        phone_type
        phone_number
        email_type
        email_address
        password
        occupation
        employers_name
        parent_goals
        parent_child_goals
        live_area
        level_of_education
        child_hs_grad
        child_col_grad
        emergency_contacts
        phone_type2
        phone_number2
        email_type2
        email_address2
        person_recommend
        address
        city
        state
        zip_code
        age
        birthdate
        gender
        ethnicities
      }
      section1_signature
      section1_date_signed
      section2_signature
      section2_date_signed
      section3_signature
      section3_date_signed
      verification
      student_status
      color_designation
      notes
      application_date
      archived_date
      class_teacher
      section1_text
      section2_text
      section3_text
      section1_name
      section2_name
      section3_name
      emergency_contacts
      vendorPrograms {
        id
        vendor_program_id
        vendor
        user
        name
        created_at
      }
      vendorLocationSites {
        id
        vendor_location_site_id
        vendor
        user
        name
        created_at
      }
    }
  }
`;

// ADDED BY DENNIS
export const USER_APPLICATION_QUERY = gql`
  query UserApplication($email: String!) {
    getUserApplications(email: $email) {
      child {
        name
        email_address
        firstname
        lastname
        image
        phone_number
        address
        city
        zip_code
        child_id
        application_id
        verification
      }
      parent {
        name
        email_address
        firstname
        lastname
        image
        phone_number
        address
        city
        zip_code
        parent_id
        application_id
        verification
      }
    }
  }
`;

export const GET_CUSTOM_APPLICATION_BY_VENDOR = gql`
  query getCustomApplicationByVendor($vendor: String!) {
    getCustomApplicationByVendor(vendor: $vendor) {
      id
      app_id
      form
      class_teacher
      form_contents
    }
  }
`;
/*
    name
      email_address
      firstname
      lastname
      phone_number
      address
      city
      zip_code
      */
