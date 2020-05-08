import {
  getUsers,
  getUserInfo,
  executeSignUp,
  executeSignIn,
  executeChangePassword,
  executeUserUpdate
} from "../../api/users";
import { getUserTypes } from "../../api/userTypes/";
import {
  createNewContact,
  editContact,
  getContacts,
  removeContact
} from "../../api/contacts";
import {
  getUserGroups,
  editGroups,
  removeGroup,
  createNewGroup,
  getMembers
} from "../../api/groups";
import { executeCreateCalendar, getCalendars } from "../../api/calendars";

const resolvers = {
  RootQuery: {
    async userInfo(root, args, context) {
      const user = await getUserInfo(args);
      return user;
    },
    async users(root, args, context) {
      const creds = {
        access_token: args.access_token,
        token_type: args.token_type
      };
      const users = await getUsers();
      return users.filter(user => {
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
      console.log("getGroupMembers id", id);
      return await getMembers(id);
    }
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
      const response = await createNewContact(contact);
      console.log("createContact createNewContact *****************", response);
      return response;
    },
    async deleteContacts(root, args, context) {
      return await removeContact(args.id);
    },
    async updateContact(root, { contact }, context) {
      return await editContact(contact);
    },
    async createGroup(root, { group }, context) {
      console.log("createGroup group *****************", group);
      const response = await createNewGroup(group);
      return response;
    },
    async updateGroup(root, { group }, context) {
      console.log("updateGroup group", group);
      const response = await editGroups(group);
      console.log("updateGroup response", response);
      return response;
    },
    async deleteGroup(root, args, context) {
      console.log("deleteGrouppp", args);
      return await removeGroup(args.id, args.email);
    },
    async createCalendar(root, { calendar }, context) {
      return await executeCreateCalendar(calendar);
    }
  }
};

export default resolvers;
