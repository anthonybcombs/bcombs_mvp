import gql from "graphql-tag";
export const SIGN_IN_MUTATION = gql`
  mutation SignIn($user: UserSignInInput!) {
    signIn(user: $user) {
      user {
        sub
        access_token
        token_type
        id_token
        email_verified
        email
        address
        birth_date
        custom_gender
        ethnicity
        family_relationship
        first_name
        gender
        grade
        last_name
        school
        zip_code
      }
      status {
        messageType
        message
      }
    }
  }
`;
export const SIGN_UP_MUTATION = gql`
  mutation SignUp($user: UserSignupInput!) {
    signUp(user: $user) {
      message
      messageType
    }
  }
`;

export const USER_UPDATE_MUTATION = gql`
  mutation UserUpdate($user: UserUpdateInput!) {
    userUpdate(user: $user) {
      messageType
      message
    }
  }
`;
export const CHANGE_PASSWORD_MUTATION = gql`
  mutation changePassword($user: UserChangePasswordInput!) {
    changePassword(user: $user) {
      messageType
      message
    }
  }
`;
export const CREATE_CALENDAR_MUTATION = gql`
  mutation createCalendar($calendar: CalendarInput!) {
    createCalendar(calendar: $calendar) {
      status {
        messageType
        message
      }
      calendar {
        id
        user_id
        name
        color
        visibilityType
        image
        app_group_ids
      }
    }
  }
`;
export const EDIT_CALENDAR_MUTATON = gql`
  mutation editCalendar($calendar: CalendarInput!) {
    editCalendar(calendar: $calendar) {
      status {
        messageType
        message
      }
      calendar {
        id
        user_id
        name
        color
        visibilityType
        image
        app_group_ids
      }
    }
  }
`;

export const CLONE_CALENDAR_MUTATION = gql`
  mutation cloneCalendar($calendar: CalendarInput!) {
    cloneCalendar(calendar: $calendar) {
      status {
        messageType
        message
      }
      calendar {
        id
        user_id
        name
        color
        visibilityType
        image
      }
    }
  }
`;

export const DELETE_CALENDAR_MUTATION = gql`
  mutation deleteCalendar($calendar: CalendarInput!) {
    deleteCalendar(calendar: $calendar) {
      status {
        messageType
        message
      }
      calendar {
        id
        user_id
        name
        color
        visibilityType
        image
      }
    }
  }
`;

export const USER_ATTENDANCE_FILTER_CONFIG_MUTATION = gql`
  mutation updateUserAttendanceFilterConfig($user_attendance_filter_config: UserAttendanceFilterConfigInput!) {
    updateUserAttendanceFilterConfig(user_attendance_filter_config: $user_attendance_filter_config) {
      user_id
    }
  }
`;

