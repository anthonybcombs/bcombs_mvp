import gql from "graphql-tag";
export const USER_TYPES_QUERY = gql`
  query UserTypeQuery {
    userTypes {
      id
      name
    }
  }
`;

export const IS_USER_EXIST_QUERY = gql`
  query IsUserExits($email: String!) {
    users(email: $email) {
      email
    }
  }
`;
export const USER_INFO_QUERY = gql`
  query UserInfo($access_token: String!, $token_type: String!) {
    userInfo(access_token: $access_token, token_type: $token_type) {
      email
      type
      username
      user_id
      sub
      given_name
      family_name
      nickname
      updated_at
      is_profile_filled
      access_token
      id_token
      token_type
      locale
      email_verified
      picture
      name
      profile_img
    }
  }
`;

export const CALENDARS_QUERY = gql`
  query getCalendar($access_token: String!, $token_type: String!) {
    calendars(access_token: $access_token, token_type: $token_type) {
      status {
        messageType
        message
      }
      data {
        id
        user_id
        name
        image
        color
        visibilityType
        familyMembers
      }
    }
  }
`;

export const GET_USER_OPTIONS_QUERY = gql`
  query getUserList($keyword: String!) {
    getUserList(keyword: $keyword) {
      email
      family_name
      given_name
      id
    }
  }
`;

export const FAMILY_MEMBER_QUERY = gql`
  query getFamilyMembers($access_token: String!, $token_type: String!) {
    familymembers(access_token: $access_token, token_type: $token_type) {
      id
      user_id
      firstname
      lastname
      familyrelationship
      zipcode
      type
      dateofbirth
      added_at
    }
  }
`;
