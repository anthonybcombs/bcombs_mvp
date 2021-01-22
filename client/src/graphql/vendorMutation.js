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
    }
  }
`;

export const VENDOR_BY_USER_QUERY = gql`
  query getVendor($user: String) {
    vendorsByUser(user: $user) {
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
      user
      email
      vendorName
      vendor
      isOwner
      name
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

//mutation

export const ADD_VENDOR_ADMIN = gql`
  mutation addVendorAdmin($admin: AddAdminInput) {
    addVendorAdmin(admin: $admin) {
      user
      email
      vendorName
      vendor
      isOwner
      name
    }
  }
`;

export const UPDATE_VENDOR_ADMIN = gql`
  mutation updateVendorAdmin($admin: UpdateAdminInput) {
    updateVendorAdmin(admin: $admin) {
      user
      email
      vendorName
      vendor
      isOwner
      name
    }
  }
`;

export const DELETE_VENDOR_ADMIN = gql`
  mutation deleteVendorAdmin($admins: [DeleteAdminInput]) {
    deleteVendorAdmin(admins: $admins) {
      user
      email
      vendorName
      vendor
      isOwner
      name
    }
  }
`;

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
