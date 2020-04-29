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
