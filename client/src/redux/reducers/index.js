import { combineReducers } from "redux";
import auth from "./Auth";
import events from "./Events";
import familyMembers from "./FamilyMembers";
import calendars from "./Calendars";
const reducer = combineReducers({
  auth,
  events,
  familyMembers,
  calendars
});
export default reducer;
