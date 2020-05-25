import gql from "graphql-tag";

export const APPLICATION_ADD_MUTATION = gql`
  mutation application($applications: [ApplicationInput]) {
    addApplication(applications: $applications) {
      messageType
      message
    }
  }
`;

export const GET_APPLICATIONS_QUERY = gql`
  query applications($vendor_id: String!) {
    getVendorApplications(vendor_id: $vendor_id) {
      app_id
      vendor
      child {
        firstname
        lastname
        age
        birthdate
        gender
        phone_type
        phone_number
        email_type
        email_address
        address
        city
        state
        zip_code
        location_site
        programs
        school_name
        school_phone
        has_suspended
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
      }
      parents {
        firstname
        lastname
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
    }
  }
`