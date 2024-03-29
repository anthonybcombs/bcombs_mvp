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
        app_group_ids: [String]
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
        logo: String
        is_daycare: Int
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
        image: String
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
        is_entrepreneur: Int
        include_in_directory: String
        business_name: String
        business_website: String
        business_phone: String
        business_email: String
        business_industry: String
        business_address: String
        business_description: String
        employment_status: String
        allergies_to_medicine: String
        food_allergies: String
        insect_allergies: String
        other_allergies: String
        current_medications: String
        health_insurance_information: String
        new_childId: String
    }

    input ParentInfoInput {
        firstname: String!
        lastname: String!
        image: String
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
        is_parent_allow_shared: Int
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
        image: String

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
        image: String
        is_parent_allow_shared: Int
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
        is_lot: Int
    }

    input UpdateApplicationInput {
        app_id: String!
        verification: String
        student_status: String
        color_designation: String
        notes: String
        class_teacher: String
        is_form: Boolean
        received_reminder: Boolean
    }

    input AppGroupVendorInput {
        id: String
        is_form: Boolean
        app_grp_id: String
        name: String
        label: String
    }

    input AppGroupInput {
        app_grp_id: String
        user_id: String!
        email: String!
        vendors: [AppGroupVendorInput]
        size: Int!
        name: String!
        pool_id: String!
        
    }

    input DeleteAppGroupInput {
        app_grp_id: String!
        pool_id: String
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
        received_reminder: Boolean
        received_update: Boolean
        student_status: String
    }

    input AdminFormInput {
      form_id: String!
      isCustomForm: Boolean
    }

    input AddAdminInput {
        name: String!
        email: String!
        vendor: String!
        vendor2: Int
        forms: [AdminFormInput]
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
        vendor: String!
        currentUser: String!
        user: String!
        forms: [AdminFormInput]
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
        format: String
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
        imageString: String
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
        currentUser: String
        isOwner: Boolean
    }

    input AttendanceChildInput {
        app_id: String   
        app_group_id: String   
        attendance_status: String   
        attendance_start_time: String
        attendance_end_time: String
        volunteer_hours: Float
        mentoring_hours: Float
        child_id: String   
        vendor: String   
        is_excused: Int
    }

    input AttendanceInput {
        app_group_id: String
        attendance_type: String
        attendance_date: String
        attendance_start_time: String
        attendance_end_time: String
        attendance_list: [AttendanceChildInput]
        event_name: String
        location: String
        description: String
        create_event: Boolean
        vendorId2: Int
        user_id: String   
        event_id: String
        form_id: String
    }

    input UserAttendanceFilterConfigInput{
        creds: CredsInput
        user_id: String
        attendance_filter_config: String
    }
    input StudentGradeInput {
        student_grade_cumulative_id: Int
        class: String
        teacher_name: String
        subject: String
        designation: String
        grade_quarter_1: Float
        grade_quarter_2: Float
        grade_quarter_3: Float
        grade_quarter_4: Float
        summer_grade_1: Float
        summer_grade_2: Float
        summer_grade_3: Float
        mid_quarter_remarks: String
        final_quarter_remarks: String
        letter_grade_quarter_1: String
        letter_grade_quarter_2: String
        letter_grade_quarter_3: String
        letter_grade_quarter_4: String
        attendance_quarter_1_total: Int
        attendance_quarter_2_total: Int
        attendance_quarter_3_total: Int
        attendance_quarter_4_total: Int
        attendance_quarter_1_absent: Int
        attendance_quarter_2_absent: Int
        attendance_quarter_3_absent: Int
        attendance_quarter_4_absent: Int
        attendance_quarter_1_tardy: Int
        attendance_quarter_2_tardy: Int
        attendance_quarter_3_tardy: Int
        attendance_quarter_4_tardy: Int
        mid_final_grade: Float
        final_grade: Float
        year_final_grade: Float
        letter_mid_final_grade: String
        letter_final_grade: String
        letter_year_final_grade: String
        help_needed: String
        help_q1: String
        help_q2: String
        help_q3: String
        help_q4: String
    }

    input StudentGradeCumulativeInput {
        student_grade_cumulative_id: Int
        child_id: String
        app_id: String
        app_group_id: String
        application_type: String
        type: String
        year_level: Int
        school_type: String
        school_name: String
        school_year_start: String
        school_year_end: String
        school_year_frame: String
        class_name: String
        class_type: String
        scale: Float
        gpa_sem_1: Float
        gpa_sem_2: Float
        gpa_final: Float
        attachment: FileContentInput
        grades: [StudentGradeInput]
        mid_student_rank: Int
        final_student_rank: Int
        child_designation: String
        school_designation: String
        deleted_grades: [Int]
        date_created: String
    }

    input StudentStandardizedTestInput {
        student_test_id: Int
        child_id: String
        test_name: String
        attempt: Int
        grade_taken: Int
        month_taken: String
        score: Int
        score_percentage: Float
        ach_level: Int
        school_percentage: Float
        nationality_percentage: Float
        district_percentage: Float
        state_percentage: Float
        attachment: FileContentInput
        date_created: String
    }

    input StudentInfoInput {
        firstname: String
        lastname: String
        gender: String
        career_goals: String
        hobbies: String
        accomplishments: String
        ch_id: String
    }

    input ArchiveGroupInput {
        vendor_id: String
        app_group_id: String
        app_group_type: String
    }

    input FormFields {
      fields1: [String]
      fields2: [String]
    }

    input SetReminderInput {
      vendor_id: String!
      app_groups: [String!]
      form: String
      form_name: String
      date: String
      form_fields: FormFields
      is_customForm: Boolean
      custom_fields: String
    }

    input VendorLogoInput {
        logo: String
        vendor_id: String!
    }

    input UserAttendanceInput {
        child_id: String!
        event_id: String!
        attendance_date: String!
        attendance_start_time: String
        attendance_end_time: String
        attendance_type: String

    }

    input ParentShareByVendorInput {
        parent_id: String
        is_vendor_allow_shared: Int
    }

    input ParentVendorShareInput{
        parents: [ParentShareByVendorInput]
        vendor_id: String

    }
`;
const queryTypes = `
    scalar Date

    type UserAttendance {
        status: String
    }
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
        attendance_filter_config: String
        address: String
        birth_date: String
        custom_gender: String
        ethnicity: String
        family_relationship: String
        first_name: String
        gender: String
        grade: String
        last_name: String
        school: String
        zip_code: String
        is_custom_form_user: Boolean
        
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
        app_group_ids: [String]
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

    type EditAllGroups {
        joined_groups:[Group]
        created_groups:[Group]
        application_groups: [VendorAppGroup]
        message: String
        status: String
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
        forms: [CustomApplicationOutput]
        logo: String
        is_default: Int
        default_form: String
    }

    type Vendor2 {
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
      created_at: Date
      is_daycare: Int
      logo: String
      is_default: Int
  }

    type DefaultVendorResponse{
        message: String
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
        ch_id: String
        new_childId: String
        firstname: String
        lastname: String
        image: String
        age: Int
        birthdate: Date
        gender: String
        phone_type: String
        phone_number: String
        email_type: String
        email_address: String
        phone_type2: String
        phone_number2: String
        email_type2: String
        email_address2: String
        address: String
        city: String
        state: String
        zip_code: String
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
        is_entrepreneur: Int
        include_in_directory: String
        business_name: String
        business_website: String
        business_phone: String
        business_email: String
        business_industry: String
        business_address: String
        business_description: String
        employment_status: String
        allergies_to_medicine: String
        food_allergies: String
        insect_allergies: String
        other_allergies: String
        current_medications: String
        health_insurance_information: String
        is_parent_allow_shared: Int
        is_vendor_allow_shared: Int
    }

    type Parent {
        parent_id: String
        new_parentId: String
        firstname: String
        lastname: String
        image: String
        phone_type: String
        phone_number: String
        email_type: String
        email_address: String
        password: String
        occupation: String
        employers_name: String
        parent_goals: String
        parent_child_goals: String
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
        is_parent_allow_shared: Int
        is_vendor_allow_shared: Int
        is_profile_filled: Int
        last_login: Date
        last_verification_sent: Date
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
        is_lot: Int
        relationships: [ParentChildRelationship]
        chRelationships: [ChildChildRelationship]
        received_reminder: Boolean
        received_update: Boolean
    }

    type ParentUserApplication{
        name: String
        email_address:String
        firstname:String
        lastname:String 
        image: String
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
        user: String
        vendor: String
        form: String
        size: Int
        name: String!
        created_at: Date
        pool_id: String
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
        id: String!
        user: String
        email: String
        name: String
        vendorName: String
        vendor: String
        isOwner: Boolean
        formTitle: String
        form: String
        isLotForm: Boolean
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
        app_groups: [VendorAppGroup]
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
        child: Child
        form_contents: CustomForm
        application_date: Date
        archived_date: Date
        class_teacher: String
        color_designation: String
        verification: String
        student_status: String
        notes: String
        received_reminder: Boolean
        received_update: Boolean
        is_profile_filled: Int
        last_login: Date
        last_verification_sent: Date
    }

    type CustomApplicationByVendor {
        id: String
        app_id: String
        form: String
        class_teacher: String
        form_contents: String
        is_profile_filled: Int
        last_login: Date
        last_verification_sent: Date
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
        format: String
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
        imageString: String
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

    type UserApplicationsOutput {
        applications: [Application]
        customApplications: [SubmittedCustomApplicationOutput]
    }
    type AttendanceChild {
        app_id: String   
        attendance_status: String   
        child_id: String   
        vendor: String   
        mentoring_hours: Float
        volunteer_hours: Float
        is_excused: Int
        is_following: Int
    }

    type Attendance {
        app_group_id: String
        attendance_type: String
        attendance_date: String
        attendance_start_time: String
        attendance_end_time: String
        attendance_list: [AttendanceChild]
        event_name: String
        description: String
        location: String
        event_id: String
    }

    type AttendanceList {
        app_group_id: String
        attendance_type: String
        attendance_date: String
        attendance_start_time: String
        attendance_end_time: String
        event_name: String
        location: String
        description: String
        firstname: String
        lastname: String
        attendance_status: String
        child_id: String   
        image: String
        mentoring_hours: Float
        volunteer_hours: Float
        is_excused: Int
        is_following: Int
        app_group_name: String
        event_id: String
        event_title: String
        form_contents: CustomForm
        new_childId: String
    }

    type EventAttendanceList {
        app_group_name: String
        app_group_id: String
        group_id: String
        calendar_id: String
        event_id: String
        event_name: String
        type: String
        start_of_event: String
        end_of_event: String
        recurring: String
        recurring_end_date: String
    }

    type VendorForms {
        name: String
        id: String
        is_form: Boolean
    }

    type StudentCumulativeGrade {
        student_grade_cumulative_id: Int
        app_id: String
        app_group_id: String
        app_group_name: String
        application_type: String
        child_id: String
        form_contents: String
        year_level: Int
        school_type: String
        school_name: String
        school_year_start: String
        school_year_end: String
        school_year_frame: String
        class_name: String
        class_type: String
        class_teacher: String
        scale: Float
        gpa_sem_1: Float
        gpa_sem_2: Float
        gpa_final: Float
        attachment: String
        grades: [StudentGrades]
        firstname: String
        lastname: String
        mid_student_rank: Int
        final_student_rank: Int
        child_designation: String
        school_designation: String
        date_created: String
    }

    type StudentGrades {
        student_grade_cumulative_id: Int
        student_grades_id: Int
        class: String
        subject: String
        teacher_name: String
        designation: String
        grade_quarter_1: Float
        grade_quarter_2: Float
        grade_quarter_3: Float
        grade_quarter_4: Float
        letter_grade_quarter_1: String
        letter_grade_quarter_2: String
        letter_grade_quarter_3: String
        letter_grade_quarter_4: String
        attendance_quarter_1_total: Int
        attendance_quarter_2_total: Int
        attendance_quarter_3_total: Int
        attendance_quarter_4_total: Int
        attendance_quarter_1_absent: Int
        attendance_quarter_2_absent: Int
        attendance_quarter_3_absent: Int
        attendance_quarter_4_absent: Int
        attendance_quarter_1_tardy: Int
        attendance_quarter_2_tardy: Int
        attendance_quarter_3_tardy: Int
        attendance_quarter_4_tardy: Int
        attendance_quarter_1_present: Int
        attendance_quarter_2_present: Int
        attendance_quarter_3_present: Int
        attendance_quarter_4_present: Int
        mid_quarter_remarks: String
        final_quarter_remarks: String
        summer_grade_1: Float
        summer_grade_2: Float
        summer_grade_3: Float
        quarter_average: Float
        semestral_1_average: Float
        semestral_2_average: Float
        semestral_final: Float
        final_semestral_1_attendance: Int
        final_semestral_2_attendance: Int
        final_quarter_attendance: Int
        mid_final_grade: Float
        final_grade: Float
        year_final_grade: Float
        letter_mid_final_grade: String
        letter_final_grade: String
        letter_year_final_grade: String
        attendance: Int
        help_needed: String
        help_q1: String
        help_q2: String
        help_q3: String
        help_q4: String
        date_created: String
    }

    type StudentStandardizedTest {
        student_test_id: Int
        child_id: String
        test_name: String
        attempt: Int
        grade_taken: Int
        month_taken: String
        score: Int
        score_percentage: Float
        ach_level: Int
        school_percentage: Float
        nationality_percentage: Float
        district_percentage: Float
        state_percentage: Float
        attachment: String
        date_created: String
    }

    type StudentInfo {
        firstname: String
        lastname: String
        age: Int
        image: String
        birthdate: Date
        gender: String
        career_goals: String
        hobbies: String
        accomplishments: String
        ch_id: String
        form_contents: String
        app_id: String
        new_childId: String
    }

    type StudentRecords {
        standardized_test: [StudentStandardizedTest]
        cumulative_grades: [StudentCumulativeGrade]
        info: StudentInfo
    }
 
    type StudentByGroupSummary {
        child_id: String
        firstname: String
        lastname: String
        app_group_id: String
        app_group_name: String
        app_id: String
        form_contents: String
        image: String
        cumulative_grades: [StudentCumulativeGrade]
        standardized_test: [StudentStandardizedTest]
    }
    
    type ArchivedGroup {
        archived_group_id: Int
        vendor_id: String
        app_group_id: String
        app_group_type: String
    }

    type ApplicationReminder {
      id: Int
      vendor_reminder_id: String
      vendor: String
      app_groups: [VendorAppGroup!]
      form: String
      form_name: String
      date_reminder: Date
      active: Boolean
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
        createVendor(vendor: VendorInput!): Vendor2
        updateVendor(vendor: VendorInput!): Vendor
        addVendorAppGroup(appGroup: AppGroupInput!): EditAllGroups
        editVendorAppGroup(appGroup: AppGroupInput!): EditAllGroups
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
        updateUserAttendanceFilterConfig(user_attendance_filter_config: UserAttendanceFilterConfigInput): User
        addUpdateStudentCumulative(studentCumulative: [StudentGradeCumulativeInput]): [StudentCumulativeGrade]
        addUpdateStudentStandardizedTest(studentStandardizedTest: [StudentStandardizedTestInput]): [StudentStandardizedTest]
        deleteStudentStandardizedTest(studentTestIds:[Int]): [StudentStandardizedTest]
        updateChildInfo (child: StudentInfoInput): StudentInfo
        addArchivedGroup(archivedGroup: [ArchiveGroupInput]): [ArchivedGroup]
        removeGroupFromArchive(archivedGroupIds: [Int], vendorId: String): [ArchivedGroup]
        createGroupReminder(groupReminder: SetReminderInput): [ApplicationReminder]
        updateVendorLogo(vendorLogo: VendorLogoInput): Vendor
        createUpdateChildAttendance(user: UserAttendanceInput): UserAttendance
        updateParentVendorShare(parents: [ParentShareByVendorInput], vendor_id: String, app_group_id: String ,form_type: String): [Parent]
        updateDefaultVendor(user_id: String!, vendor_id:String): DefaultVendorResponse
        updateDefaultVendorForms(form_id: String!, vendor_id:String): DefaultVendorResponse
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
        vendorsByUser(user: String, withApplications: Boolean): [Vendor]
        getVendorById2(id2: String): [Vendor]
        getVendorById(id: String): [Vendor]
        getApplications: [Application]
        getVendorApplications(vendor_id: String!): [Application]
        getVendorArchivedApplications(vendor_id: String!): [Application]
        getApplicationById(id: String!): Application
        getApplication(application_id: String!): Application
        getUserApplications(email: String!): UserApplication
        getUserByEmail(email: String): CheckUserEmail
        getVendorAppGroups(vendor: String): [VendorAppGroup]
        getUserApplicationsByUserId(user_id: String!): UserApplicationsOutput
        getApplicationHistory(app_id: String!): [ApplicationHistory]
        getUserApplicationHistory(id: String!):[ApplicationHistory]
        getVendorAdminsByUser(user: String): [Admin]
        getParentChildRelationship(relationships: [ParentChildRelationshipInput]): [ParentChildRelationship]
        getVendorCustomApplicationForms(filter: CustomApplicationFormFilterInput): [CustomApplicationOutput]
        getCustomApplicationsByFormId(form_id: String!): CustomApplicationOutput
        getCustomFormApplicants(form_id: String): [SubmittedCustomApplicationOutput]
        getCustomFormApplicantById(app_id: String): SubmittedCustomApplicationOutput
        getCustomApplicationHistoryById(app_id: String!): [ApplicationHistory]
        getAttendance(application_group_id: String, attendance_type: String): [AttendanceList]
        getAttendanceByEvent(event_id: String!, application_group_id: String, attendance_type: String): [AttendanceList]
        getEventAttendance(application_group_id: String): [EventAttendanceList]
        getUserVendorForms(user: String!): [VendorForms]
        getFormAppGroup(form: String!): [VendorAppGroup]
        getAllFormAppGroupsByVendor(vendor: String): [VendorAppGroup]
        getCustomApplicationByVendor(vendor: String): [CustomApplicationByVendor]
        getStudentCumulative(app_group_id: String,user_id: String): StudentCumulativeGrade
        getStudentCumulativeGradeByAppGroup(app_group_id: String, app_group_type: String): [StudentByGroupSummary]
        getStudentCumulativeGradeByVendor(vendor_id: String): [StudentByGroupSummary]
        getStudentCumulativeGradeByParent(parent_id: [String]): [StudentByGroupSummary]
        getStudentCumulativeGradeByUser(child_id: String): [StudentCumulativeGrade]
        getStudentTest(child_id: String): [StudentStandardizedTest]
        getStudentRecords(child_id: String, application_type: String): StudentRecords
        getArchivedGroup(vendor_id: String): [ArchivedGroup]
        getVendorApplicationReminder(vendor_id: String): [ApplicationReminder]
        triggerCronSetReminder: String
        getParentByVendor(vendor_id: String, app_group_id: String, form_type: String, vendor_mode: Boolean): [Parent]
      }
`;


// getVendorAppGroups(vendor: String): AllGroups
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
