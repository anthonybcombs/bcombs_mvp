import { combineReducers } from "redux";
import auth from "./Auth";
import attendance from "./Attendance";
import events from "./Events";
import familyMembers from "./FamilyMembers";
import calendars from "./Calendars";
import settings from "./Settings";
import groups from "./Groups";
import groupMembers from "./Members";
import contacts from "./Contacts";
import relatives from "./Relatives";
import user from "./Users";
import userTypes from "./UserTypes";
import status from "./Status";
import loading from "./Loading";
import grades from "./Grades";
import vendors from "./Vendors";
import applications from "./Applications";
import admins from "./Admins";
import form from "./Forms";
import vendorForms from "./VendorForms";
import gradeInput from "./GradeInput";
import appReminders from "./AppReminders"
import vendor from "./Vendor";

const reducer = combineReducers({
  auth,
  attendance,
  events,
  familyMembers,
  calendars,
  groups,
  groupMembers,
  settings,
  contacts,
  relatives,
  user,
  userTypes,
  status,
  loading,
  grades,
  vendors,
  applications,
  admins,
  form,
  vendorForms,
  gradeInput,
  appReminders,
  vendor
});
export default reducer;
