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
      }
    }
  }
`;
