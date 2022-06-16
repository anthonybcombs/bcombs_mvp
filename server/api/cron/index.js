// import express from "express";

import {
  getGroupReminderByCurrentDate,
  updateGroupReminderStatus
} from "../vendor";

import {
  getApplicationsByAppGroup,
  removeApplicationFromGroup,
  updateApplicationUser,
  updateSubmitCustomApplication,
  updateEmergencyConctacts
} from "../applications";

import {
  getChildInformation,
  updateChild
} from "../child";

import {
  getParentByApplication,
  updateParent
} from "../parents";

import {
  updateChildNewId,
  getChilds
} from "../index";

// const router = express.Router();

export const triggerCronUpdateChildIds = async () => {
  let childs = await getChilds();
  const defaultSize = 4;

  childs = childs.filter(ch => {
    return !ch.new_childId
  })

  for (let child of childs) {

    if (child.newChildId) continue;

    let addZero = 0;
    if (child.id > 9999) {
      addZero = 1;
    }

    const id2 = child.id + "";
    const padId = id2.padStart(defaultSize + addZero, '0');
    const newChildId = 'C11' + padId;
    child.newChildId = newChildId;


    updateChildNewId(child);
  }
}

export const triggerCronSetReminder = async () => {
  try {
    const group_reminders = await getGroupReminderByCurrentDate();


    for (const item of group_reminders) {
      let applications = [];
      const appGroupIds = item.app_groups ? item.app_groups.map(item => item.app_grp_id) : [];
      for (const app_group of item.app_groups) {
        console.log('app_group', app_group);
        const fetchApplications = await getApplicationsByAppGroup({
          app_group: app_group.app_grp_id,
          is_customform: !!item.is_customform
        });

        applications.push(...fetchApplications);
      }


      const form_fields = JSON.parse(item.fields);

      console.log('applications', applications.length);
      for (let appl of applications) {


        // console.log('item.is_customform', item.is_customform);

        if (!!item.is_customform) {

          const customFields = JSON.parse(form_fields);

          for (const formData of customFields) {
            if (appl.form_contents &&
              appl.form_contents.formData &&
              appl.form_contents.formData.length > 0) {
              for (let appFormData of appl.form_contents.formData) {
                if (formData.fdId == appFormData.id) {
                  for (let appFormField of appFormData.fields) {
                    if (formData.value == appFormField.id) {
                      appFormField.value = '';
                    }
                  }
                  break;
                }
              }
            }
          }

          let formContentsString = appl.form_contents ? JSON.stringify(appl.form_contents) : "{}";
          appl.form_contents = Buffer.from(formContentsString, "utf-8").toString("base64");

          await updateSubmitCustomApplication(appl);

          const col = {
            custom_app_id: appl.app_id,
            received_reminder: 1,
            received_update: 1
          };

          console.log('updateApplicationUser', col);

          await updateApplicationUser(col);

        } else {

          const fields1 = form_fields?.fields1;
          const fields2 = form_fields?.fields2;

          let child = await getChildInformation(appl.child);
          child = child.length > 0 ? child[0] : {};

          let parents = await getParentByApplication(appl.app_id);

          let emergencyContacts;

          try {
            emergencyContacts = appl.emergency_contacts ? JSON.parse(appl.emergency_contacts) : '';
          } catch (e) {
            emergencyContacts = '';
          }

          for (const f of fields1) {
            if (f == 'firstname')
              child.firstname = null
            else if (f == 'lastname')
              child.lastname = null
            else if (f == 'nickname')
              child.nickname = null
            else if (f == 'dateofbirth')
              child.birthdate = null
            else if (f == 'gender')
              child.gender = null
            else if (f == 'ethinicity')
              child.ethnicities = null
            else if (f == 'phonetype')
              child.phone_type = null
            else if (f == 'phonenumber')
              child.phone_number = null
            else if (f == 'emailtype')
              child.email_type = null
            else if (f == 'emailaddress')
              child.email_address = null
            else if (f == 'address')
              child.address = null
            else if (f == 'city')
              child.city = null
            else if (f == 'state')
              child.state = null
            else if (f == 'zipcode')
              child.zipcode = null
            else if (f == 'locationsite')
              child.location_site = null
            else if (f == 'program')
              child.programs = null
            else if (f == 'childliveswith')
              child.child_lives_with = null
            else if (f == 'grade') {
              child.grade_desc = null
              child.grade_number = null
            } else if (f == 'schoolname')
              child.school_name = null
            else if (f == 'schoolnumber')
              child.school_phone = null
            else if (f == 'childproblems') {
              child.has_suspended = null;
              child.reason_suspended = null
            } else if (f == 'yearstartedmentee')
              child.year_taken = null;
            else if (f == 'hobbies')
              child.hobbies = null
            else if (f == 'lifeevents')
              child.life_events = null
            else if (f == 'careergoals')
              child.career_goals = null
            else if (f == 'listcolleges')
              child.colleges = null
            else if (f == 'groupaffiliations')
              child.affiliations = null
            else if (f == 'listofawards')
              child.awards = null;
            else if (f == 'menteehopegain')
              child.mentee_gain_program = null
            else if (f == 'doctorname')
              child.doctor_name = null;
            else if (f == 'doctorphone')
              child.doctor_phone = null;
            else if (f == 'hospitalpreference')
              child.hospital_preference = null
            else if (f == 'hospitalphone')
              child.hospital_phone = null
          }

          for (let parent of parents) {
            for (const f of fields2) {
              if (f == 'firstname')
                parent.firstname = null
              else if (f == 'lastname')
                parent.lastname = null
              else if (f == 'dateofbirth')
                parent.birthdate = null
              else if (f == 'gender')
                parent.gender = null
              else if (f == 'ethinicity')
                parent.ethnicities = null
              else if (f == 'phonetype')
                parent.phone_type = null
              else if (f == 'phonenumber')
                parent.phone_number = null
              else if (f == 'emailtype')
                parent.email_type = null
              else if (f == 'emailaddress')
                parent.email_address = null
              else if (f == 'address')
                parent.address = null
              else if (f == 'city')
                parent.city = null
              else if (f == 'state')
                parent.state = null
              else if (f == 'zipcode')
                parent.zipcode = null
              else if (f == 'occupation')
                parent.occupation = null
              else if (f == 'employersname')
                parent.employers_name = null
              else if (f == 'expectationsmentoringprogram')
                parent.parent_goals = null
              else if (f == 'parentreason')
                parent.parent_child_goals = null
              else if (f == 'livedinarea')
                parent.live_area = null
              else if (f == 'levelofeducation')
                parent.level_of_education = null
              else if (f == 'childimportancetograduate')
                parent.child_hs_grad = null
              else if (f == 'childimportancetocollege')
                parent.child_col_grad = null
              else if (f == 'howdidyoufindus')
                parent.person_recommend = null
            }
          }

          if (emergencyContacts) {
            emergencyContacts.map((ec) => {
              if (fields2.includes('ecfirstname')) {
                ec.firstname = ''
              } else if (fields2.includes('eclastname')) {
                ec.last_name = ''
              } else if (fields2.includes('ecgender')) {
                ec.gender = ''
              } else if (fields2.includes('ecmobilephone')) {
                ec.mobile_phone = ''
              } else if (fields2.includes('ecworkphone')) {
                ec.work_phone = ''
              } else if (fields2.includes('ecrelationshiptochild')) {
                ec.relationship_to_child = ''
              }
            })

            appl.emergency_contacts = JSON.stringify(emergencyContacts);

           await updateEmergencyConctacts(appl.app_id, appl.emergency_contacts);
          }


          await updateChild(child);

          for (const parent of parents) {
            await updateParent(parent);
          }

          if (appl.class_teacher) {
            let appGroups = appl.class_teacher ? appl.class_teacher.split(',') : [];
            appGroups = appGroups.filter(item => !appGroupIds.includes(item));
  
            appGroups = appGroups.join(',');
            console.log('************************************************************')
            console.log('App Groups', appGroups)
            console.log('************************************************************')
  
            await removeApplicationFromGroup({
              app_id: appl.app_id,
              app_group_ids: appGroups,
              is_customform: !!item.is_customform
            });
          }
   

          const col = {
            application: appl.app_id,
            received_reminder: 0,
            received_update: 0
          };

          console.log('updateApplicationUser', col);

          await updateApplicationUser(col);
        }




      }

      let currItem = item;
      currItem.active = 0;
      // await updateGroupReminderStatus(currItem);
    }
  }
  catch (err) {
    console.log('triggerCronSetReminder err', err);
  }
}


// router.get("/", async (req, res) => {
// await triggerCronSetReminder();
//   res.status(200).json({ test: true });
// });

// export default router;