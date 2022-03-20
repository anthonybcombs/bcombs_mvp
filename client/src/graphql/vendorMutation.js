import gql from "graphql-tag";

//query
export const VENDORS_QUERY = gql`
  query getVendors {
    vendors {
      id
      user
      id2
      name
      section1_text
      section2_text
      section3_text
      section1_name
      section2_name
      section3_name
      section1_show
      section2_show
      section3_show
      is_daycare
      logo
    }
  }
`;

export const VENDOR_BY_USER_QUERY = gql`
  query getVendor($user: String, $withApplications: Boolean) {
    vendorsByUser(user: $user, withApplications: $withApplications) {
      id
      user
      id2
      name
      section1_text
      section2_text
      section3_text
      section1_name
      section2_name
      section3_name
      section1_show
      section2_show
      section3_show
      created_at
      is_daycare
      logo
      app_programs {
        id
        vendor_program_id
        vendor
        user
        name
        created_at
      }
      location_sites {
        id
        vendor_location_site_id
        vendor
        user
        name
        created_at
      }
      app_groups {
        id
        name
        size
        vendor
        pool_id
        form
        user
        app_grp_id
      }
      forms {
        id
        form_id
        form_contents {
          formTitle
        }
      }
    }
  }
`;

export const VENDOR_BY_ID2_QUERY = gql`
  query getVendorById2($id2: String) {
    getVendorById2(id2: $id2) {
      id
      user
      id2
      name
      section1_text
      section2_text
      section3_text
      section1_name
      section2_name
      section3_name
      section1_show
      section2_show
      section3_show
      created_at
      is_daycare
      logo
      app_programs {
        id
        vendor_program_id
        vendor
        user
        name
        created_at
      }
      location_sites {
        id
        vendor_location_site_id
        vendor
        user
        name
        created_at
      }
      app_groups {
        id
        name
        size
        vendor
        pool_id
        form
        user
        app_grp_id
      }
    }
  }
`;

export const VENDOR_BY_ID_QUERY = gql`
  query getVendorById($id: String) {
    getVendorById(id: $id) {
      id
      user
      id2
      name
      section1_text
      section2_text
      section3_text
      section1_name
      section2_name
      section3_name
      section1_show
      section2_show
      section3_show
      created_at
      is_daycare
      logo
      app_programs {
        id
        vendor_program_id
        vendor
        user
        name
        created_at
      }
      location_sites {
        id
        vendor_location_site_id
        vendor
        user
        name
        created_at
      }
      app_groups {
        id
        name
        size
        vendor
        pool_id
        form
        user
        app_grp_id
      }
    }
  }
`;

export const GET_VENDOR_ADMINS = gql`
  query getVendorAdminsByUser($user: String!) {
    getVendorAdminsByUser(user: $user) {
      id
      user
      email
      vendorName
      vendor
      isOwner
      name
      formTitle
      form
    }
  }
`;

export const GET_USER_VENDOR_FORMS = gql`
  query getUserVendorForms($user:String!) {
    getUserVendorForms(user: $user) {
      name
      id
      is_form
    }
  }
`;

export const GET_VENDOR_REMINDER = gql`
  query getVendorApplicationReminder($vendor_id: String) {
    getVendorApplicationReminder(vendor_id: $vendor_id) {
        id
        vendor_reminder_id
        vendor
        app_groups {
          name
          app_grp_id
        }
        form
        form_name
        date_reminder
        active
    }
  }
`

//mutation

export const ADD_VENDOR_ADMIN = gql`
  mutation addVendorAdmin($admin: AddAdminInput) {
    addVendorAdmin(admin: $admin) {
      id
      user
      email
      vendorName
      vendor
      isOwner
      name
      formTitle
      form
    }
  }
`;

export const UPDATE_VENDOR_ADMIN = gql`
  mutation updateVendorAdmin($admin: UpdateAdminInput) {
    updateVendorAdmin(admin: $admin) {
      id
      user
      email
      vendorName
      vendor
      isOwner
      name
      formTitle
      form
    }
  }
`;

export const DELETE_VENDOR_ADMIN = gql`
  mutation deleteVendorAdmin($admins: [DeleteAdminInput]) {
    deleteVendorAdmin(admins: $admins) {
      id
      user
      email
      vendorName
      vendor
      isOwner
      name
      formTitle
      form
    }
  }
`;

export const CREATE_VENDOR = gql`
  mutation createVendor($vendor: VendorInput!) {
    createVendor(vendor: $vendor) {
      id
      user
      id2
      name
      section1_text
      section2_text
      section3_text
      section1_name
      section2_name
      section3_name
      section1_show
      section2_show
      section3_show
      logo
    }
  }
`

export const VENDOR_UPDATE_MUTATION = gql`
  mutation vendor($vendor: VendorInput!) {
    updateVendor(vendor: $vendor) {
      id
      user
      id2
      name
      section1_text
      section2_text
      section3_text
      section1_name
      section2_name
      section3_name
      section1_show
      section2_show
      section3_show
      logo
    }
  }
`;

export const ADD_VENDORS_APP_GROUP = gql`
  mutation addVendorAppGroup($appGroup: AppGroupInput!) {
    addVendorAppGroup(appGroup: $appGroup) {
      joined_groups {
        id
        name
        contacts
      }
      created_groups {
        id
        name
        contacts
      }
      application_groups {
        id
        name
        size
        vendor
        pool_id
        form
        user
        app_grp_id
      }
      message
    }
  }
`;

export const UPDATE_VENDORS_APP_GROUP = gql`
  mutation editVendorAppGroup($appGroup: AppGroupInput!) {
    editVendorAppGroup(appGroup: $appGroup) {
      joined_groups {
        id
        name
        contacts
      }
      created_groups {
        id
        name
        contacts
      }
      application_groups {
        id
        name
        size
        vendor
        pool_id
        form
        user
        app_grp_id
      }
      message
      status
    }
  }
`;
export const DELETE_VENDORS_APP_GROUP = gql`
  mutation deleteVendorAppGroup($appGroup: DeleteAppGroupInput!) {
    deleteVendorAppGroup(appGroup: $appGroup) {
      joined_groups {
        id
        name
        contacts
      }
      created_groups {
        id
        name
        contacts
      }
      application_groups {
        id
        name
        size
        vendor
        pool_id
        form
        user
        app_grp_id
      }
    }
  }
`;


export const GET_VENDOR_APP_GROUP = gql`
  query getAllFormAppGroupsByVendor($vendor: String) {
    getAllFormAppGroupsByVendor(vendor: $vendor) {
      id
      app_grp_id
      user
      vendor
      form
      size
      name
      created_at
      pool_id
    }
  }
`;



export const GET_ARCHIVED_GROUP = gql`
  query getArchivedGroup($vendor_id: String) {
    getArchivedGroup(vendor_id: $vendor_id) {
      archived_group_id
      vendor_id
      app_group_id
      app_group_type
    }
  }
`;



export const ADD_ARCHIVED_GROUP = gql`
  mutation addArchivedGroup($archivedGroup: [ArchiveGroupInput]) {
    addArchivedGroup(archivedGroup: $archivedGroup) {
    archived_group_id
    vendor_id
    app_group_id
    app_group_type
    }
  }
`;

export const DELETE_ARCHIVED_GROUP = gql`
  mutation removeGroupFromArchive($archivedGroupIds: [Int], $vendorId: String) {
    removeGroupFromArchive(archivedGroupIds: $archivedGroupIds, vendorId: $vendorId) {
      archived_group_id
      vendor_id
      app_group_id
      app_group_type
    }
  }
`;

export const CREATE_GROUP_REMINDER = gql`
  mutation createGroupReminder($groupReminder: SetReminderInput) {
    createGroupReminder(groupReminder: $groupReminder) {
      id
      vendor_reminder_id
      vendor
      app_groups {
        name
        app_grp_id
      }
      form
      form_name
      date_reminder
      active
    }
  }
`;



export const UPDATE_VENDOR_LOGO = gql`
  mutation updateVendorLogo($vendorLogo: VendorLogoInput) {
    updateVendorLogo(vendorLogo: $vendorLogo) {
      id
      user
      id2
      name
      section1_text
      section2_text
      section3_text
      section1_name
      section2_name
      section3_name
      section1_show
      section2_show
      section3_show
      logo
    }
  }
`;


