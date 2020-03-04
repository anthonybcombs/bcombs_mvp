import { initialState } from "../initialState";
import * as actionType from "../actions/Constant";
export default function Events(state = initialState.groups, action) {
  switch (action.type) {
    default:
      return state;
  }
}
