import { combineReducers } from "redux";
import auth from "./Auth";
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
import vendor from "./Vendors"
import applications from "./Applications"

const reducer = combineReducers({
  auth,
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
  vendor,
  applications
});
export default reducer;
