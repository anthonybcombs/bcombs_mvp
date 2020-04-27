const queries = `
    scalar Date
    type User{
        id: String
        auth_id: String
        email: String
        sub: String
        type: String
        username: String
        access_token: String
        token_type: String
        id_token: String
        picture: String
        is_profile_filled: Boolean
        email_verified: Boolean
    }
    type UserType {
        id: String,
        name: String
    }
    type Status{
        messageType: String
        message: String
    }
    type UserSignInType{
        user:User,
        status:Status
    }   
    type RootQuery{
        userInfo(access_token: String!,token_type: String!):User,
        users(email: String,access_token: String!,token_type: String!):[User],
        userTypes:[UserType]
    }
`;

const mutations = `
    input UserTypeInput {
        id: String!
        name: String!
    }
    input UserSignupInput{
        username: String!
        password: String!
        email: String!
        isSocial: Boolean
        type: UserTypeInput!
    }
    input UserSignInInput{
        email: String!
        password: String!
    }
    input UserChangePasswordInput{
        email: String!
    }
    input PersonalInfoInput{
        firstname: String!
        lastname: String!
        familyrelationship: String!
        gender: String!
        zipcode: Int!
        dateofbirth: Date!
    }
    input CalendarInfoInput{
        name: String!
    }
    input CreateProfileInput{
        email: String!
        personalInfo: PersonalInfoInput!
        calendarInfo: CalendarInfoInput!
    }
    type RootMutation{
        signUp(user: UserSignupInput!):Status
        signIn(user:UserSignInInput!):UserSignInType
        changePassword(user:UserChangePasswordInput!):Status
        createProfile(user: CreateProfileInput!):Status
    }
`;

const schema = `
    schema{
        query: RootQuery        
        mutation: RootMutation
    }
`;

const typeDefinitions = `
    ${queries}
    ${mutations}
    ${schema}
`;

export default typeDefinitions;
