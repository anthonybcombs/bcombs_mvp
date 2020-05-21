import {
  getUsers,
  getUserInfo,
  executeSignUp,
  executeSignIn,
  executeChangePassword,
  executeUserUpdate,
  executeGetUser,
} from "../../api/users";
import { getUserTypes } from "../../api/userTypes/";
import {
  createNewContact,
  editContact,
  getContacts,
  removeContact,
} from "../../api/contacts";
import {
  getUserGroups,
  editGroups,
  removeGroup,
  createNewGroup,
  getMembers,
} from "../../api/groups";
import {
  executeCreateCalendar,
  executeEditCalendar,
  getCalendars,
  executeDeleteCalendar,
} from "../../api/calendars";
import {
  createNewEvent,
  editEvents,
  getUserEvents,
  removeEvents,
} from "../../api/events";
import { getFamilyMembers } from "../../api/familymembers";

const resolvers = {
  RootQuery: {
    async userInfo(root, args, context) {
      const user = await getUserInfo(args);
      return user;
    },
    async users(root, args, context) {
      const creds = {
        access_token: args.access_token,
        token_type: args.token_type,
      };
      const users = await getUsers();
      return users.filter((user) => {
        if (args.email) {
          return user.email === args.email;
        }
        if (args.username) {
          return user.username === args.username;
        }
        return true;
      });
    },
    async userTypes(root, args, context) {
      const userTypes = await getUserTypes();
      return userTypes;
    },
    async calendars(root, { access_token, token_type }, context) {
      return await getCalendars({ access_token, token_type });
    },
    async familymembers(root, { access_token, token_type }, context) {
      return await getFamilyMembers({ access_token, token_type });
    },
    // ADDED BY DENNIS
    async getContact(root, { email }, context) {
      const contacts = await getContacts(email);
      return contacts;
    },
    async getUserGroup(root, { email }, context) {
      const response = await getUserGroups(email);
      return response;
    },
    async getGroupMembers(root, { id }, context) {
      return await getMembers(id);
    },
    async getEvents(root, { email }, context) {
      return await getUserEvents(email);
    },
    async getUserList(root, { keyword }, context) {
      console.log("Get User List", keyword);
      return await executeGetUser(keyword);
    },
  },
  RootMutation: {
    async signUp(root, { user }, context) {
      return await executeSignUp(user);
    },
    async signIn(root, { user }, context) {
      return await executeSignIn(user);
    },
    async changePassword(root, { user, context }) {
      return await executeChangePassword(user);
    },
    async userUpdate(root, { user }, context) {
      return await executeUserUpdate(user);
    },
    async createContact(root, { contact }, context) {
      console.log("Create Contact", contact);
      const response = await createNewContact(contact);
      return response;
    },
    async deleteContacts(root, args, context) {
      return await removeContact(args);
    },
    async updateContact(root, { contact }, context) {
      console.log("updateContact args", contact);
      return await editContact(contact);
    },
    async createGroup(root, { group }, context) {
      const response = await createNewGroup(group);
      return response;
    },
    async updateGroup(root, { group }, context) {
      return await editGroups(group);
    },
    async deleteGroup(root, args, context) {
      return await removeGroup(args.id, args.email);
    },
    async createCalendar(root, { calendar }, context) {
      return await executeCreateCalendar(calendar);
    },
    async editCalendar(root, { calendar }, context) {
      return await executeEditCalendar(calendar);
    },
    async deleteCalendar(root, { calendar }, context) {
      return await executeDeleteCalendar(calendar);
    },
    async createEvent(root, { event }, context) {
      return await createNewEvent(event);
    },
    async updateEvent(root, { event }, context) {
      return await editEvents(event);
    },
    async deleteEvent(root, { id, email }, context) {
      console.log("Delete Event ID", id);
      console.log("Delete Event ID", email);
      return await removeEvents(id, email);
    },
  },
};

export default resolvers;
