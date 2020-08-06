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
        email: String!,
        reset_type: String,
        zip_code: String,
        birth_date: String,
        address: String,
        password: String,
        security_question1: String,
        security_question2: String,
        security_question3: String,
    }
    input PersonalInfoInput{
        firstname: String!
        lastname: String!
        familyrelationship: String!
        gender: String
        customgender: String
        zipcode: String!
        dateofbirth: Date
        type: String,
        securityquestion1: String
        securityquestion1answer: String
        securityquestion2: String
        securityquestion2answer: String
        securityquestion3: String
        securityquestion3answer: String
    }
    input UserInfoInput{
        email: String
        familyMembers: [PersonalInfoInput]
        members: [PersonalInfoInput]
        personalInfo: PersonalInfoInput
        calendarInfo: CalendarInfoInput
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
        user_id: String
        name: String
        image: String
        familyMembers:[String],
        groups:[String]
        visibilityType: String
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
        visibility: String
        auth_email: String
        group_ids:[String]
        guests:[String]
        removed_guests:[String]
        recurring: String
        recurring_end_date: String

    }

    input VendorInput {
        id: String
        user: String!
        name: String
        section1_text: String
        section2_text: String
        section3_text: String
        section1_name: String
        section2_name: String
        section3_name: String
        section1_show: Int
        section2_show: Int
        section3_show: Int
    }

    input ScoreInfoInput {
        child: String
        type: String
        result: Float
        year: String
        month: String
    }

    input ChildIInfoInput {
        firstname: String!
        lastname: String!
        age: Int!
        birthdate: String!
        gender: String!
        phone_type: String
        phone_number: String
        email_type: String
        email_address: String
        phone_type2: String
        phone_number2: String
        email_type2: String
        email_address2: String
        address: String!
        city: String!
        state: String!
        zip_code: String!
        location_site: String!
        school_name: String!
        school_phone: String
        has_suspended: Int
        reason_suspended: String
        year_taken: String
        hobbies: String
        life_events: String
        career_goals: String
        colleges: String
        affiliations: String
        awards: String
        accomplishments: String
        mentee_gain_program: String
        grade_number: String!
        grade_desc: String!
        class_rank: String
        gpa_quarter_year: String
        gpa_quarter_q1: String
        gpa_quarter_q2: String
        gpa_quarter_q3: String
        gpa_quarter_q4: String
        gpa_cumulative_year: String
        gpa_cumulative_q1: String
        gpa_cumulative_q2: String
        gpa_cumulative_q3: String
        gpa_cumulative_q4: String
        programs: String
        ethnicities: String
        doctor_name: String
        doctor_phone: String
        hospital_preference: String
        hospital_phone: String
        child_lives_with: String!
    }

    input ParentInfoInput {
        firstname: String!
        lastname: String!
        phone_type: String
        phone_number: String!
        email_type: String
        email_address: String!
        password: String
        occupation: String
        employers_name: String
        parent_goals: String!
        parent_child_goals: String!
        live_area: Int
        level_of_education: String
        child_hs_grad: String
        child_col_grad: String
        address: String
        city: String
        state: String
        zip_code: String
        phone_type2: String
        phone_number2: String
        email_type2: String
        email_address2: String
        person_recommend: String!
    }

    input ApplicationInput {
        vendor: String!
        child: ChildIInfoInput!
        parents: [ParentInfoInput]
        section1_signature: String!
        section1_date_signed: Date!
        section2_signature: String!
        section2_date_signed: Date!
        section3_signature: String!
        section3_date_signed: Date!
        verification: String
        student_status: Int
        color_designation: String
        notes: String
        emergency_contacts: String
        section1_text: String
        section2_text: String
        section3_text: String
        section1_name: String
        section2_name: String
        section3_name: String
    }

    input UpdateApplicationInput {
        app_id: String!
        verification: String
        student_status: String
        color_designation: String
        notes: String
        class_teacher: String
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
        color: String
        visibility: String
        recurring: String
        recurring_end_date: Date
        allowed_edit: Boolean
        group_ids:[String]
    }
    type Contact{
        id: String
        user_id: String
        first_name: String
        last_name: String
        email: String
        phone_number: String
        relation: String
        added_by:String
        profile_img: String
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
        email: String
        image: String!
        name: String!      
        color: String!   
        familyMembers:[String]
        groups:[String]
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
        customgender: String
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

    type EventInvitation {
        id:String
        name: String
        status: String
        user_id: String
    }

    type Grade {
        id: String
        name: String
    }

    type Vendor {
        id: String!
        user: String!
        name: String
        section1_text: String
        section2_text: String
        section3_text: String
        section1_name: String
        section2_name: String
        section3_name: String
        section1_show: Int
        section2_show: Int
        section3_show: Int
        id2: Int
    }

    type Score {
        id: String!
        type: String
        result: Float
        year: String
        month: String
    }

    type Child {
        ch_id: String!
        firstname: String!
        lastname: String!
        age: Int!
        birthdate: Date!
        gender: String!
        phone_type: String
        phone_number: String
        email_type: String
        email_address: String
        phone_type2: String
        phone_number2: String
        email_type2: String
        email_address2: String
        address: String!
        city: String!
        state: String!
        zip_code: String!
        location_site: String!
        programs: String
        school_name: String!
        school_phone: String
        has_suspended: Int
        year_taken: String
        hobbies: String
        life_events: String
        career_goals: String
        colleges: String
        affiliations: String
        awards: String
        accomplishments: String
        mentee_gain_program: String
        grade_number: String!
        grade_desc: String!
        class_rank: String
        gpa_quarter_year: String
        gpa_quarter_q1: String
        gpa_quarter_q2: String
        gpa_quarter_q3: String
        gpa_quarter_q4: String
        gpa_cumulative_year: String
        gpa_cumulative_q1: String
        gpa_cumulative_q2: String
        gpa_cumulative_q3: String
        gpa_cumulative_q4: String
        doctor_name: String
        doctor_phone: String
        hospital_preference: String
        hospital_phone: String
        child_lives_with: String!
    }

    type Parent {
        parent_id: String!
        firstname: String!
        lastname: String!
        phone_type: String
        phone_number: String!
        email_type: String
        email_address: String!
        password: String
        occupation: String
        employers_name: String
        parent_goals: String!
        parent_child_goals: String!
        live_area: Int
        level_of_education: String
        child_hs_grad: String
        child_col_grad: String
        emergency_contacts: String
        phone_type2: String
        phone_number2: String
        email_type2: String
        email_address2: String
        person_recommend: String!
    }

    type Application {
        id: Int
        app_id: String
        vendor: String
        child: Child
        parents: [Parent]
        section1_signature: String
        section1_date_signed: Date
        section2_signature: String
        section2_date_signed: Date
        section3_signature: String
        section3_date_signed: Date
        verification: String
        student_status: String
        color_designation: String
        notes: String
        application_date: Date
        archived_date: Date
        class_teacher: String
        section1_text: String
        section2_text: String
        section3_text: String
        section1_name: String
        section2_name: String
        section3_name: String
    }

    type ParentUserApplication{
        name: String
        email_address:String
        firstname:String
        lastname:String 
        phone_number:String
        address: String
        city:String
        zip_code: String
        child_id: String
        parent_id: String
        application_id: String
        verification: String
    }
    type UserApplication {
        child: [ParentUserApplication]
        parent: [ParentUserApplication]
    }

    type CheckUserEmail{
        status:String
        is_exist:Boolean
    }

`;

const mutations = `
    type RootMutation{
        signUp(user: UserSignupInput!):Status
        signIn(user:UserSignInInput!):UserSignInType
        changePassword(user:UserChangePasswordInput!):Status
        userUpdate(user: UserUpdateInput!):Status
        createContact(contact: ContactInput): [Contact]
        deleteContacts(id: String!,user_id:String!,added_by_id:String!): [Contact]
        updateContact(contact: ContactInput!): [Contact]
        createGroup(group: GroupInput!) : AllGroups
        updateGroup(group: GroupInput!): AllGroups        
        createCalendar(calendar:CalendarInput!):CalendarType
        editCalendar(calendar:CalendarInput!):CalendarType
        deleteCalendar(calendar:CalendarInput!):CalendarType
        cloneCalendar(calendar:CalendarInput!):CalendarType
        deleteGroup(id: String!, email:String!): AllGroups
        createEvent(event:EventInput!): [Event]
        updateEvent(event:EventInput!): [Event]
        deleteEvent(id: String!, email:String!): [Event]
        addApplication(applications: [ApplicationInput]): Status
        updateApplication(application: UpdateApplicationInput!): Status
        archivedApplications(app_ids: [String]): Status
        updateVendor(vendor: VendorInput!): Vendor
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
        calendar(id:String!):CalendarsType        
        getGroupMembers(id:String!):[Contact],        
        getEvents(email:String!):[Event],
        getUserList(keyword:String!): [User]  
        familymembers(access_token: String!,token_type: String!):[FammilyMemberType]  
        getEventInvitedUser(email: String):[EventInvitation]  
        grades: [Grade]
        vendors: [Vendor]
        vendor(user: String): Vendor
        getApplications: [Application]
        getVendorApplications(vendor_id: String!): [Application]
        getVendorArchivedApplications(vendor_id: String!): [Application]
        getApplicationById(id: String!): Application
        getApplication(application_id: String!): Application
        getUserApplications(email: String!): UserApplication
        getUserByEmail(email: String): CheckUserEmail
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
