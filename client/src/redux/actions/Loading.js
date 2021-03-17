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

export const setUserApplicationLoading = value => {
  return {
    type: actionType.SET_USER_APPLICATION_LOADING,
    value
  };
}

export const setFormSettingsLoading = value => {
  return {
    type: actionType.SET_FORM_SETTINGS_LOADING,
    value
  };
}

export const setAddAdminLoading = value => {
  return {
    type: actionType.SET_ADD_ADMIN_LOADING,
    value
  };
}

export const setDeleteAdminLoading = value => {
  return {
    type: actionType.SET_DELETE_ADMIN_LOADING,
    value
  };
}

export const setAddFormLoading = value => {
  return {
    type: actionType.SET_ADD_FORM_LOADING,
    value
  };
}

export const setUpdateFormLoading = value => {
  return {
    type: actionType.SET_UPDATE_FORM_LOADING,
    value
  };
}

export const setGetFormLoading = value => {
  return {
    type: actionType.SET_GET_FORM_LOADING,
    value
  };
}

export const setDeleteFormLoading = value => {
  return {
    type: actionType.SET_DELETE_FORM_LOADING,
    value
  };
}

export const setSubmitFormLoading = value => {
  return {
    type: actionType.SET_SUBMIT_FORM_LOADING,
    value
  };
}

export const setGradeLoading = value => {
  return {
    type: actionType.SET_GRADE_LOADING,
    value
  };
}