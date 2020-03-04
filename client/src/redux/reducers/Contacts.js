import { initialState } from "../initialState";
import * as actionType from "../actions/Constant";
export default function Contacts(
  state = initialState.contacts.filter(contact =>
    contact.userIds.includes(initialState.auth.id)
  ),
  action
) {
  switch (action.type) {
    case actionType.REQUEST_ADD_CONTACT_COMPLETED:
      return [...state, action.payload];
    default:
      return state;
  }
}
