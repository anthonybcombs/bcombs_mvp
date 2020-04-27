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
