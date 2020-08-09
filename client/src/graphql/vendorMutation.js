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
    }
  }
`;

//mutation
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
        user
        app_grp_id
      }
    }
  }
`;