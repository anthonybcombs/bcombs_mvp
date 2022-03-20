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
  executeAddUserProfile,
  updateUserType,
  executeUpdateUserAttendanceConfig
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
import { 
  addUpdateStudentCumulativeGrades,
  getStudentCumulativeGradeVendor,
  getStudentCumulativeGradeParent,
  getStudentCumulativeGrade,
  getGrades ,
  addUpdateStudentTest,
  getStudentStandardizedTest,
  removeStudentTest,
  getStudentCumulativeByChildId,
  getStudentRecordById,
  getStudentCumulativeGradeByAppGroupId,
  updateChildDetails
} from "../../api/grades";
import {
  getVendors,
  createVendor,
  updateVendor,
  addVendor,
  deleteAppGroup,
  editAppGroup,
  addAppGroup,
  getAppGroupsByVendor,
  getVendorsByUserId,
  getVendorById2,
  getVendorById,
  addVendorAdmins,
  getVendorAdmins,
  getVendorsIdByUser,
  deleteVendorAdmins,
  updateVendorAdmins,
  checkIfAdminVendorExists,
  getVendorAppGroupsByFormId,
  getAppGroupByPool,
  getVendorAppGroupsByVendorId,
  getAppGroupById,
  getArchivedGroupByVendor,
  deleteArchivedGroup,
  addArchivedGroupByVendor,
  createGroupReminder,
  getVendorAdminsByUser,
  getVendorApplicationReminder,
  createAppGroupReminder,
  updateLogo
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
  getApplicationHistoryByUser,
  createCustomApplication,
  updateCustomApplicationForm,
  deleteCustomApplicationForm,
  getCustomApplicationFormByFormId,
  getVendorCustomApplicationForms,
  submitCustomApplication,
  updateSubmitCustomApplication,
  getCustomFormApplicants,
  getCustomFormApplicantById,
  getCustomApplicationHistoryById,
  getUserCustomApplicationsByUserId,
  getApplicationByAppGroup,
  getCustomApplicationByVendorId,
  updateApplicationUser,
  getAppReceivedReminder
} from "../../api/applications";
import { 
  addChild, 
  getChildInformation, 
  addDaycareChild,
  addChildChildRelationship,
  getChildChildRelationship } from "../../api/child";
import { 
  addParent, 
  getParentByApplication, 
  addDaycareParent,
  addParentChildRelationship,
  updateParentChildRelationship,
  getParentChildRelationship } from "../../api/parents";
  
import { getChildAttendance ,getChildEventAttendance,updateChildAttendance} from '../../api/attendance';

import { getUserFromDatabase } from "../../api";

import { generatePassword } from "../../helpers/randomPassword";

import { sendAdminInvite } from "../../helpers/email";

import {
  currentS3BucketName,
  s3Bucket,
  s3BucketRootPath,
  uploadFile
} from "../../helpers/aws";

import {
  triggerCronSetReminder
} from "../../api/cron";

const util = require('util');

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
      let response = await getUserEvents(email);
      console.log('Get Events Response,',response)
      return response;
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
    async vendorsByUser(root, { user, withApplications = true }, context) {

      let vendors = await getVendorsByUserId(user, withApplications);

      const admins = await getVendorAdminsByUser(user);

      for(let vendor of vendors) {

        console.log("current user 22" , user);
        console.log('vendor user 22', vendor.vendor_user);

        vendor.forms = (user == vendor.vendor_user) ?  vendor.forms ? vendor.forms : []
        :
        vendor.forms ? vendor.forms.filter((f) => {
          const isExists = admins.some(x => x.form == f.form_id);
          return isExists;
        }) : []
      }
     
      vendors = vendors.filter((vendor, index, self) => (
        index === self.findIndex((a) => (
          a.id === vendor.id
        ))
      ));
     
      return vendors;
    },
    async getUserVendorForms(root, { user }, context) {

      const vendors = await getVendorsByUserId(user);

      let response = [];

      for(const vendor of vendors) {

        response.push({
          name: vendor.name + " (Bcombs Form)",
          id: vendor.id,
          is_form: false
        })

        const forms = await getVendorCustomApplicationForms({vendor: vendor.id});

        for(const form of forms) {
          response.push({
            name: form && form.form_contents && form.form_contents.formTitle ? form.form_contents.formTitle : "Untitled Form",
            id: form.form_id,
            is_form: true
          })
        }
      }

      return response;
    },
    async getVendorById2(root, { id2 }, context) {
      const vendors = await getVendorById2(id2);
      return vendors;
    },
    async getVendorById(root, {id}, context) {
      const vendors = await getVendorById(id);
      return vendors;
    },
    async getVendorApplications(root, { vendor_id }, context) {
      let applications = await getApplicationsByVendor(vendor_id);
      console.log("Get Vendor Application", applications.length);
      let resapplications = [];

      for (let application of applications) {
        let child = await getChildInformation(application.child);
        // console.log("application child ", application.child);
        // console.log("child ", child);
        application.parents = await getParentByApplication(application.app_id);

        application.child = child.length > 0 ? child[0] : {};

        let relationships = [];
        
        for(const appParent of application.parents) {
          let tempRel = await getParentChildRelationship({
            parent: appParent.parent_id,
            child: application.child.ch_id
          });
  
          if(tempRel.length > 0) relationships.push(tempRel[0]);
        }

        application.relationships = relationships;
        application.chRelationships = await getChildChildRelationship(application.child.ch_id);
        
        const userApp = await getAppReceivedReminder({
          app_id: application.app_id,
          is_customform: false
        });

        console.log("userApp", userApp);

        application.received_update = !!userApp.received_update;
        application.received_reminder = !!userApp.received_reminder;

        resapplications.push(Object.assign({}, application));
      }

      console.log("Res Applications", resapplications);
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
        const applications = await getUserApplicationsByUserId(user_id);
        console.log("12345");
        const customApplications = await getUserCustomApplicationsByUserId(user_id);

        console.log("customApplications", customApplications);
        return {
          applications: applications,
          customApplications: customApplications
        }
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
      console.log('getVendorAppGroups',vendor)
      const response = await getVendorAppGroupsByVendorId(vendor);
      console.log('getVendorAppGroups response',response)
      return response;
    },
    async getAllFormAppGroupsByVendor(root,{ vendor },context) {
      const response = await getAppGroupsByVendor(vendor);
      return response;
    },
    async getApplicationHistory(root, { app_id }, context) {
      const response = await getApplicationHistoryById(app_id);
      return response;
    },
    async getCustomApplicationHistoryById(root, { app_id }, context) {
      const response = await getCustomApplicationHistoryById(app_id);
      return response;
    },
    async getUserApplicationHistory(root, { id }, context) {
      try {
        const response = await getApplicationHistoryByUser(id);
        return response;
      } catch (err) {
        console.log("getUserApplicationHistory error", err);
      }
    },
    async getVendorAdminsByUser(root, { user }, context) {
      const vendors = await getVendorsIdByUser(user);

      console.log("vendors", vendors);
      let admins = [];
      for (const vendor of vendors) {
        console.log("vendor", vendor);
        let va = await getVendorAdmins(vendor.id);
        admins.push(...va);
      }

      console.log("this is the admins *********************" , admins);
      return admins;
    },
    async getFormAppGroup(root, {form}, contenxt) {
      return await getVendorAppGroupsByFormId(form);
    },
    async getParentChildRelationship(root, { relationships }, context) {
      let resRelationships = [];
      for(const relationship of relationships) {
        const temp = await getParentChildRelationship(relationship);

        if(temp.length > 0)
          resRelationships.push(temp[0])
      }

      return resRelationships;
    },
    async getCustomApplicationsByFormId(root, { form_id }, context) {
      
      const application = await getCustomApplicationFormByFormId(form_id);
      return application;
    },
    async getVendorCustomApplicationForms(root, { filter }, context) {
      console.log('form filter', filter);
      let forms = [];
      if(filter?.categories.length > 0) {
        for(const category of filter.categories) {
          const filterForm = await getVendorCustomApplicationForms({vendor: filter.vendor, category: category});
          forms.push(...filterForm);
        }
      } else {
        forms = await getVendorCustomApplicationForms({vendor: filter.vendor});
      }

      const admins = await getVendorAdminsByUser(filter.currentUser);

      if(!filter.isOwner) {
        let formIds = [];
        admins.map(a => {
          formIds.push(a.form);
        })

        let selectedForms = [];
        forms.map(f => {
          if(formIds.includes(f.form_id)) {
            selectedForms.push(f);
          }
        })
        forms = selectedForms;

        console.log('connected forms', forms);
      }
      return forms;
    },
    async getCustomFormApplicants(root, { form_id }, context) {
      let applications = await getCustomFormApplicants({form_id: form_id});
    
      for(let application of applications) {
        const userApp = await getAppReceivedReminder({
          app_id: application.app_id,
          is_customform: true
        });

        application.received_update = !!userApp.received_update;
        application.received_reminder = !!userApp.received_reminder;
      }

      return applications;
    },
    async getCustomFormApplicantById(root, {app_id}, contenxt) {
      const application = await getCustomFormApplicantById({app_id: app_id});
      return application;
    },

    async getAttendance(root, { application_group_id, attendance_type }, contenxt) {

      return await getChildAttendance(application_group_id, attendance_type);
    },

    async getEventAttendance(root, { application_group_id }, context) {
      console.log('Get Event Attendance App Grp Id', application_group_id)
      return await getChildEventAttendance(application_group_id);
    },
    async getCustomApplicationByVendor(root, {vendor}, contex) {
      console.log('getCustomApplicationByVendor venndorrrrr', vendor)
      const response = await getCustomApplicationByVendorId(vendor);
      console.log('getCustomApplicationByVendor response', response)
      return response;
    },
    async getStudentCumulative(root,{ app_group_id,user_id }, context) {
      const response = await getStudentCumulativeGrade({
        app_group_id,
        user_id
      });
      return response;
    },
    async getStudentCumulativeGradeByVendor(root,{ vendor_id }, context) {
      const response = await getStudentCumulativeGradeVendor({
        vendor_id
      });
      return response;
    },
    async getStudentCumulativeGradeByParent(root,{ parent_id }, context) {
      const response = await getStudentCumulativeGradeParent({
        parent_id
      });
      return response;
    },
    async getStudentCumulativeGradeByUser(root, { child_id }, context) {
      return await getStudentCumulativeByChildId(child_id)
    },
    async getStudentTest(root, { child_id }, context ) {
      return await getStudentStandardizedTest(child_id)
    },
    async getStudentRecords(root, { child_id, application_type = 'bcombs' }, context) {
      return await getStudentRecordById(child_id, application_type)
    },
    async getStudentCumulativeGradeByAppGroup(root, { app_group_id, app_group_type }, context) {
      return await getStudentCumulativeGradeByAppGroupId(app_group_id, app_group_type)
    },
    async getArchivedGroup(root, { vendor_id }, context) {
      return await getArchivedGroupByVendor(vendor_id)
    },
    async getVendorApplicationReminder(root, { vendor_id }, context) {
      return await getVendorApplicationReminder(vendor_id);
    },
    triggerCronSetReminder(root, args, context ) {
      triggerCronSetReminder();
      return "triggerCronSetReminder triggerd";
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
    async createVendor(root, { vendor }, context) {
      let newVendor = await createVendor(vendor);

      console.log('newVendor', newVendor);

      return newVendor;
    },
    async updateVendor(root, { vendor }, context) {
      return await updateVendor(vendor);
    },
    async addDaycareApplication(root, { daycare }, context) {

      let applications = daycare.applications;
      let relationships = daycare.relationships;
      let chRelationships = daycare.chRelationships;

      let saveChilds = [];

      for (let application of applications) {

        
        const tempChildId = application.child?.ch_id

        //save first child image
        if(application && 
          application.child && 
          application.child.image) {

          const buf = Buffer.from(
            application.child.image.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
          )
          
          const s3Payload = {
            Bucket: currentS3BucketName,
            Key: `file/${tempChildId}.jpg`,
            Body: buf,
            ContentEncoding: "base64",
            ContentType: "image/jpeg",
            ACL: "public-read"
          };

          uploadFile(s3Payload);

          application.child.image = s3Payload.Key;
        }
        
        const child = await addDaycareChild(application.child);
        const parents = application.parents;

        application.class_teacher = "";
        application.child = child.ch_id;

        saveChilds.push({...child, tempId: tempChildId});

        // newChilds.push({
        //   tempId: tempChildId,
        //   newId: child.ch_id
        // })

        application = await createApplication(application);

        for (let parent of parents) {
          parent.application = application.app_id;

          const tempParentId = parent?.parent_id;

          
          if(parent &&  
            parent.image) {
  
            const buf = Buffer.from(
              parent.image.replace(/^data:image\/\w+;base64,/, ""),
              "base64"
            )
            
            const s3Payload = {
              Bucket: currentS3BucketName,
              Key: `file/${tempParentId}.jpg`,
              Body: buf,
              ContentEncoding: "base64",
              ContentType: "image/jpeg",
              ACL: "public-read"
            };
  
            uploadFile(s3Payload);
  
            parent.image = s3Payload.Key;
          }
          
          const newParent = await addDaycareParent(parent);

          console.log("newParent", newParent);

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
              email: parent.email_address,
              dateofbirth:parent.birthdate
            };
            console.log("Parent Info", parentInfo);
            await executeAddUserProfile(parentInfo);

            console.log("add user res:", addUser);
          }

          // newParents.push({
          //   tempId: tempParentId,
          //   newId: newParent.parent_id
          // })

          const tempRel = relationships.filter((item) => {
            return item.child == tempChildId && item.parent == tempParentId;
          });

          if(tempRel.length > 0) {
            await addParentChildRelationship({
              child: child.ch_id,
              parent: newParent.parent_id,
              relationship: tempRel[0].relationship
            });
          }

          const parentUser = await getUserFromDatabase(parent.email_address);

          console.log("parent user", parentUser);

          await addApplicationUser({
            user_id: parentUser.id,
            app_id: application.app_id
          });
        }
      }

      if(saveChilds.length > 1) {
        for(let i = 0; i < saveChilds.length; i++) {
          for(let k = 0; k < saveChilds.length; k++) {
            if( i != k ) {
              const tempChildId = saveChilds[i].tempId;
              const tempChildId2 = saveChilds[k].tempId;
    
              const tempRel =  chRelationships.filter((item) => {
                return item.child == tempChildId && item.child2 == tempChildId2;
              });
    
              if(tempRel.length > 0) {
                await addChildChildRelationship({
                  child: saveChilds[i].ch_id,
                  child2: saveChilds[k].ch_id,
                  relationship: tempRel[0].relationship
                })
              }
            }
          }
        }
      }

      return {
        messageType: "info",
        message: "daycare application created"
      };
    },
    async addApplication(root, { applications }, context) {

      let newChilds = [];
      let newParents = [];

      for (let application of applications) {

        const tempChildId = application.child?.ch_id

        //save first child image
        if(application && 
          application.child && 
          application.child.image) {

          const buf = Buffer.from(
            application.child.image.replace(/^data:image\/\w+;base64,/, ""),
            "base64"
          )
          
          const s3Payload = {
            Bucket: currentS3BucketName,
            Key: `file/${tempChildId}.jpg`,
            Body: buf,
            ContentEncoding: "base64",
            ContentType: "image/jpeg",
            ACL: "public-read"
          };

          uploadFile(s3Payload);

          application.child.image = s3Payload.Key;
        }

        const child = await addChild(application.child);
        const parents = application.parents;

        application.class_teacher = "";
        application.child = child.ch_id;

        newChilds.push({
          tempId: tempChildId,
          newId: child.ch_id
        })

        application = await createApplication(application);

        for (let parent of parents) {
          
          const tempParentId = parent?.parent_id;

          if(parent &&  
            parent.image) {
  
            const buf = Buffer.from(
              parent.image.replace(/^data:image\/\w+;base64,/, ""),
              "base64"
            )
            
            const s3Payload = {
              Bucket: currentS3BucketName,
              Key: `file/${tempParentId}.jpg`,
              Body: buf,
              ContentEncoding: "base64",
              ContentType: "image/jpeg",
              ACL: "public-read"
            };
  
            uploadFile(s3Payload);
  
            parent.image = s3Payload.Key;
          }

          parent.application = application.app_id;

          const newParent = await addParent(parent);

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
              email: parent.email_address,
              dateofbirth:parent.birthdate
            };
            console.log("Parent Info", parentInfo);
            await executeAddUserProfile(parentInfo);

            console.log("add user res:", addUser);
          }

          newParents.push({
            tempId: tempParentId,
            newId: newParent.parent_id
          })

          const parentUser = await getUserFromDatabase(parent.email_address);

          console.log("PARENT USER", parentUser);

          await addApplicationUser({
            user_id: parentUser.id,
            app_id: application.app_id
          });
        }
      }

      return {
        messageType: "info",
        message: "application created",
        childs: newParents,
        parents: newChilds
      };
    },
    async updateApplication(root, { application }, context) {
      console.log("APPLICATION ", application);

      let response = {};
      try {
        const previousApplication = await getApplicationByAppId(
          application.app_id
        );
        if(application.class_teacher && application.class_teacher != previousApplication.class_teacher) {
          let selectedAppGroup = await getAppGroupById(application.class_teacher);

          console.log("selectedAppGroup", selectedAppGroup);
          selectedAppGroup = selectedAppGroup.length > 0 ? selectedAppGroup[0] : {};

          const applications = await getApplicationByAppGroup({app_grp_id: application.class_teacher, is_form: application.is_form});
          const totalApplication = applications.length + 1;

          console.log("totalApplication", totalApplication);
          console.log("selectedAppGroup.size", selectedAppGroup.size);
          
          if(totalApplication > selectedAppGroup.size) {
            response.message = "Sorry, you currently have more members added to your group, please make sure you have enough available count";
            response.messageType = "error"
            return response;
          }
        }

        if(application && application.is_form) {
          await updateApplicationUser({
            custom_app_id: application.app_id,
            received_reminder: application.received_reminder ? 1 : 0,
            received_update: 0 
           })
        } else {
          await updateApplicationUser({
            application: application.app_id,
            received_reminder: application.received_reminder ? 1 : 0,
            received_update: 0 
           })
        }

        
        response = await updateApplication(application);
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
          vendor: !vendor.is_form ? vendor.id : null,
          form: vendor.is_form ? vendor.id : null,
          size: appGroup.size,
          name: appGroup.name,
          email: appGroup.email,
          pool_id: appGroup.pool_id
        };
        await addAppGroup(fields);
      }
      response = await getUserGroups(appGroup.email);
      response.message = "success"
      return response;
    },

    async editVendorAppGroup(root, { appGroup }, context) {
      const vendors = appGroup.vendors;

      //remove forms on app group

      const currentAppGroups = await getAppGroupByPool(appGroup.pool_id);

      for(const ap of currentAppGroups) {
        
        const isExist = vendors.filter(v => v.app_grp_id == ap.app_grp_id);

        console.log("ap ap", ap);
        console.log("isExist", isExist);
        if(isExist && isExist.length > 0) {
          // do not delete
        } else {
          ap.id = ap.app_grp_id;
          await deleteAppGroup(ap);
        }
      }

      for(const vendor of vendors) {
        if(vendor.app_grp_id) {
          const applications = await getApplicationByAppGroup({app_grp_id: vendor.app_grp_id, is_form: vendor.is_form});
          const totalApplication = applications.length;

          console.log("totalApplication", totalApplication);
          if(totalApplication > appGroup.size) {
            let response = await getUserGroups(appGroup.email);
            response.message = "Sorry, you currently have more members added to your group, please make sure you have enough available count";
            response.status = "failed"
            return response;
          }
        }
      }

      for (const vendor of vendors) {
        if(!vendor.app_grp_id) {
          // add addgroup
          const fields = {
            user_id: appGroup.user_id,
            vendor: !vendor.is_form ? vendor.id : null,
            form: vendor.is_form ? vendor.id : null,
            size: appGroup.size,
            name: appGroup.name,
            email: appGroup.email,
            pool_id: appGroup.pool_id
          }

          await addAppGroup(fields);
        } else {
          const fields = {
            app_grp_id: vendor.app_grp_id,
            email: appGroup.email,
            size: appGroup.size,
            name: appGroup.name
          }

          await editAppGroup(fields);
        }
      }

      let response = await getUserGroups(appGroup.email);
      response.status = "success"
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
      console.log('Application saveApplication', application)
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
      };

      console.log("tc_signatures", tc_signatures);
      const isSaved = await saveApplication({
        app_id: application.app_id,
        emergency_contacts: application.emergency_contacts,
        tc_signatures: tc_signatures,
        child: application.child,
        parents: application.parents
      });

      if(application.relationships) {
        for(const relationship of application.relationships) {
          await updateParentChildRelationship(relationship);
        }
      }

      console.log('application.received_reminder', application.received_reminder);

      if (isSaved && !application.received_reminder) {
        const params = {
          app_id: application.app_id,
          details: JSON.stringify(previousApplication),
          updated_by: application.updated_by
        };
        addApplicationHistory(params);
      } else {

        console.log('no app history added');
        const col = {
          application: application.app_id,
          received_reminder: 0,
          received_update: application.received_update ? 1 : 0 
        };

        updateApplicationUser(col);
        
        updateApplication({
          verification: "waiting_for_verification",
          student_status: "pending_resubmission",
          color_designation: previousApplication.color_designation,
          class_teacher: previousApplication.class_teacher,
          notes: previousApplication.class_teacher,
          app_id: previousApplication.app_id
        })
      }

      return {
        messageType: "info",
        message: "application successfully updated"
      };
    },
    async deleteVendorAdmin(root, { admins }, context) {
      const currentUser = admins[0].currentUser;

      for (const admin of admins) {
        await deleteVendorAdmins(admin);
      }

      const vendors = await getVendorsIdByUser(currentUser);

      let resAdmins = [];
      for (const vendor of vendors) {
        console.log("vendor", vendor);
        let va = await getVendorAdmins(vendor.id);
        resAdmins.push(...va);
      }

      console.log("admins", resAdmins);
      return resAdmins;
    },
    async updateVendorAdmin(root, { admin }, context) {

      await deleteVendorAdmins(admin);

      for (const form of admin.forms) {
        await addVendorAdmins({
          user: admin.user,
          vendor: admin.vendor,
          name: admin.name,
          form: form.isCustomForm ? form.form_id : null
        });
      }

      // for (const vendor of admin.vendors) {
      //   const checkVendorExists = await checkIfAdminVendorExists({
      //     user: admin.user,
      //     vendor: vendor
      //   });

      //   if (checkVendorExists && checkVendorExists.is_exists) {
      //     //Update
      //     await updateVendorAdmins({
      //       user: admin.user,
      //       name: admin.name,
      //       vendor: vendor
      //     });
      //   } else {
      //     //add
      //     await addVendorAdmins({
      //       user: admin.user,
      //       vendor: vendor,
      //       name: admin.name
      //     });
      //   }
      // }

      const currentUser = admin.currentUser;
      const vendors = await getVendorsIdByUser(currentUser);

      let resAdmins = [];

      for (const vendor of vendors) {
        console.log("vendor", vendor);
        let va = await getVendorAdmins(vendor.id);

        for(let x of va) {
          if(x.form) {
            let form = await getCustomApplicationFormByFormId(x.form);
            console.log('formDetails', form.form_contents.formTitle);
            if(form && form.form_contents && form.form_contents.formTitle)
              x.formTitle = form.form_contents.formTitle;
          }
        }

        resAdmins.push(...va);
      }

      console.log("admins", resAdmins);
      return resAdmins;
    },
    async addVendorAdmin(root, { admin }, context) {
      const checkUser = await checkUserEmail(admin.email);

      let userType = await getUserTypes();

      userType = userType.filter(type => {
        return type.name === "VENDOR";
      })[0];

      let user;

      if (checkUser && checkUser.is_exist) {
        user = checkUser.user;

        if (!(user.type == userType.id)) {
          //update user type to vendor
          user.type = userType.id;

          console.log("update user type to vendor", user);
          await updateUserType(user);
        }

        sendAdminInvite({
          email: admin.email,
          name: admin.name,
          vendorId: admin.vendor2,
          isExist: true
        });
      } else {
        const newPassword = generatePassword();

        let userParams = {
          username: admin.name,
          email: admin.email,
          password: newPassword,
          type: userType
        };

        await executeSignUp(userParams);

        user = await getUserFromDatabase(admin.email);

        sendAdminInvite({
          email: admin.email,
          password: newPassword,
          name: admin.name,
          vendorId: admin.vendor2
        });
      }

      for (const form of admin.forms) {
        await addVendorAdmins({
          user: user.id,
          vendor: admin.vendor,
          name: admin.name,
          form: form.isCustomForm ? form.form_id : null
        });
      }

      const vendors = await getVendorsIdByUser(admin.currentUser);

      let admins = [];
      for (const vendor of vendors) {
        let va = await getVendorAdmins(vendor.id);

        for(let x of va) {
          if(x.form) {
            let form = await getCustomApplicationFormByFormId(x.form);
            if(form && form.form_contents && form.form_contents.formTitle)
              x.formTitle = form.form_contents.formTitle;
          }
        }

        admins.push(...va);
      }

      return admins;

      // const response = await getVendorAdmins(admin.currentUser);
      // return response;
    },
    async addParentChildRelationship(root, { relationships }, context) {
      for(const relationship of relationships) {
        await addParentChildRelationship(relationship);
      }

      return {
        messageType: "info",
        message: "relationship successfully created"
      }
    },
    async updateParentChildRelationship(root, { relationships }, context) {
      for(const relationship of relationships) {
        await updateParentChildRelationship(relationship);
      }

      return {
        messageType: "info",
        message: "relationship successfully created"
      }
    },
    async createCustomApplicationForm(root, { application }, context) {

      let nameType;
      let formData = application?.form_contents?.formData;

      nameType = formData.filter((item) => {
        return item.type == "name"
      });

      const hasNameField = !!(nameType.length > 0);

      if(!hasNameField) {

        const res = {
          messageType: "error",
          message: "prime field name is required",
        } 

        return res
      }

      let formContentsString = application.form_contents ? JSON.stringify(application.form_contents) : "{}";
      application.form_contents = Buffer.from(formContentsString, "utf-8").toString("base64");

      console.log("formContentsString", formContentsString.length);
      console.log("custom application", application.form_contents.length);

      let form = await createCustomApplication(application);

      form = form ? form : {};

      const res = {
        messageType: "info",
        message: "successfully created your application form",
        form
      } 

      console.log("res", res);
      return res;
    },
    async updateCustomApplicationForm(root, { application }, context) {
      let nameType;
      let formData = application?.form_contents?.formData;

      nameType = formData.filter((item) => {
        return item.type == "name"
      });
      
      const hasNameField = !!(nameType.length > 0);

      if(!hasNameField) {

        const res = {
          messageType: "error",
          message: "prime field name is required",
        } 

        return res
      }
      
      let formContentsString = application.form_contents ? JSON.stringify(application.form_contents) : "{}";
      application.form_contents = Buffer.from(formContentsString, "utf-8").toString("base64");

      console.log("formContentsString", formContentsString.length);
      console.log("custom application", application.form_contents.length);

      let form = await updateCustomApplicationForm(application);

      form = form ? form : {};

      const res = {
        messageType: "info",
        message: "successfully update your application form",
        form: form
      } 

      console.log("res", res);
      return res;
    },
    async deleteCustomApplicationForm(root, { application }, context) {
      await deleteCustomApplicationForm(application);

      return {
        messageType: "info",
        message: "successfully delete you application form"
      }
    },
    async submitCustomApplicationForm(root, { application }, context) {

     try{
      let loginType;
      let nameType;
      let email;
      let password;
      let primeFiles = [];
      let firstname = '';
      let middlename = '';
      let lastname = '';

      console.log("application", application);

      let formData = application?.form_contents?.formData;
      let formTitle = application?.form_contents?.formTitle;

      console.log("formdata", formData);

      loginType = formData.filter((item) => {
        return item.type == "login"
      });

      nameType = formData.filter((item) => {
        return item.type == "name"
      });

      primeFiles = formData.filter((item) => {
        return item.type == "primeFile"
      });

      console.log('nameType loginType 1111',loginType)
      console.log('nameType loginType',loginType)

      //const hasLoginField = !!(loginType.length > 0);
      const hasLoginField = loginType

      // const hasNameField = !!(nameType.length > 0);
      const hasNameField = nameType

      //loginType = loginType.length > 0 ? loginType[0] : {};
      loginType = loginType ? loginType[0] : {};

      // nameType = nameType.length > 0 ? nameType[0] : {};
      nameType = nameType ? nameType[0] : {};
      
      console.log('nameType hasLoginField',hasLoginField)
      console.log('nameType loginType',loginType)

      if(hasLoginField) {
        email = loginType?.fields.filter((item) => {
          return item.type == "email"
        });
  
        password = loginType?.fields.filter((item) => {
          return item.type == "password"
        });
  
        email = email && email.length > 0 ? email[0] : "";
        password = password && password.length > 0 ? password[0] : "";
      } 
      
      if (hasNameField) {
        firstname = nameType?.fields.filter((item) => {
          return item.label == "First Name"
        });

        middlename = nameType?.fields.filter((item) => {
          return item.label == "Middle Name"
        });

        lastname = nameType?.fields.filter((item) => {
          return item.label == "Last Name"
        });

        console.log('nameType', nameType);

        console.log('nameType firstname', firstname);
        console.log('nameType middlename', middlename);
        console.log('nameType lastname', lastname);

        // firstname = firstname.length > 0 ? firstname[0] : "";
        // lastname = lastname.length > 0 ? lastname[0] : "";
        // middlename = middlename.length > 0 ? middlename[0] : "";
        // firstname = firstname ? firstname : "";
        // lastname = lastname ? lastname : "";
        // middlename = middlename ? middlename : "";
      } else {
        return {
          messageType: "error",
          message: "Prime field name is required"
        } 
      }

      //check if there is file
      console.log("primeFiles", primeFiles);

      for(let primeFile of primeFiles) {
        if(primeFile?.fields.length > 0) {
          console.log("why i'm not here");
          let fileContent = primeFile.fields[0]?.value;
          if(fileContent) {
            fileContent = fileContent ? JSON.parse(fileContent): {};

            console.log("fileContent", fileContent);
            if(fileContent && fileContent.data) {
  
              console.log("why i'm not here2");
              const buf = Buffer.from(
                fileContent?.data.replace(/^data:image\/\w+;base64,/, ""),
                "base64"
              );
  
              const s3Payload = {
                Bucket: currentS3BucketName,
                Key: `file/${primeFile.id}/${fileContent.filename}`,
                Body: buf,
                ContentEncoding: "base64",
                ContentType: fileContent.contentType,
                ACL: "public-read"
              };
  
              await uploadFile(s3Payload);
  
              fileContent.url = s3Payload.Key;
              fileContent.data = "";
  
              console.log("fileContent url", fileContent.url);
  
              primeFile.fields[0].value = JSON.stringify(fileContent);
  
              console.log("update primefile", util.inspect(primeFile, false, null, true));
  
              formData = formData.map((item) => {
                if(item.id == primeFile.id) {
                  item = primeFile
                }
                return item;
              });
              
              const formContents = {
                formTitle: formTitle,
                formData: formData
              }
  
              application.form_contents = formContents;
  
              console.log("formContents", util.inspect(formContents, false, null, true));
  
              // let formContentsString = formContents ? JSON.stringify(formContents) : "{}";
              // formContentsString = Buffer.from(formContentsString, "utf-8").toString("base64");
  
              // await updateSubmitCustomApplication({app_id: newApplication.app_id, form_contents: formContentsString})
            }
          }

        }
      }

      let formContentsString = application.form_contents ? JSON.stringify(application.form_contents) : "{}";
      application.form_contents = Buffer.from(formContentsString, "utf-8").toString("base64");

      if(hasNameField) {
        console.log('firstname',firstname)
        console.log('lastname',firstname)
        console.log('middlename',firstname)
        firstname.value = firstname && firstname[0]?.value.slice(1, -1);
        lastname.value = lastname && lastname[0]?.value.slice(1, -1);
        middlename.value = middlename && middlename[0]?.value.slice(1, -1);

        const chObj = {
          firstname: firstname.value,
          lastname: lastname.value,
          middlename: middlename.value
        }

        console.log('chObj', chObj);

        const child = await addChild(chObj);

        console.log('added child', child);

        application.child = child.ch_id;

      }

      const newApplication = await submitCustomApplication(application);

      if(newApplication && newApplication.app_id && hasLoginField && hasLoginField.length > 0) {
        console.log("hasLoginFielddddddd",hasLoginField)
        email.value = email &&  email.value && typeof email.value === 'string' &&  email.value.slice(1, -1);
        password.value = password && password.value && typeof password.value === 'string' && password.value.slice(1, -1);
        
        const checkEmail = await checkUserEmail(email.value);

        console.log("email", email); console.log("password", password);

        if(checkEmail && checkEmail.is_exist) {
          console.log("Parent Status: ", checkEmail.status);
        } else {
          let userType = await getUserTypes();
          userType = userType.filter(type => {
            return type.name === "USER";
          })[0];

          let user = {
            username: email.value,
            email: email.value,
            password: password.value,
            type: userType
          };

          console.log("user:", user);
          let addUser = await executeSignUp(user);
          console.log("addUser:", user);
          let userInfo = {
            email: email.value
          };

          await executeAddUserProfile(userInfo);
        }

        const newUser = await getUserFromDatabase(email.value);
        await addApplicationUser({
          user_id: newUser.id,
          custom_app_id: newApplication.app_id
        });
      }

      console.log("primeFiles", primeFiles);

      for(let primeFile of primeFiles) {
        if(primeFile?.fields.length > 0) {
          let fileContent = primeFile.fields[0]?.file;
          if(fileContent) {
            const buf = Buffer.from(
              fileContent?.data.replace(/^data:image\/\w+;base64,/, ""),
              "base64"
            );

            const s3Payload = {
              Bucket: currentS3BucketName,
              Key: `user/${newApplication.app_id}/${primeFile.id}/${fileContent.filename}`,
              Body: buf,
              ContentEncoding: "base64",
              ContentType: fileContent.contentType,
              ACL: "public-read"
            };

            await uploadFile(s3Payload);

            fileContent.url = s3Payload.Key;
            fileContent.data = "";

            console.log("fileContent url", fileContent.url);

            primeFile.fields[0].file = fileContent;

            console.log("update primefile", util.inspect(primeFile, false, null, true));

            formData = formData.map((item) => {
              if(item.id == primeFile.id) {
                item = primeFile
              }
              return item;
            });
            
            const formContents = {
              formTitle: formTitle,
              formData: formData
            }

            console.log("formContents", util.inspect(formContents, false, null, true));

            let formContentsString = formContents ? JSON.stringify(formContents) : "{}";
            formContentsString = Buffer.from(formContentsString, "utf-8").toString("base64");

            await updateSubmitCustomApplication({app_id: newApplication.app_id, form_contents: formContentsString})
          }
        }
      }

      return {
        messageType: "info",
        message: "successfully submitted your application form"
      } 

     }
     catch(err) {
       console.log('Error', err)
     }
    },
    async updateSubmitCustomApplication(root, {application}, context) {

      const previousApplication = await getCustomFormApplicantById({app_id: application.app_id});

      if(application.class_teacher && application.class_teacher != previousApplication.class_teacher) {
        let selectedAppGroup = await getAppGroupById(application.class_teacher);

        console.log("selectedAppGroup", selectedAppGroup);
        selectedAppGroup = selectedAppGroup.length > 0 ? selectedAppGroup[0] : {};

        const applications = await getApplicationByAppGroup({app_grp_id: application.class_teacher, is_form: true});
        const totalApplication = applications.length + 1;

        console.log("totalApplication", totalApplication);
        console.log("selectedAppGroup.size", selectedAppGroup.size);
        
        if(totalApplication > selectedAppGroup.size) {
          const response = {};
          response.message = "Sorry, you currently have more members added to your group, please make sure you have enough available count";
          response.messageType = "error"
          return response;
        }
      } else {
        application.class_teacher = "";
      }

      let formData = application?.form_contents?.formData;
      let formTitle = application?.form_contents?.formTitle;

      let primeFiles = formData.filter((item) => {
        return item.type == "primeFile"
      });

      //check if there is file
      console.log("primeFiles", primeFiles);

      for(let primeFile of primeFiles) {
        if(primeFile?.fields.length > 0) {
          console.log("why i'm not here");
          let fileContent = primeFile.fields[0]?.value;

          fileContent = fileContent ? JSON.parse(fileContent): {};

          console.log("fileContent", fileContent);
          if(fileContent && fileContent.data) {

            console.log("why i'm not here2");
            const buf = Buffer.from(
              fileContent?.data.replace(/^data:image\/\w+;base64,/, ""),
              "base64"
            );

            const s3Payload = {
              Bucket: currentS3BucketName,
              Key: `file/${primeFile.id}/${fileContent.filename}`,
              Body: buf,
              ContentEncoding: "base64",
              ContentType: fileContent.contentType,
              ACL: "public-read"
            };

            await uploadFile(s3Payload);

            fileContent.url = s3Payload.Key;
            fileContent.data = "";

            console.log("fileContent url", fileContent.url);

            primeFile.fields[0].value = JSON.stringify(fileContent);

            console.log("update primefile", util.inspect(primeFile, false, null, true));

            formData = formData.map((item) => {
              if(item.id == primeFile.id) {
                item = primeFile
              }
              return item;
            });
            
            const formContents = {
              formTitle: formTitle,
              formData: formData
            }

            application.form_contents = formContents;

            console.log("formContents", util.inspect(formContents, false, null, true));
          }
        }
      }

      let formContentsString = application.form_contents ? JSON.stringify(application.form_contents) : "{}";
      application.form_contents = Buffer.from(formContentsString, "utf-8").toString("base64");
      
      await updateSubmitCustomApplication(application);

      const params = {
        custom_app_id: application.app_id,
        details: JSON.stringify(previousApplication),
        updated_by: application.updated_by
      }

      addApplicationHistory(params)

      const col = {
        custom_app_id: application.app_id,
        received_reminder: 0,
        received_update: application.received_update ? 1 : 0 
      };

      updateApplicationUser(col);

      updateApplication({
        verification: "waiting_for_verification",
        student_status: "pending_resubmission",
        color_designation: previousApplication.color_designation,
        class_teacher: previousApplication.class_teacher,
        notes: previousApplication.class_teacher,
        app_id: previousApplication.app_id
      })

      return {
        messageType: "info",
        message: "successfully update your application form",
      }
    },

    async updateAttendance(root, {attendance}, context) {
      console.log('UpdateAttendance',attendance)
      return await updateChildAttendance(attendance)
    },

    async updateUserAttendanceFilterConfig(root, { user_attendance_filter_config }, context) {
        console.log('user_attendance_filter_config',user_attendance_filter_config)
        return executeUpdateUserAttendanceConfig(user_attendance_filter_config);
    },
    async addUpdateStudentCumulative(root,{ studentCumulative },context){
      console.log('ADDPDATE STUDENT CUMULATIVE',studentCumulative)
      return await addUpdateStudentCumulativeGrades(studentCumulative)
    },
    async addUpdateStudentStandardizedTest(root, { studentStandardizedTest },context) {
        return await addUpdateStudentTest(studentStandardizedTest)
    },
    async deleteStudentStandardizedTest(root,{ studentTestIds = [] }, context) {
      console.log('Student Test Ids', studentTestIds)
      return await removeStudentTest(studentTestIds)
    },
    async updateChildInfo(root, { child }, context) {
      console.log('child', child)
      return await updateChildDetails(child)
    },
    async addArchivedGroup(root, {  archivedGroup  }, context) {
      return await addArchivedGroupByVendor( archivedGroup)
    },
    async removeGroupFromArchive(root, { archivedGroupIds = [],vendorId }, context) {
      return await deleteArchivedGroup( archivedGroupIds,vendorId)
    },
    async createGroupReminder(root, { groupReminder }, context) {

      console.log('groupReminder', groupReminder);

      const appGroups = groupReminder.app_groups;

      console.log('appGroups', appGroups);

      let resStatus = {}

      const reminderInput = {
        vendor: groupReminder.vendor_id,
        form: groupReminder.is_customForm ? groupReminder.form : null,
        date_reminder: groupReminder.date,
        is_customForm: groupReminder.is_customForm ? 1 : 0,
        fields: groupReminder.is_customForm ? 
        JSON.stringify(groupReminder.custom_fields)
        :
        JSON.stringify(groupReminder.form_fields),
        form_name: groupReminder.form_name
      }

      const reminder = await createGroupReminder(reminderInput);

      if(reminder && reminder.vendor_reminder_id) {
        for(const appGroup of appGroups) {
          await createAppGroupReminder({
            app_group: appGroup,
            vendor_reminder: reminder.vendor_reminder_id
          });
        }
      }

      return await getVendorApplicationReminder(groupReminder.vendor_id);
    },
    async updateVendorLogo(root, { vendorLogo }, context) {
      return await updateLogo({logo: vendorLogo.logo, vendor_id: vendorLogo.vendor_id || ''})
    },
  }
};

export default resolvers;
