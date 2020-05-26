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
  getCalendar,
} from "../../api/calendars";
import {
  createNewEvent,
  editEvents,
  getUserEvents,
  removeEvents,
} from "../../api/events";
import { getFamilyMembers } from "../../api/familymembers";
import { getGrades } from "../../api/grades";
import { getVendors, updateVendor, addVendor } from "../../api/vendor";
import {
  createApplication,
  getApplicationsByVendor,
} from "../../api/applications";
import { addChild, getChildInformation } from "../../api/child";
import { addParent, getParentByApplication } from "../../api/parents";

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
    async calendar(root, { id }, context) {
      return await getCalendar({ id });
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
    // ADDED BY JEROME
    async grades(root, args, context) {
      const grades = await getGrades();
      return grades;
    },
    async vendors(root, args, context) {
      const vendors = await getVendors();
      return vendors;
    },
    async vendor(root, { user }, context) {
      const vendors = await getVendors();
      console.log("vendors", vendors);
      let vendor = vendors.filter((vendor) => {
        return user == vendor.user;
      })[0];

      if (vendor) {
        return vendor;
      } else {
        vendor = await addVendor({ user: user });
        return vendor;
      }
    },
    async getVendorApplications(root, { vendor_id }, context) {
      let applications = await getApplicationsByVendor(vendor_id);

      let resapplications = [];

      for (let application of applications) {
        let child = await getChildInformation(application.child);
        console.log("application child ", application.child);
        console.log("child ", child);
        application.parents = await getParentByApplication(application.app_id);
        application.child = child.length > 0 ? child[0] : {};

        resapplications.push(application);
      }

      return resapplications;
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
      console.log("Eventtttttt", event);
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
    //ADDED BY JEROME
    async updateVendor(root, { vendor }, context) {
      return await updateVendor(vendor);
    },
    async addApplication(root, { applications }, context) {
      for (let application of applications) {
        const child = await addChild(application.child);
        const parents = application.parents;

        application.child = child.ch_id;

        application = await createApplication(application);

        for (let parent of parents) {
          parent.application = application.app_id;
          parent = await addParent(parent);
        }
      }

      return {
        messageType: "info",
        message: "application created",
      };
    },
  },
};

export default resolvers;
