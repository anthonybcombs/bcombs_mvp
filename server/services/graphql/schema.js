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
        app_group_ids:[String]
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
        nickname: String
        is_child_transferring: String
        does_child_require_physical_education_service: String
        history_prev_diseases: String
        child_currently_doctors_care: String
        reasons_previous_hospitalizations: String
        comments_suggestion: String
        list_special_dietary: String
        list_any_allergies: String
        mental_physical_disabilities: String
        medical_action_plan: String
        list_fears_unique_behavior: String
        transfer_reason: String
        prev_school_phone: String
        prev_school_city: String
        prev_school_address: String
        prev_school_attended: String
        prev_school_state: String
        prev_school_zip_code: String
        preffered_start_date: String
        current_classroom: String
        primary_language: String
        needed_days: String
        schedule_tour: String
        voucher: String
        ch_id: String
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
        person_recommend: String
        age: Int
        birthdate: String
        gender: String
        ethnicities: String
        parent_id: String
    }

    input DaycareChildInfoInput {
        ch_id: String
        firstname: String!
        lastname: String!
        nickname: String
        age: Int!
        birthdate: String!
        gender: String!
        preffered_start_date: String!
        current_classroom: String!
        primary_language: String!
        needed_days: String!
        schedule_tour: String
        voucher: String!
        address: String!
        city: String!
        state: String!
        zip_code: String!
        programs: String
        ethnicities: String
        child_lives_with: String!
        has_suspended: Int
        reason_suspended: String
        is_child_transferring: String
        does_child_require_physical_education_service: String
        history_prev_diseases: String
        child_currently_doctors_care: String
        reasons_previous_hospitalizations: String
        comments_suggestion: String
        list_special_dietary: String
        list_any_allergies: String
        mental_physical_disabilities: String
        medical_action_plan: String
        list_fears_unique_behavior: String
        transfer_reason: String
        prev_school_phone: String
        prev_school_city: String
        prev_school_address: String
        prev_school_attended: String
        prev_school_state: String
        prev_school_zip_code: String
        doctor_name: String
        doctor_phone: String
        hospital_preference: String
        hospital_phone: String
    }

    input DaycareParentInfoInput {
        parent_id: String
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
        address: String
        city: String
        state: String
        zip_code: String
        phone_type2: String
        phone_number2: String
        email_type2: String
        email_address2: String
        age: Int
        birthdate: String
        gender: String
        ethnicities: String
    }

    input DaycareApplicationInput {
        vendor: String!
        child: DaycareChildInfoInput!
        parents: [DaycareParentInfoInput]
        section1_signature: String!
        section1_date_signed: Date!
        section2_signature: String!
        section2_date_signed: Date!
        section3_signature: String!
        section3_date_signed: Date!
        verification: String
        student_status: String
        color_designation: String
        notes: String
        emergency_contacts: String
        section1_text: String
        section2_text: String
        section3_text: String
        section1_name: String
        section2_name: String
        section3_name: String
        is_daycare: Int
    }

    input DaycareMainInput {
        applications: [DaycareApplicationInput]
        relationships: [ParentChildRelationshipInput]
        chRelationships: [ChildChildRelationshipInput]
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
        student_status: String
        color_designation: String
        notes: String
        emergency_contacts: String
        section1_text: String
        section2_text: String
        section3_text: String
        section1_name: String
        section2_name: String
        section3_name: String
        is_daycare: Int
    }

    input UpdateApplicationInput {
        app_id: String!
        verification: String
        student_status: String
        color_designation: String
        notes: String
        class_teacher: String
    }

    input AppGroupInput {
        app_grp_id: String
        user_id: String!
        email: String!
        vendors: [String!]
        size: Int!
        name: String!
    }

    input DeleteAppGroupInput {
        id: String!
        email: String!
    }

    input SaveDaycareApplicationUserInput {
        app_id: String
        child: DaycareChildInfoInput
        parents: [DaycareParentInfoInput]
        updated_by: String
        emergency_contacts: String!
        section1_signature: String
        section1_date_signed: Date
        section2_signature: String
        section2_date_signed: Date
        section3_signature: String
        section3_date_signed: Date
        section1_text: String
        section2_text: String
        section3_text: String
        section1_name: String
        section2_name: String
        section3_name: String
    }

    input SaveApplicationUserInput {
        app_id: String
        child: ChildIInfoInput
        parents: [ParentInfoInput]
        updated_by: String
        emergency_contacts: String!
        section1_signature: String
        section1_date_signed: Date
        section2_signature: String
        section2_date_signed: Date
        section3_signature: String
        section3_date_signed: Date
        section1_text: String
        section2_text: String
        section3_text: String
        section1_name: String
        section2_name: String
        section3_name: String,
        relationships: [ParentChildRelationshipInput]
    }

    input AddAdminInput {
        name: String!
        email: String!
        vendors: [String!]
        currentUser: String!
    }

    input DeleteAdminInput {
        user: String!
        vendor: String!
        currentUser: String!
    }

    input UpdateAdminInput{
        name: String!
        email: String!
        vendors: [String!]
        currentUser: String!
        user: String!
    }

    input ParentChildRelationshipInput {
        parent: String!
        child: String!
        relationship: String
        id: String
    }

    input ChildChildRelationshipInput {
        child: String
        child2: String
        relationship: String
    }

    input CustomApplicationInput {
        form_id: String
        vendor: String
        user: String
        form_contents: CustomFormInput
        category: String
    }

    input CustomFormInput {
        formTitle: String
        formData: [CustomFormDataInput]
    }

    input CustomFormDataInput {
        id: String
        label: String
        type: String
        fields: [CustomFormFieldsInput]
        groupType: String
        settings: CustomFormSettingsInput
        isActive: Boolean
        allowAddField: Boolean
        gridMax: Int
        includeLogic: Boolean
        includeValidation: Boolean
        hasSettings: Boolean
        supportMultiple: Boolean
        showLabel: Boolean
    }

    input CustomFormFieldsInput {
        id: String
        label: String
        type: String
        tag: String
        placeholder: String
        column: String
        value: String
        required: Boolean
        description: String
        validation: CustomFormValidationInput
        options: [CustomCheckboxOptionInput]
        columns: [CustomMatrixRatingColumnsInput]
        rows: [CustomMatrixRatingRowsInput]
        min: CustomLinearScaleMinInput
        max: CustomLinearScaleMaxInput
        scale: CustomSliderScaleInput
        scaleLabels: CustomSliderScaleLabelsInput
        items: [CustomRankingItemsInput]
        limit: Int
        errorMessage: String
        allowTypes: [CustomFileUploadTypesInput]
        isMultiple: Boolean
        requireAddOption : Boolean
        fixedWidth: Boolean
        file: FileContentInput
    }
    
    input FileContentInput {
        filename: String
        extension: String
        contentType: String
        url: String
        data: String
    }

    input CustomFileUploadTypesInput {
        label: String
        ext: [String]
        selected: Boolean
    }

    input CustomRankingItemsInput {
        label: String
        rank: Int
    }

    input CustomSliderScaleInput {
        min: Int
        max: Int
    }

    input CustomSliderScaleLabelsInput {
        left: String
        center: String
        right: String
    }

    input CustomLinearScaleMinInput {
        value: Int
        label: String
    }

    input CustomLinearScaleMaxInput {
        value: Int
        label: String
    }

    input CustomMatrixRatingColumnsInput {
        label: String
        value: Int
    }

    input CustomMatrixRatingRowsInput {
        row: String
    }

    input CustomCheckboxOptionInput {
        name: String
        label: String
        tag: String
    }

    input CustomFormValidationInput {
        include: Boolean
        items: [CustomFormValidationErrorsInput]
    }

    input CustomFormValidationErrorsInput {
        error: String
        errorField: String
        option: String
        type: String
        value: String
    }

    input CustomFormSettingsInput {
        logic: CustomFormSettingsLogicInput
        instruction: CustomFormSettingsInstructionInput
    }

    input CustomFormSettingsLogicInput {
        include: Boolean
        items: String
    }

    input CustomFormSettingsInstructionInput {
        include: Boolean
        value: String
    }

    input SubmitCustomApplicationInput {
        vendor: String!
        form: String!
        form_contents: CustomFormInput
    }

    input UpdateCustomApplicationInput {
        vendor: String!
        form: String!
        app_id: String!
        form_contents: CustomFormInput
        class_teacher: String
        color_designation: String
        verification: String
        student_status: String
        notes: String
        updated_by: String
    }

    input CustomApplicationFormFilterInput {
        vendor: String!
        categories: [String]
    }

    input AttendanceChildInput {
        app_id: String   
        attendance_status: String   
        volunteer_hours: Int
        mentoring_hours: Int
        child_id: String   
        vendor: String   
        is_excused: Int
    }

    input AttendanceInput {
        app_group_id: String
        attendance_date: String
        attendance_start_time: String
        attendance_end_time: String
        attendance_list: [AttendanceChildInput]
        event_name: String
        location: String
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
        app_group_ids:[String]
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
        application_groups: [VendorAppGroup]
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
        app_programs: [VendorProgram]
        location_sites: [LocationSite]
        app_groups: [VendorAppGroup]
        created_at: Date
        is_daycare: Int
    }

    type LocationSite {
        id: String!
        vendor_location_site_id: String!
        vendor: String!
        user: String!
        name: String
        created_at: Date
    }

    type VendorProgram {
        id: String!
        vendor_program_id: String!
        vendor: String!
        user: String!
        name: String
        created_at: Date
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
        location_site: String
        ethnicities: String
        programs: String
        school_name: String
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
        grade_number: String
        grade_desc: String
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
        child_lives_with: String
        nickname: String
        is_child_transferring: String
        does_child_require_physical_education_service: String
        history_prev_diseases: String
        child_currently_doctors_care: String
        reasons_previous_hospitalizations: String
        comments_suggestion: String
        list_special_dietary: String
        list_any_allergies: String
        mental_physical_disabilities: String
        medical_action_plan: String
        list_fears_unique_behavior: String
        transfer_reason: String
        prev_school_phone: String
        prev_school_city: String
        prev_school_address: String
        prev_school_attended: String
        prev_school_state: String
        prev_school_zip_code: String
        preffered_start_date: String
        current_classroom: String
        primary_language: String
        needed_days: String
        schedule_tour: String
        voucher: String
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
        person_recommend: String
        address: String
        city: String
        state: String
        zip_code: String
        age: Int
        birthdate: Date
        gender: String
        ethnicities: String
    }

    type Application {
        id: Int
        app_id: String
        vendor: String
        vendorName: String
        vendorGroup: [VendorAppGroup]
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
        app_histories: [ApplicationHistory]
        emergency_contacts: String
        vendorPrograms: [VendorProgram]
        vendorLocationSites: [LocationSite]
        is_daycare: Int
        relationships: [ParentChildRelationship]
        chRelationships: [ChildChildRelationship]
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

    type VendorAppGroup{
        id: Int
        app_grp_id: String!
        user: String!
        vendor: String!
        size: Int
        name: String!
        created_at: Date
    }

    type AppGroupStatus{
        messageType: String
        message: String
        vendor_app_groups: [VendorAppGroup]
    }

    type ApplicationHistory{
        id: Int
        app_history_id: String!
        app_id: String
        custom_app_id: String
        details: String
        updated_by: String
        updated_at: Date
    }

    type ApplicationUserStatus{
        application: Application
        app_histories: [ApplicationHistory]
    }

    type Admin{
        user: String
        email: String
        name: String
        vendorName: String
        vendor: String
        isOwner: Boolean
    }

    type IdFormat {
        tempId: String
        newId: String
    }
    
    type DaycareApplicationStatus{
        messageType: String
        message: String
        childs: [IdFormat]
        parents: [IdFormat]
    }

    type ParentChildRelationship {
        id: String
        parent: String
        child: String
        relationship: String
    }

    type ChildChildRelationship {
        id: String
        child: String
        child2: String
        relationship: String
        details: Child
    }

    type CustomApplicationOutput {
        id: String
        vendor: String
        user: String
        form_id: String
        form_contents: CustomForm
        category: String
        status: String
        created_at: Date
        updated_at: Date
    }

    type SubmittedCustomApplicationOutput {
        id: String
        app_id: String
        vendor: String
        form: String
        form_contents: CustomForm
        application_date: Date
        archived_date: Date
        class_teacher: String
        color_designation: String
        verification: String
        student_status: String
        notes: String
    }

    type CustomForm {
        formTitle: String
        formData: [CustomFormData]
    }

    type CustomFormData {
        id: String
        label: String
        type: String
        fields: [CustomFormFields]
        groupType: String
        settings: CustomFormSettings
        isActive: Boolean
        allowAddField: Boolean
        gridMax: Int
        includeLogic: Boolean
        includeValidation: Boolean
        hasSettings: Boolean
        supportMultiple: Boolean
        showLabel: Boolean
    }

    type CustomFormFields {
        id: String
        label: String
        type: String
        tag: String
        placeholder: String
        column: String
        value: String
        required: Boolean
        description: String
        validation: CustomFormValidation
        options: [CustomCheckboxOption]
        columns: [CustomMatrixRatingColumns]
        rows: [CustomMatrixRatingRows]
        min: CustomLinearScaleMin
        max: CustomLinearScaleMax
        scale: CustomSliderScale
        scaleLabels: CustomSliderScaleLabels
        items: [CustomRankingItems]
        limit: Int
        errorMessage: String
        allowTypes: [CustomFileUploadTypes]
        isMultiple: Boolean
        requireAddOption : Boolean
        fixedWidth: Boolean
        file: FileContent
    }

    type FileContent {
        filename: String
        extension: String
        contentType: String
        url: String
        data: String
    }

    type CustomFileUploadTypes {
        label: String
        ext: [String]
        selected: Boolean
    }

    type CustomRankingItems {
        label: String
        rank: Int
    }

    type CustomSliderScale {
        min: Int
        max: Int
    }

    type CustomSliderScaleLabels {
        left: String
        center: String
        right: String
    }

    type CustomLinearScaleMin {
        value: Int
        label: String
    }

    type CustomLinearScaleMax {
        value: Int
        label: String
    }

    type CustomMatrixRatingColumns {
        label: String
        value: Int
    }

    type CustomMatrixRatingRows {
        row: String
    }

    type CustomCheckboxOption {
        name: String
        label: String
        tag: String
    }

    type CustomFormValidation {
        include: Boolean
        items: [CustomFormValidationErrors]
    }

    type CustomFormValidationErrors {
        error: String
        errorField: String
        option: String
        type: String
        value: String
    }

    type CustomFormSettings {
        logic: CustomFormSettingsLogic
        instruction: CustomFormSettingsInstruction
    }

    type CustomFormSettingsLogic {
        include: Boolean
        items: String
    }

    type CustomFormSettingsInstruction {
        include: Boolean
        value: String
    }

    type CustomFormStatus {
        messageType: String
        message: String
        form: CustomApplicationOutput
    }

    type AttendanceChild {
        app_id: String   
        attendance_status: String   
        child_id: String   
        vendor: String   
        mentoring_hours: Int
        volunteer_hours: Int
        is_excused: Int
    }

    type Attendance {
        app_group_id: String
        attendance_date: String
        attendance_start_time: String
        attendance_end_time: String
        attendance_list: [AttendanceChild]
        event_name: String
        location: String
        
    }

    type AttendanceList {
        app_group_id: String
        attendance_date: String
        attendance_start_time: String
        attendance_end_time: String
        event_name: String
        location: String
        firstname: String
        lastname: String
        attendance_status: String   
        child_id: String   
        mentoring_hours: Int
        volunteer_hours: Int
        is_excused: Int
        app_group_name: String
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
        addApplication(applications: [ApplicationInput]): DaycareApplicationStatus
        updateApplication(application: UpdateApplicationInput!): Status
        archivedApplications(app_ids: [String]): Status
        unarchivedApplications(app_ids: [String]): Status
        updateVendor(vendor: VendorInput!): Vendor
        addVendorAppGroup(appGroup: AppGroupInput!): AllGroups
        editVendorAppGroup(appGroup: AppGroupInput!): AllGroups
        deleteVendorAppGroup(appGroup: DeleteAppGroupInput!): AllGroups
        saveApplication(application: SaveApplicationUserInput): Status
        addVendorAdmin(admin: AddAdminInput): [Admin]
        deleteVendorAdmin(admins: [DeleteAdminInput]): [Admin]
        updateVendorAdmin(admin: UpdateAdminInput): [Admin]
        addDaycareApplication(daycare: DaycareMainInput): Status
        addParentChildRelationship(relationships: [ParentChildRelationshipInput]): Status
        updateParentChildRelationship(relationships: [ParentChildRelationshipInput]): Status
        createCustomApplicationForm(application: CustomApplicationInput): CustomFormStatus
        updateCustomApplicationForm(application: CustomApplicationInput): CustomFormStatus
        deleteCustomApplicationForm(application: CustomApplicationInput): Status
        submitCustomApplicationForm(application: SubmitCustomApplicationInput): Status
        updateSubmitCustomApplication(application: UpdateCustomApplicationInput): Status
        updateAttendance(attendance: AttendanceInput): [Attendance]
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
        vendorsByUser(user: String): [Vendor]
        getVendorById2(id2: String): [Vendor]
        getVendorById(id: String): [Vendor]
        getApplications: [Application]
        getVendorApplications(vendor_id: String!): [Application]
        getVendorArchivedApplications(vendor_id: String!): [Application]
        getApplicationById(id: String!): Application
        getApplication(application_id: String!): Application
        getUserApplications(email: String!): UserApplication
        getUserByEmail(email: String): CheckUserEmail
        getVendorAppGroups(vendor: String): AllGroups
        getUserApplicationsByUserId(user_id: String!): [Application]
        getApplicationHistory(app_id: String!): [ApplicationHistory]
        getUserApplicationHistory(id: String!):[ApplicationHistory]
        getVendorAdminsByUser(user: String): [Admin]
        getParentChildRelationship(relationships: [ParentChildRelationshipInput]): [ParentChildRelationship]
        getVendorCustomApplicationForms(filter: CustomApplicationFormFilterInput): [CustomApplicationOutput]
        getCustomApplicationsByFormId(form_id: String!): CustomApplicationOutput
        getCustomFormApplicants(form_id: String): [SubmittedCustomApplicationOutput]
        getCustomFormApplicantById(app_id: String): SubmittedCustomApplicationOutput
        getCustomApplicationHistoryById(app_id: String!): [ApplicationHistory]
        getAttendance(application_group_id: String): [AttendanceList]
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
