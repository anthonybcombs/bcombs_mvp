import {
  getUsers,
  getUserInfo,
  executeSignUp,
  executeSignIn,
  executeChangePassword,
  executeUserUpdate,
  executeGetUser,
  getUserApplication,
  checkUserEmail,
  executeAddUserProfile
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

import {
  executeCreateCalendar,
  executeEditCalendar,
  getCalendars,
  executeDeleteCalendar,
  executeCloneCalendar,
  getCalendar
} from "../../api/calendars";
import {
  createNewEvent,
  editEvents,
  getUserEvents,
  removeEvents
} from "../../api/events";
import { getFamilyMembers } from "../../api/familymembers";
import { getGrades } from "../../api/grades";
import {
  getVendors,
  updateVendor,
  addVendor,
  deleteAppGroup,
  editAppGroup,
  addAppGroup,
  getVendorAppGroups,
  getVendorsByUserId
} from "../../api/vendor";
import {
  createApplication,
  getApplicationsByVendor,
  updateApplication,
  archivedApplication,
  unArchivedApplication,
  getArchivedApplicationsByVendor,
  getApplicationById,
  addApplicationUser,
  saveApplication,
  getApplicationHistoryById,
  addApplicationHistory,
  getApplicationByAppId,
  getUserApplicationsByUserId,
  getApplicationHistoryByUser
} from "../../api/applications";
import { addChild, getChildInformation } from "../../api/child";
import { addParent, getParentByApplication } from "../../api/parents";

import { getUserFromDatabase } from "../../api";

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
    async vendorsByUser(root, { user }, context) {
      let vendors = await getVendorsByUserId(user);
      console.log("vendors", vendors);
      // let vendor = vendors.filter(vendor => {
      //   return user == vendor.user;
      // });

      if (vendors && vendors.length > 0) {
        return vendors;
      } else {
        vendors = await addVendor({ user: user });
        return vendors;
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
    async getUserApplications(root, { email }, context) {
      try {
        console.log("Get User Applications", email);
        const response = await getUserApplication(email);
        console.log("Get User Applications response", response);
        return response;
      } catch (err) {
        console.log("Get User Applications", err);
      }
    },
    async getUserApplicationsByUserId(root, { user_id }, context) {
      try {
        const response = await getUserApplicationsByUserId(user_id);
        return response;
      } catch (err) {
        console.log("Get User Applications", err);
      }
    },
    async getVendorArchivedApplications(root, { vendor_id }, context) {
      let applications = await getArchivedApplicationsByVendor(vendor_id);

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
    async getApplicationById(root, { id }, context) {
      let applications = await getApplicationById(id);
      let resapplication;

      if (applications.length > 0) {
        let child = await getChildInformation(applications[0].child);
        console.log("application child ", applications[0].child);
        console.log("child ", child);
        applications[0].parents = await getParentByApplication(
          applications[0].app_id
        );
        applications[0].child = child.length > 0 ? child[0] : {};
        resapplication = applications[0];
      }
      console.log("resapplication", resapplication);
      return resapplication;
    },
    async getUserByEmail(root, { email }, context) {
      const response = await checkUserEmail(email);
      return response;
    },
    async getVendorAppGroups(root, { vendor }, context) {
      const response = await getVendorAppGroups(vendor);
      return response;
    },
    async getApplicationHistory(root, { app_id }, context) {
      const response = await getApplicationHistoryById(app_id);
      return response;
    },
    async getUserApplicationHistory(root, { id }, context) {
      try {
        const response = await getApplicationHistoryByUser(id);
        return response;
      } catch (err) {
        console.log("getUserApplicationHistory error", err);
      }
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
      try {
        console.log("User Update payload", user);
        return await executeUserUpdate(user);
      } catch (err) {
        console.log("User Update Error", err);
      }
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
    async cloneCalendar(root, { calendar }, context) {
      return await executeCloneCalendar(calendar);
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

        application.class_teacher = "";
        application.child = child.ch_id;

        application = await createApplication(application);

        for (let parent of parents) {
          parent.application = application.app_id;
          await addParent(parent);

          let checkEmail = await checkUserEmail(parent.email_address);

          if (checkEmail && checkEmail.is_exist) {
            console.log("Parent Status: ", checkEmail.status);
          } else {
            let userType = await getUserTypes();

            userType = userType.filter(type => {
              return type.name === "USER";
            })[0];

            console.log("user type: ", userType);

            let user = {
              username: parent.firstname + "" + parent.lastname,
              email: parent.email_address,
              password: parent.password,
              type: userType
            };

            console.log("user:", user);
            let addUser = await executeSignUp(user);
            console.log("addUser:", user);
            let parentInfo = {
              ...parent,
              email: parent.email_address
            };
            console.log("Parent Info", parentInfo);
            await executeAddUserProfile(parentInfo);

            console.log("add user res:", addUser);
          }

          const parentUser = await getUserFromDatabase(parent.email_address);

          console.log("parent user", parentUser);

          await addApplicationUser({
            user_id: parentUser.id,
            app_id: application.app_id
          });
        }
      }

      return {
        messageType: "info",
        message: "application created"
      };
    },
    async updateApplication(root, { application }, context) {
      console.log("APPLICATION ", application);
      try {
        const response = await updateApplication(application);
        if (!response.error) {
          return {
            messageType: "info",
            message: "application updated"
          };
        } else {
          console.log("error", response.error);
          return {
            messageType: "error",
            message: "error application update"
          };
        }
      } catch (err) {
        console.log("error", err);
        return {
          messageType: "error",
          message: "error application update"
        };
      }
    },
    async archivedApplications(root, { app_ids }, context) {
      try {
        for (let app_id of app_ids) {
          let response = await archivedApplication(app_id);

          if (response.error) {
            return {
              messageType: "error",
              message: "error application archived"
            };
          }
        }

        return {
          messageType: "info",
          message: "application archived"
        };
      } catch (err) {
        return {
          messageType: "error",
          message: "error application archived"
        };
      }
    },
    async unarchivedApplications(root, { app_ids }, context) {
      try {
        for (let app_id of app_ids) {
          let response = await unArchivedApplication(app_id);

          if (response.error) {
            return {
              messageType: "error",
              message: "error application unarchived"
            };
          }
        }

        return {
          messageType: "info",
          message: "application unarchived"
        };
      } catch (err) {
        return {
          messageType: "error",
          message: "error application unarchived"
        };
      }
    },
    async addVendorAppGroup(root, { appGroup }, context) {
      const vendors = appGroup.vendors;

      let response = {};

      console.log("appGroup server", appGroup);

      for (const vendor of vendors) {
        const fields = {
          user_id: appGroup.user_id,
          vendor: vendor,
          size: appGroup.size,
          name: appGroup.name,
          email: appGroup.email
        };
        await addAppGroup(fields);
      }
      response = await getUserGroups(appGroup.email);

      return response;
    },

    async editVendorAppGroup(root, { appGroup }, context) {
      // const vendors = appGroup.vendors;
      // let response = {};
      // console.log("appGroup server", appGroup);
      // for (const vendor of vendors) {
      // }

      const fields = {
        app_grp_id: appGroup.app_grp_id,
        email: appGroup.email,
        size: appGroup.size,
        name: appGroup.name
      };
      await editAppGroup(fields);
      let response = await getUserGroups(appGroup.email);

      return response;
    },
    async deleteVendorAppGroup(root, { appGroup }, context) {
      console.log("Response deleteVendorAppGroup appGroup", appGroup);
      await deleteAppGroup(appGroup);
      let response = await getUserGroups(appGroup.email);
      console.log("Response deleteVendorAppGroup", response);
      return response;
    },
    async saveApplication(root, { application }, context) {
      const previousApplication = await getApplicationByAppId(
        application.app_id
      );

      const tc_signatures = {
        section1_signature: application.section1_signature,
        section1_date_signed: application.section1_date_signed,
        section2_signature: application.section2_signature,
        section2_date_signed: application.section2_date_signed,
        section3_signature: application.section3_signature,
        section3_date_signed: application.section3_date_signed,
        section1_text: application.section1_text,
        section2_text: application.section2_text,
        section3_text: application.section3_text,
        section1_name: application.section1_name,
        section2_name: application.section2_name,
        section3_name: application.section3_name,
        app_id: application.app_id
      }

      console.log("tc_signatures", tc_signatures);
      const isSaved = await saveApplication({
        app_id: application.app_id,
        emergency_contacts: application.emergency_contacts,
        tc_signatures: tc_signatures,
        child: application.child,
        parents: application.parents
      });

      if (isSaved) {
        const params = {
          app_id: application.app_id,
          details: JSON.stringify(previousApplication),
          updated_by: application.updated_by
        };
        addApplicationHistory(params);
      }

      return {
        messageType: "info",
        message: "application successfully updated"
      };
    }
  }
};

export default resolvers;
