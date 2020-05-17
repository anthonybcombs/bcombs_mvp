const inputs = `
    input UserTypeInput {
        id: String!
        name: String!
    }
    input UserSignupInput{
        username: String
        password: String
        email: String!
        isSocial: Boolean
        type: UserTypeInput
        sub: String
        token_type: String
        given_name: String
        family_name: String
        nickname: String
        updated_at: String
        is_profile_filled: Boolean
        access_token: String
        locale: String
        email_verified: Boolean
        picture: String
        name: String
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
        zipcode: String!
        dateofbirth: Date!
        type: String
    }
    input UserInfoInput{
        email: String!
        familyMembers: [PersonalInfoInput]
        members: [PersonalInfoInput]
        personalInfo: PersonalInfoInput!
        calendarInfo: CalendarInfoInput!
    }
    input UserUpdateInput{
        creds: CredsInput!
        info: UserInfoInput!
    }
    input ContactInput{
        id: String
        first_name: String
        last_name: String
        email: String
        phone_number: String
        relation: String
        auth_email:String
        selected_groups:[String]
        removed_groups:[String]
    }
    input CalendarInfoInput{
        id: String
        name: String!
        image: String
        familyMembers:[String],
        visibilityType: String!
        color: String
    }    
    input CreateProfileInput{
        email: String!
        personalInfo: PersonalInfoInput!
        calendarInfo: CalendarInfoInput!
    }
    input CredsInput{
        access_token: String!
        token_type: String!
    }    
    input FileInput{
        filename: String!
        mimetype: String!
        encoding: String!
    }
    input GroupInput{
        id: String!
        member_ids: [String]
        name: String
        email: String!
        visibility: String
        removed_member_ids:[String]
    }
    input CalendarInput{
        creds:CredsInput!
        info:CalendarInfoInput!
    }

    input EventInput {
        id: String
        calendar_ids: [String]
        name: String
        description: String
        status: String
        type: String
        start_of_event: String
        end_of_event: String
        time: String
        location: String
        auth_email: String
        guests:[String]
        removed_guests:[String]
    }

`;
const queryTypes = `
    scalar Date

    type Event {
        id: String
        name: String
        calendar_id: String
        user_id: String
        description: String
        status: String
        type: String
        start_of_event:Date
        end_of_event:Date
        location: String
        guests: [InvitedGuest]
    }
    type Contact{
        id: String
        user_id: String
        first_name: String
        last_name: String
        email: String
        phone_number: String
        relation: String
    }

    type User{
        id: String
        user_id: String        
        auth_id: String
        email: String
        type: String
        username: String
        sub: String
        given_name: String
        family_name: String
        nickname: String
        updated_at: String
        is_profile_filled: Boolean
        access_token: String
        id_token: String    
        token_type: String            
        locale: String
        email_verified: Boolean
        picture: String
        name: String   
        profile_img: String     
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

    type File {
        filename: String!
        mimetype: String!
        encoding: String!
    }

    type Group {
        id: String!
        name: String!
        visibility: String!
        user_id: String!
        group_photo: String
        contacts:[String]
    }
    type CalendarInfoType{
        id: String!
        user_id: String!
        image: String!
        name: String!      
        color: String!   
        familyMembers:[String]
        visibilityType: String!   
    }
    type CalendarType{
        status: Status!
        calendar: CalendarInfoType!
    }
    type CalendarsType{
        status: Status!
        data:[CalendarInfoType]!       
    }

    type AllGroups {
        joined_groups:[Group]
        created_groups:[Group]
    }    
    type FammilyMemberType{
        id: String!
        user_id: String!
        firstname: String
        lastname: String
        familyrelationship: String
        gender: String
        zipcode: String
        dateofbirth: Date
        type: String    
        added_at : Date    
    }

    type InvitedGuest {
        email: String
        status: String
        event_id: String
        user_id : String
        profile_img: String
    }
`;

const mutations = `
    type RootMutation{
        signUp(user: UserSignupInput!):Status
        signIn(user:UserSignInInput!):UserSignInType
        changePassword(user:UserChangePasswordInput!):Status
        userUpdate(user: UserUpdateInput!):Status
        createContact(contact: ContactInput): [Contact]
        deleteContacts(id: String!): [Contact]
        updateContact(contact: ContactInput!): [Contact]
        createGroup(group: GroupInput!) : AllGroups
        updateGroup(group: GroupInput!): AllGroups        
        createCalendar(calendar:CalendarInput!):CalendarType
        editCalendar(calendar:CalendarInput!):CalendarType
        deleteCalendar(calendar:CalendarInput!):CalendarType
        deleteGroup(id: String!, email:String!): AllGroups
        createEvent(event:EventInput!): [Event]
        updateEvent(event:EventInput!): [Event]
        deleteEvent(id: String!, email:String!): [Event]
    }
`;

const queries = `
    type RootQuery{
        getContact(email: String!):[Contact]
        getUserGroup(email: String!): AllGroups
        contacts:[Contact]
        userInfo(access_token: String!,token_type: String!):User,
        users(email: String,username: String,access_token: String,token_type: String):[User],
        userTypes:[UserType],
        calendars(access_token: String!,token_type: String!):CalendarsType
        getGroupMembers(id:String!):[Contact],        
        getEvents(email:String!):[Event],
        getUserList(keyword:String!): [User]    
        familymembers(access_token: String!,token_type: String!):[FammilyMemberType]    
    }
`;

const schema = `
    schema{
        query: RootQuery        
        mutation: RootMutation
    }
`;

const typeDefinitions = `
    ${inputs}
    ${queryTypes}
    ${queries}
    ${mutations}
    ${schema}
`;

export default typeDefinitions;
