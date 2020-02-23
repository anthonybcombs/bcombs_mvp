import { combineReducers } from "redux";
import auth from "./Auth";
import events from "./Events";
const reducer = combineReducers({
  auth,
  events
});
export default reducer;
