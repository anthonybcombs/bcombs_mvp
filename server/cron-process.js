const cron = require('node-cron');

import {
  getGroupReminderByCurrentDate,
  updateGroupReminderStatus
} from "./api/vendor";

import {
  getApplicationsByAppGroup,
  updateApplicationUser,
  updateSubmitCustomApplication
} from "./api/applications";

import {
  getChildInformation,
  updateChild
} from "./api/child";

import {
  getParentByApplication,
  updateParent
} from "./api/parents";

exports.setReminder = () => {

  //trigger evert 12:01 AM
  let task1 = cron.schedule('*/5 * * * *', async () => {
    console.log('trigger cron');

    task1.stop();

    const group_reminders = await getGroupReminderByCurrentDate();

    //console.log('group_reminders', group_reminders);
    for(const item of group_reminders) {

      const applications = await getApplicationsByAppGroup({
        app_group: item.app_group,
        is_customform: !!item.is_customform
      });

      const form_fields = JSON.parse(item.fields);
      
      console.log('applications', applications.length);
      for(let appl of applications) {

        console.log('item.is_customform', item.is_customform);

        if(!!item.is_customform) {

          const customFields  = JSON.parse(form_fields);

          for(const formData of customFields) {
            if(appl.form_contents &&
              appl.form_contents.formData &&
              appl.form_contents.formData.length > 0) {
                for(let appFormData of appl.form_contents.formData) {
                  if(formData.fdId == appFormData.id) {
                    for(let appFormField of appFormData.fields) {
                      if(formData.value == appFormField.id) {
                        appFormField.value = '';
                      }
                    }
                    break;
                  }
                }
              }
          }

          // appl.form_contents.formData.map((fData) => {
          //   console.log('fData', fData.id);
          //   fData.fields.map((f) => {
          //     console.log('new field', f);
          //   })
          // })

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

          for(const f of fields1) {
            if(f == 'firstname')
              child.firstname = null
            else if(f == 'lastname')
              child.lastname = null
            else if(f == 'nickname')
              child.nickname = null
            else if(f == 'dateofbirth')
              child.birthdate = null
            else if(f == 'gender')
              child.gender = null
            else if(f == 'ethinicity')
              child.ethnicities = null
            else if(f == 'phonetype')
              child.phone_type = null
            else if(f == 'phonenumber')
              child.phone_number = null
            else if(f == 'emailtype')
              child.email_type = null
            else if(f == 'emailaddress')
              child.email_address = null
            else if(f == 'address')
              child.address = null
            else if(f == 'city')
              child.city = null
            else if(f == 'state')
              child.state = null
            else if(f == 'zipcode')
              child.zipcode = null
            else if(f == 'locationsite')
              child.location_site = null
            else if(f == 'program')
              child.programs = null
            else if(f == 'childliveswith')
              child.child_lives_with = null
            else if(f == 'grade') {
              child.grade_desc = null
              child.grade_number = null
            } else if(f == 'schoolname')
              child.school_name = null
            else if(f == 'schoolnumber')
              child.school_phone = null
            else if(f == 'childproblems') {
              child.has_suspended = null;
              child.reason_suspended = null
            } else if(f == 'yearstartedmentee')
              child.year_taken = null;
            else if(f == 'hobbies')
              child.hobbies = null
            else if(f == 'lifeevents')
              child.life_events = null
            else if(f == 'careergoals')
              child.career_goals = null
            else if(f == 'listcolleges')
              child.colleges = null
            else if(f == 'groupaffiliations')
              child.affiliations = null
            else if(f == 'listofawards')
              child.awards = null;
            else if(f == 'menteehopegain')
              child.mentee_gain_program = null
            else if(f == 'doctorname')
              child.doctor_name = null;
            else if(f == 'doctorphone')
              child.doctor_phone = null;
            else if(f == 'hospitalpreference')
              child.hospital_preference = null
            else if(f == 'hospitalphone')
              child.hospital_phone = null
          }

          for(let parent of parents) {
            for(const f of fields2) {
              if(f == 'firstname')
                parent.firstname = null
              else if(f == 'lastname')
                parent.lastname = null
              else if(f == 'dateofbirth')
                parent.birthdate = null
              else if(f == 'gender')
                parent.gender = null
              else if(f == 'ethinicity')
                parent.ethnicities = null
              else if(f == 'phonetype')
                parent.phone_type = null
              else if(f == 'phonenumber')
                parent.phone_number = null
              else if(f == 'emailtype')
                parent.email_type = null
              else if(f == 'emailaddress')
                parent.email_address = null
              else if(f == 'address')
                parent.address = null
              else if(f == 'city')
                parent.city = null
              else if(f == 'state')
                parent.state = null
              else if(f == 'zipcode')
                parent.zipcode = null
              else if(f == 'occupation')
                parent.occupation = null
              else if(f == 'employersname')
                parent.employers_name = null
              else if(f == 'expectationsmentoringprogram')
                parent.parent_goals = null
              else if(f == 'parentreason') 
                parent.parent_child_goals = null
              else if(f == 'livedinarea')
                parent.live_area = null
              else if(f == 'levelofeducation')
                parent.level_of_education = null
              else if(f == 'childimportancetograduate')
                parent.child_hs_grad = null
              else if(f == 'childimportancetocollege')
                parent.child_col_grad = null
              else if(f == 'howdidyoufindus')
                parent.person_recommend = null
            }
          }

          await updateChild(child);

          for(const parent of parents) {
            await updateParent(parent);
          }

          const col = {
            application: appl.app_id,
            received_reminder: 1,
            received_update: 1
          };

          console.log('updateApplicationUser', col);

          await updateApplicationUser(col);
        }
      }

      currItem = item;
      currItem.active = 0;
      await updateGroupReminderStatus(currItem);
    }
  })

  //task1.stop();

  setTimeout(() => {
    console.log('task stop');
    task1.stop();
  }, 10000)
}