import * as actionType from "./Constant";

export const setContactLoading = value => {
  return {
    type: actionType.SET_CONTACT_LOADING,
    value
  };
};

export const setGroupLoading = value => {
  return {
    type: actionType.SET_GROUP_LOADING,
    value
  };
};

export const setGroupMemberLoadingLoading = value => {
  return {
    type: actionType.SET_GROUP_MEMBER_LOADING,
    value
  };
};

export const setEventLoading = value => {
  return {
    type: actionType.SET_EVENT_LOADING,
    value
  };
};

export const setProfileLoading = value => {
  return {
    type: actionType.SET_PROFILE_LOADING,
    value
  };
};

export const setApplicationLoading = value => {
  return {
    type: actionType.SET_APPLICATION_LOADING,
    value
  };
}

export const setFormSettingsLoading = value => {
  return {
    type: actionType.SET_FORM_SETTINGS_LOADING,
    value
  };
}