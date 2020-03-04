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
    case actionType.REQUEST_UPDATE_CONTACT_COMPLETED:
      return state.map(contact => {
        if (contact.id === action.payload.id) {
          return { ...action.payload };
        }
        return contact;
      });
    case actionType.REQUEST_REMOVE_CONTACT_COMPLETED:
      return state.filter(contact => contact.id !== action.payload.id);
    default:
      return state;
  }
}
