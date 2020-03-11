import { combineReducers } from "redux";
import auth from "./Auth";
import events from "./Events";
import familyMembers from "./FamilyMembers";
import calendars from "./Calendars";
import settings from "./Settings";
import groups from "./Groups";
import contacts from "./Contacts";
import relatives from "./Relatives";
import userTypes from "./UserTypes";
const reducer = combineReducers({
  auth,
  events,
  familyMembers,
  calendars,
  groups,
  settings,
  contacts,
  relatives,
  userTypes
});
export default reducer;
