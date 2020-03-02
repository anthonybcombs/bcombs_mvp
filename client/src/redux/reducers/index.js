import { combineReducers } from "redux";
import auth from "./Auth";
import events from "./Events";
import familyMembers from "./FamilyMembers";
import calendars from "./Calendars";
import settings from "./Settings";
const reducer = combineReducers({
  auth,
  events,
  familyMembers,
  calendars,
  settings
});
export default reducer;
