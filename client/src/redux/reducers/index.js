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
  loading
});
export default reducer;
