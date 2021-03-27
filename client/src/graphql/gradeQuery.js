import gql from "graphql-tag";

export const GET_STUDENT_CUMULATIVE_BY_APP_GROUP = gql`
  query getStudentCumulativeGradeByAppGroup(
      $app_group_id: String,
      $app_group_type: String
    ) {
      getStudentCumulativeGradeByAppGroup(
        app_group_id: $app_group_id,
        app_group_type: $app_group_type
      ) {
        app_group_id
        app_group_name
        app_id
        child_id
        firstname
        lastname
        form_contents
        cumulative_grades{
          student_grade_cumulative_id
          app_id
          app_group_id
          app_group_name
          application_type
          child_id
          form_contents
          year_level
          designation
          school_type
          school_name
          school_year_start
          school_year_end
          school_year_frame
          class_name
          class_type
          class_teacher
          attachment
          firstname
          lastname
          gpa_sem_1
          gpa_sem_2
          gpa_final
          scale
          grades{
            student_grade_cumulative_id
            class
            subject
            teacher_name
            designation
            grade_quarter_1
            grade_quarter_2
            grade_quarter_3
            grade_quarter_4
            letter_grade_quarter_1
            letter_grade_quarter_2
            letter_grade_quarter_3
            letter_grade_quarter_4
            attendance_quarter_1_total
            attendance_quarter_2_total
            attendance_quarter_3_total
            attendance_quarter_4_total
            attendance_quarter_1_absent
            attendance_quarter_2_absent
            attendance_quarter_3_absent
            attendance_quarter_4_absent
            attendance_quarter_1_tardy
            attendance_quarter_2_tardy
            attendance_quarter_3_tardy
            attendance_quarter_4_tardy
            attendance_quarter_1_present
            attendance_quarter_2_present
            attendance_quarter_3_present
            attendance_quarter_4_present
            final_grade
            year_final_grade
            quarter_average
            semestral_1_average
            semestral_2_average
            semestral_final
            final_semestral_1_attendance
            final_semestral_2_attendance
            final_quarter_attendance
            attendance
          }
        }
        standardized_test{
          student_test_id
          child_id
          test_name
          attempt
          grade_taken
          month_taken
          score
          score_percentage
          ach_level
          school_percentage
          nationality_percentage
          district_percentage
          state_percentage
          attachment
        }
      }
    }
`;

export const GET_STUDENT_CUMULATIVE_BY_CHILD = gql`
query getStudentRecords(
    $child_id: String
  ) {
    getStudentRecords(child_id: $child_id) {
      cumulative_grades{
        student_grade_cumulative_id
        app_group_id
        app_group_name
        application_type
        child_id
        form_contents
        year_level
        designation
        school_type
        school_name
        school_year_start
        school_year_end
        school_year_frame
        class_name
        class_type
        class_teacher
        attachment
        firstname
        lastname
        gpa_sem_1
        gpa_sem_2
        gpa_final
        scale
        grades{
          student_grade_cumulative_id
          class
          subject
          teacher_name
          designation
          grade_quarter_1
          grade_quarter_2
          grade_quarter_3
          grade_quarter_4
          letter_grade_quarter_1
          letter_grade_quarter_2
          letter_grade_quarter_3
          letter_grade_quarter_4
          attendance_quarter_1_total
          attendance_quarter_2_total
          attendance_quarter_3_total
          attendance_quarter_4_total
          attendance_quarter_1_absent
          attendance_quarter_2_absent
          attendance_quarter_3_absent
          attendance_quarter_4_absent
          attendance_quarter_1_tardy
          attendance_quarter_2_tardy
          attendance_quarter_3_tardy
          attendance_quarter_4_tardy
          attendance_quarter_1_present
          attendance_quarter_2_present
          attendance_quarter_3_present
          attendance_quarter_4_present
          final_grade
          year_final_grade
          quarter_average
          semestral_1_average
          semestral_2_average
          semestral_final
          final_semestral_1_attendance
          final_semestral_2_attendance
          final_quarter_attendance
          attendance
        }
      }
      standardized_test {
        student_test_id
        child_id
        test_name
        attempt
        grade_taken
        month_taken
        score
        score_percentage
        ach_level
        school_percentage
        nationality_percentage
        district_percentage
        state_percentage
        attachment
      }
    }
  }

`;



export const GET_STUDENT_CUMULATIVE_BY_VENDOR = gql`
query getStudentCumulativeGradeByVendor(
    $vendor_id: String
  ) {
    getStudentCumulativeGradeByVendor(vendor_id: $vendor_id) {
        student_grade_cumulative_id
        app_group_id
        application_type
        child_id
        form_contents
        year_level
        designation
        school_type
        school_name
        school_year_start
        school_year_end
        school_year_frame
        class_name
        class_type
        class_teacher
        attachment
        firstname
        lastname
        gpa_sem_1
        gpa_sem_2
        gpa_final
        scale
        grades{
          student_grade_cumulative_id
          class
          subject
          teacher_name
          designation
          grade_quarter_1
          grade_quarter_2
          grade_quarter_3
          grade_quarter_4
          letter_grade_quarter_1
          letter_grade_quarter_2
          letter_grade_quarter_3
          letter_grade_quarter_4
          attendance_quarter_1_total
          attendance_quarter_2_total
          attendance_quarter_3_total
          attendance_quarter_4_total
          attendance_quarter_1_absent
          attendance_quarter_2_absent
          attendance_quarter_3_absent
          attendance_quarter_4_absent
          attendance_quarter_1_tardy
          attendance_quarter_2_tardy
          attendance_quarter_3_tardy
          attendance_quarter_4_tardy
          final_grade
          year_final_grade
          quarter_average
          semestral_1_average
          semestral_2_average
          semestral_final
          final_semestral_1_attendance
          final_semestral_2_attendance
          final_quarter_attendance
          attendance
        }
      }
    }
`