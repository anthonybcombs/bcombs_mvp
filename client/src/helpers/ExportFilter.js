import React, { useState } from "react";
import styled from "styled-components";

import { CSVLink, CSVDownload } from "react-csv";
import { format } from "date-fns";

import { Multiselect } from "multiselect-react-dropdown";

import { exportHeaders } from "./ExportHeaders";
import { initial } from "lodash";

const ExportFilterModal = styled.div`
  .modal {
    padding: 0;
  }

  .modal-content {
    position: relative;
    top: 100px;
    width: auto;
    max-width: 500px;
    padding: 0;
  }

  .modal-header {
    padding: 1em;
    background-color: #f26e21;
    color: #fff;
  }

  .modal-container {
    background-color: #fff;
    padding: 20px 25px;
  }

  .modal-container p {
    margin-top: 0;
  }

  .close {
    position: absolute;
    top: 5px;
    right: 10px;
    color: #fff;
  }

  #filterExportButton {
    font-size: 1em;
    color: #fff;
    background-color: #f26e21;
    border-radius: 4px;
    padding: 10px 15px;
    border: 0;
    display: inline-block;
    margin: 0;
  }

  .form-control {
    display: block;
    width: 100%;
    height: auto;
    padding: 6px 12px;
    font-size: 16px;
    line-height: 1.42857143;
    color: #555;
    background-color: #fff;
    background-image: none;
    border: 1px solid #ccc;
    border-radius: 4px;
    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
    -webkit-transition: border-color ease-in-out 0.15s,
      -webkit-box-shadow ease-in-out 0.15s;
    -o-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
    transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box; /* Firefox, other Gecko */
    box-sizing: border-box;
  }

  select {
    margin-bottom: 25px;
  }

  #multiselectContainerReact div:first-child {
    border: 1px solid #cccccc !important;
    border-radius: 4px !important;
    padding: 5px !important;
    min-height: 22px !important;
    position: relative !important;
    margin-top: 25px !important;
  }
`;

const LOT_FIELDS = [
  'is_entrepreneur',
  'allergies_to_medicine',
  'food_allergies',
  'insect_allergies',
  'other_allergies',
  // 'current_medications',
  // 'health_insurance_information',
  'mentee_gain_program'
];

const LOT_QUESTIONS = {
  mentee_gain_program: 'What does the LOT® hope to gain from the program?',
  is_entrepreneur: 'Does the student have a part time job?',
  allergies_to_medicine: 'Allergies to Medicine',
  food_allergies: 'Food Allergies',
  insect_allergies: 'Insect Allergies',
  other_allergies: 'Other Alergies',
}

function isJsonString(jsonString) {
  try {
    let data = JSON.parse(jsonString);

    if (typeof data === 'string') {
      data = JSON.parse(data);
    }
    // Handle non-exception-throwing cases:
    // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
    // but... JSON.parse(null) returns null, and typeof null === "object", 
    // so we must check for that, too. Thankfully, null is falsey, so this suffices:
    if (typeof data === "object") {
      return true;
    }
  }
  catch (e) {

    return false;
  }

  return false;
}

const ExportFilter = ({
  applications = [],
  handleExit,
  vendor = {},
  appGroups = [],
  app_programs = [],
  location_sites = [],
  isCustomForm = false,
  isLot = false,
  filename = ""
}) => {

  console.log("vendor", vendor);

  const CLASS_OPTIONS = [
    "Seniors",
    "Juniors",
    "Sophomores",
    "Freshmen",
    "Middle School"
  ];

  const REPORT_OPTIONS = [
    { name: "All Data", value: "all" },
    { name: "Biographical Data", value: "biographical_data" },
  ];


  const STUDENT_CLASS_OPTIONS = [
    { name: "In process", value: "new_applicant_in_process" },
    { name: "Accepted", value: "new_applicant_accepted" },
    { name: "Rejected", value: "new_applicant_rejected" },
    { name: "Current Student", value: "current_student" },
    { name: "Waiting List", value: "waiting_list" },
    { name: "No longer a Student", value: "no_longer_student" },
    { name: "Missed opportunity", value: "missed_opportunity" },
    { name: "Pending Resubmission", value: "pending_resubmission" },
    { name: "Resubmitted", value: "resubmitted" }
  ];

  const VERIFICATION_OPTIONS = [
    { name: "Waiting for Verification", value: "waiting_for_verification" },
    { name: "Verified", value: "verified" },
    { name: "Rejected", value: "rejected" }
  ];

  const COLOR_OPTIONS = ["Blue", "Red", "Green"];

  const getVendorFilename = () => {
    return filename + " Application List.csv";
  };

  const [statusText, setStatusText] = useState("");
  const [classText, setClassText] = useState("");
  const [colorText, setColorText] = useState("");
  const [appGroupText, setAppGroupText] = useState("");
  const [locationSites, setLocationSites] = useState([]);
  const [appPrograms, setAppPrograms] = useState([]);
  const [reportType, setReportType] = useState('all');

  const appGroupIds = appGroups.map(item => item.app_grp_id);

  const locationSiteForms = isCustomForm ? locationSites.map(item => {
    const currentAppGroups = appGroups.find(item2 => item2.name === item.name)

    return {
      ...item,
      app_grp_id:currentAppGroups?.app_grp_id
    }
  }).map(item => item.app_grp_id) : [];

  const filterApplications = applications.filter(item => {
    let class_match = true;
    let color_match = true;
    let status_match = true;
    let group_match = true;
    let program_match = true;
    let location_match = true;

    if (classText) {
      class_match = item.child.grade_desc == classText;
    }

    if (colorText) {
      if (item.color_designation)
        color_match =
          item.color_designation.toLowerCase() == colorText.toLowerCase();
      else color_match = false;
    }

    if (statusText) {
      status_match =
        item.student_status.toLowerCase() == statusText.toLowerCase();
    }

    if (appGroupText) {
      group_match = false;

      if (appGroupText == item.class_teacher) {
        group_match = true;
      }
      // for (const group of appGroups) {
      //   if (group.app_grp_id == item.class_teacher) {
      //     group_match = true;
      //   }
      // }
    }

    if(item?.child?.programs) {
      console.log('Found a child with Programs', item)
    }

    if(item?.child?.location_site) {
      console.log('Found a child with Location Site', item)
    }



    if (appPrograms.length > 0) {
      program_match = false;
      for (const program of appPrograms) {
        
        if (item?.child?.programs?.includes(program.name)) {
          program_match = true;
          break;
        }
      }
    }

    if (locationSites.length > 0) {
      location_match = false;
      for (const locationSite of locationSites) {

        if (item?.child?.location_site) {
          console.log('Application Location Site Application', item)
          if (item?.child?.location_site?.includes(locationSite.name)) {

            location_match = true;
            break;
          }
        }
      }
      if (isCustomForm && locationSiteForms.length > 0) {
        if (locationSiteForms.includes(item?.class_teacher)) {
 
          location_match = true;


        }
      }


    }

    console.log("application", item);
    return (
      class_match &&
      color_match &&
      status_match &&
      group_match &&
      program_match &&
      location_match
    );
  });

  console.log('filterApplications', filterApplications)

  const getApplicationStatus = (student_status) => {
    let studentStatusVal = "";

    if (student_status == "new_applicant_in_process") {
      studentStatusVal = "In process";
    } else if (student_status == "new_applicant_accepted") {
      studentStatusVal = "Accepted";
    } else if (student_status == "new_applicant_rejected") {
      studentStatusVal = "Rejected";
    } else if (student_status == "current_student") {
      studentStatusVal = "Current Student";
    } else if (student_status == "waiting_list") {
      studentStatusVal = "Waiting List";
    } else if (student_status == "no_longer_student") {
      studentStatusVal = "No longer a Student";
    } else if (student_status == "missed_opportunity") {
      studentStatusVal = "Missed opportunity";
    }
    else if (student_status == "resubmitted") {
      studentStatusVal = "Resubmitted";
    }

    return studentStatusVal;
  };

  const getVerificationStatus = (verification) => {
    let verificationVal = ""
    VERIFICATION_OPTIONS.map((item) => {
      if (item.value == verification) {
        verificationVal = item.name;
        return;
      }
    })

    return verificationVal;
  }

  const getClassTeacher = (id) => {
    let classTeacher = "";

    appGroups.map((ap) => {
      if (ap.app_grp_id == id) {
        classTeacher = ap.name;
        return;
      }
    });

    return classTeacher;
  }

  const getPrimaryParentName = parents => {
    if (parents && parents.length > 0) {
      return parents[0]?.firstname + " " + parents[0]?.lastname;
    }
    return "";
  };

  const getPrimaryParentEmail = parents => {
    if (parents.length > 0) {
      return parents[0]?.email_address;
    }
    return "";
  };

  const getPrimaryParentPhone = parents => {
    if (parents.length > 0) {
      return parents[0]?.phone_number;
    }
    return "";
  };

  const DATE_FORMAT = "LLL dd, yyyy";

  const getAgeBdate = child => {
    if (!child.age && child <= -1) return "";

    let birthdate = format(new Date(child.birthdate), DATE_FORMAT);

    return child.age + " (" + birthdate + ")";
  };

  
  const getParentFromFormData = formData => {
    const parentData = formData.find(item => {
      const label = item.label.toLowerCase();
      return    label.includes('parent') && label.includes('name');
    });

    const parentFields = parentData ? parentData.fields.filter(item => item.label === 'First Name' || item.label === 'Last Name') : [];
    return parentFields.length > 0 ? `${parentFields[0].value.replaceAll('"',"")} ${parentFields[1].value.replaceAll('"',"")}` : ''
  }

  
  const getChildFromFormData = formData => {
    const parentData = formData.find(item => {
      const label = item.label.toLowerCase();
      return   (label.includes('mentee') && label.includes('name')) ||  (label.includes('child') && label.includes('name'));
    });

    const parentFields = parentData ? parentData.fields.filter(item => item.label === 'First Name' || item.label === 'Last Name') : [];
    return parentFields.length > 0 ? `${parentFields[0].value.replaceAll('"',"")} ${parentFields[1].value.replaceAll('"',"")}` : ''
  }

  let exportApplications = [];
  let rowKeys = [];

  // for (const application of filterApplications) {
  //   const tempApplication = {
  //     Status: getApplicationStatus(application.student_status),
  //     "Student Name":
  //       application.child?.firstname + " " + application.child?.lastname,
  //     "Parent Name": getPrimaryParentName(application.parents),
  //     "Parent Phone": getPrimaryParentPhone(application.parents),
  //     "Parent Email": getPrimaryParentEmail(application.parents),
  //     Grade: application?.child?.grade_desc,
  //     Programs: application?.child?.programs,
  //     "Location Sites": application?.child?.location_site,
  //     Age: getAgeBdate(application.child),
  //     "Application Date": format(
  //       new Date(application.application_date),
  //       DATE_FORMAT
  //     )
  //   };

  //   exportApplications.push(tempApplication);
  // }

  let exportFilename;


  if (isCustomForm) {
    console.log("this is my custom form");

    for (const application of filterApplications) {
      let formattedApplication = {};
     
      for (const key1 of Object.keys(application)) {
        if (key1 === "form_contents") {
          if (typeof application[key1] === 'object' && application[key1] !== null && typeof application[key1] !== 'undefined') {
            const formContents = application.form_contents;
            console.log('formContents', formContents)
            exportFilename = formContents.formTitle;

            const formData = formContents?.formData?.length > 0 ? formContents.formData : [];

            for (const [i, k] of formData.entries()) {
              if (k?.type === "sectionBreak" || k?.type === 'file') { continue }
              else {

                const fields = k?.fields?.length > 0 ? k.fields : [];

                let fieldValue = ""

                for (const [x, field] of fields.entries()) {
                  fieldValue = field.value;


                  if (fieldValue && isJsonString(fieldValue)) {

                    fieldValue = JSON.parse(fieldValue);
                    //  console.log("kkkk fieldValue", fieldValue);
                    if (typeof fieldValue === 'string') {
                      fieldValue = JSON.parse(fieldValue);
                    }

                    if (typeof fieldValue === 'object' && fieldValue) {
                      console.log('fieldValue', fieldValue)
                      if (fieldValue && Object.keys(fieldValue).length > 1) {
                        fieldValue = Object.keys(fieldValue).map(key => fieldValue[key]).join(',')
                      }

                      else {
                        fieldValue = fieldValue[Object.keys(fieldValue)];
                      }


                    }
                    fieldValue = fieldValue ? fieldValue.trim() : '';

                    fieldValue = fieldValue ? fieldValue.replaceAll('""', '') : '';

                  }
                  else {

                    fieldValue = fieldValue ? fieldValue.trim() : '';
                    fieldValue = fieldValue ? fieldValue.replaceAll('""', '') : '';
                  }

                  if (field.label == 'Password' || field.label == 'Confirm Password') { continue; }


                  const fieldLabel = field.label ? field.label.toLowerCase() : '';


                  fieldValue = fieldValue ? fieldValue.replaceAll(/"/g, '') : '';
                  if (k.label) {
                    formattedApplication = { ...formattedApplication, [k.label]: fieldValue }
                  }
                  else if (fieldLabel) {
                    formattedApplication = { ...formattedApplication, [fieldLabel]: fieldValue }
                  }

                }




              }
            }
          }
        } else {
          formattedApplication = { ...formattedApplication, [key1]: application[key1] ? application[key1] : "" }
        }
      }

      delete formattedApplication.app_id;
      delete formattedApplication.form;
      formattedApplication.vendor = vendor?.name ? vendor.name : '';
      formattedApplication.verification = getVerificationStatus(formattedApplication.verification);
      formattedApplication.application_date = format(new Date(formattedApplication.application_date), DATE_FORMAT)
      formattedApplication.class_teacher = getClassTeacher(formattedApplication.class_teacher);
      formattedApplication.student_status = getApplicationStatus(formattedApplication.student_status);



      if (typeof formattedApplication.child === 'object') {
        const currentChild = { ...formattedApplication.child };
        formattedApplication.child = `${currentChild.firstname} ${currentChild.lastname}`

      }


      if (reportType === 'biographical_data') {
        const keys = Object.keys(formattedApplication);

        let parentFullName = getParentFromFormData(application?.form_contents?.formData)
        parentFullName = parentFullName.replace(/\s{2,}/g, ' ');
        let childFullName = getChildFromFormData(application?.form_contents?.formData)
        childFullName = childFullName.replace(/\s{2,}/g, ' ');
    
        // const parentNameKey =  keys.find(key => key.toLowerCase().includes('parent') && key.toLowerCase().includes('name'));
        const parentPhoneKey = keys.find(key => key.toLowerCase().includes('parent') && key.toLowerCase().includes('phone'));
        const emailKey = keys.find(key => key.toLowerCase().includes('parent') && key.toLowerCase().includes('email'));
        const menteePhoneKey = keys.find(key => key.toLowerCase().includes('mentee') && key.toLowerCase().includes('phone'));
        const addressKey = keys.find(key => key.toLowerCase().includes('mailing') || key.toLowerCase().includes('address'));
    
        const gradeKey = keys.find(key => key.toLowerCase().includes('grade'));
        const childName = childFullName.split(' ');
   
        let updatedApplication = [
          childName[0],
          childName[1],
          formattedApplication?.age,
          formattedApplication?.gender,
          formattedApplication[menteePhoneKey] || '',
          formattedApplication[addressKey] || '',
          formattedApplication[gradeKey] || '',
          parentFullName || '',
          formattedApplication[parentPhoneKey] || '',
          formattedApplication[emailKey] || '',
          formattedApplication[addressKey] || '',
        ]
        rowKeys = [
          '(Child) Firstname',
          '(Child) Lastname',
          '(Child) Age',
          '(Child) Gender',
          '(Child) Phone',
          '(Child) Address',
          '(Child) Grade',
          'Parent Name',
          'Phone Number',
          'Email Address',
          'Address',

        ];
        exportApplications.push(updatedApplication);
      }
      else {


       
        if(formattedApplication['child']) {
          let childFullName = getChildFromFormData(application?.form_contents?.formData)
          childFullName = childFullName.replace(/\s{2,}/g, ' ');
          formattedApplication = {
            ...formattedApplication,
            'child': childFullName
          }
        }

        if(formattedApplication['Parent / Guardian Name']) {
          let parentFullName = getParentFromFormData(application?.form_contents?.formData)
          parentFullName = parentFullName.replace(/\s{2,}/g, ' ');
          formattedApplication = {
            ...formattedApplication,
            'Parent / Guardian Name': parentFullName
          }
        }


        let initialApplication = {
          // 'Id': formattedApplication['Id'],
          // 'Vendor': formattedApplication['Vendor'],
          // 'Verification': formattedApplication['Verification'],
          // 'Student Status': formattedApplication['Student Status'],
          // 'Class Teacher': formattedApplication['Class Teacher'],
          // 'Color Designation': formattedApplication['Color Designation'],
          // 'Recommended Class': '',
          // 'Notes': formattedApplication['Notes'],
          ...formattedApplication
        }
        exportApplications.push(initialApplication);
      }


    }

  } else {
    for (const application of filterApplications) {
      let formattedApplication = {};

      for (const key1 of Object.keys(application)) {
        if (key1 == "vendorPrograms" ||
          key1 == "vendorLocationSites" ||
          key1 == "app_id" ||
          key1 == "is_daycare") { continue; };

        if (typeof application[key1] === 'object' && application[key1] !== null && typeof application[key1] !== 'undefined') {
          if (Array.isArray(application[key1])) {
            // parent

            if (key1 == 'parents') {
              let level1Arr = reportType === 'biographical_data' ? application[key1].map(item => {

                delete item.child_col_grad;
                delete item.child_hs_grad;
                delete item.email_address2;
                delete item.email_type;
                delete item.email_type2;

                delete item.employers_name;
                delete item.ethnicities;
                delete item.gender;
                delete item.image;
                delete item.level_of_education;

                delete item.live_area;
                delete item.new_parentId;
                delete item.occupation;
                delete item.parent_child_goals;
                delete item.parent_goals;

                delete item.person_recommend;
                delete item.phone_number2;
                delete item.phone_type;
                delete item.phone_type2;
                delete item.state;
                delete item.zip_code;

                delete item.age;
                delete item.birthdate;
                delete item.city;

                return {
                  ...item
                }
              }) : application[key1];


              delete level1Arr.child_col_grad;
              for (const [i, arrObj] of level1Arr.entries()) {
                delete arrObj.password;
                delete arrObj.emergency_contacts;
                delete arrObj.parent_id;
                if (reportType === 'biographical_data') {


                  for (const key3 of Object.keys(arrObj)) {
                    if (key3 != "password" || key3 !== 'parent_id') {
                      if (key3 == 'birthdate') {
                        const newDate = arrObj[key3] ? format(new Date(arrObj[key3]), DATE_FORMAT) : "";
                        formattedApplication = { ...formattedApplication, [exportHeaders.parent[key3]]: newDate }
                      } else {
                        formattedApplication = { ...formattedApplication, [exportHeaders.parent[key3]]: arrObj[key3] ? arrObj[key3] : "" }
                      }

                    }
                  }
                }
                else {
                  for (const key3 of Object.keys(arrObj)) {
                    if (key3 != "password" || key3 !== 'parent_id') {
                      if (key3 == 'birthdate') {
                        const newDate = arrObj[key3] ? format(new Date(arrObj[key3]), DATE_FORMAT) : "";
                        formattedApplication = { ...formattedApplication, ["(Parent " + (i + 1) + ") " + exportHeaders.parent[key3]]: newDate }
                      } else {
                        formattedApplication = { ...formattedApplication, ["(Parent " + (i + 1) + ") " + exportHeaders.parent[key3]]: arrObj[key3] ? arrObj[key3] : "" }
                      }

                    }
                  }
                }

              }
            } else if (key1 == 'relationships') {

            }

          } else {
            // child 
            let level1 = application[key1];

            delete level1.ch_id;
            if (!!application.is_daycare) {
              console.log("application is daycare");

              delete level1.phone_type2;
              delete level1.phone_number2;
              delete level1.email_type;
              delete level1.email_address;
              delete level1.email_type2;
              delete level1.email_address2;
              delete level1.gpa_cumulative_year;
              delete level1.gpa_quarter_year;
              delete level1.gpa_cumulative_q1;
              delete level1.gpa_cumulative_q2;
              delete level1.gpa_cumulative_q3;
              delete level1.gpa_cumulative_q4;
              delete level1.gpa_quarter_q1;
              delete level1.gpa_quarter_q2;
              delete level1.gpa_quarter_q3;
              delete level1.gpa_quarter_q4;
              delete level1.grade_desc;
              // delete level1.grade_number;
              delete level1.hobbies;
              delete level1.school_name;
              delete level1.school_phone;
              delete level1.year_taken;
              delete level1.life_events;
              delete level1.career_goals;
              delete level1.colleges;
              delete level1.affiliations;
              delete level1.awards;
              delete level1.accomplishments;
              delete level1.mentee_gain_program;
              delete level1.class_rank;
              delete level1.location_site;
              delete level1.business_address
              delete level1.business_description
              delete level1.business_email
              delete level1.business_industry
              delete level1.business_name
              delete level1.business_phone
              delete level1.business_website

              delete level1.zip_code;
              delete level1.state;
              delete level1.reason_suspended;
              delete level1.phone_type;

              delete level1.insect_allergies;
              delete level1.is_entrepreneur;
              delete level1.nickname;
              delete level1.other_allergies;

              delete level1.hospital_phone;
              delete level1.hospital_preference;
              delete level1.image;
              delete level1.include_in_directory;


              delete level1.ethnicities;
              delete level1.food_allergies;
              delete level1.has_suspended;
              delete level1.health_insurance_information;


              delete level1.current_medications;
              delete level1.doctor_name;
              delete level1.doctor_phone;
              delete level1.employment_status;


              delete level1.allergies_to_medicine;
              delete level1.birthdate;
              delete level1.child_lives_with;
              delete level1.city;

              delete level1.phone_type;
              // delete level1.phone_number;
              delete level1.phone_type2;
              delete level1.phone_number2;
              delete level1.email_type;
              delete level1.email_address;
              delete level1.email_type2;
              delete level1.email_address2;
              delete level1.gpa_cumulative_year;
              delete level1.gpa_quarter_year;
              delete level1.gpa_cumulative_q1;
              delete level1.gpa_cumulative_q2;
              delete level1.gpa_cumulative_q3;
              delete level1.gpa_cumulative_q4;
              delete level1.gpa_quarter_q1;
              delete level1.gpa_quarter_q2;
              delete level1.gpa_quarter_q3;
              delete level1.gpa_quarter_q4;
              delete level1.grade_desc;
              delete level1.grade_number;
              delete level1.hobbies;
              delete level1.school_name;
              delete level1.school_phone;
              delete level1.year_taken;
              delete level1.life_events;
              delete level1.career_goals;
              delete level1.colleges;
              delete level1.affiliations;
              delete level1.awards;
              delete level1.accomplishments;
              delete level1.mentee_gain_program;
              delete level1.class_rank;
            //  delete level1.location_site;
            }

            else {

              delete level1.phone_type2;
              delete level1.phone_number2;
              delete level1.email_type;
              delete level1.email_address;
              delete level1.email_type2;
              delete level1.email_address2;
              delete level1.gpa_cumulative_year;
              delete level1.gpa_quarter_year;
              delete level1.gpa_cumulative_q1;
              delete level1.gpa_cumulative_q2;
              delete level1.gpa_cumulative_q3;
              delete level1.gpa_cumulative_q4;
              delete level1.gpa_quarter_q1;
              delete level1.gpa_quarter_q2;
              delete level1.gpa_quarter_q3;
              delete level1.gpa_quarter_q4;
              delete level1.grade_desc;
              // delete level1.grade_number;
              delete level1.hobbies;
              delete level1.school_name;
              delete level1.school_phone;
              delete level1.year_taken;
              delete level1.life_events;
              delete level1.career_goals;
              delete level1.colleges;
              delete level1.affiliations;
              delete level1.awards;
              delete level1.accomplishments;
              delete level1.mentee_gain_program;
              delete level1.class_rank;
          //     delete level1.location_site;
              delete level1.business_address
              delete level1.business_description
              delete level1.business_email
              delete level1.business_industry
              delete level1.business_name
              delete level1.business_phone
              delete level1.business_website

              delete level1.zip_code;
              delete level1.state;
              delete level1.reason_suspended;
              delete level1.phone_type;

              delete level1.insect_allergies;
              delete level1.is_entrepreneur;
              delete level1.nickname;
              delete level1.other_allergies;

              delete level1.hospital_phone;
              delete level1.hospital_preference;
              delete level1.image;
              delete level1.include_in_directory;


              delete level1.ethnicities;
              delete level1.food_allergies;
              delete level1.has_suspended;
              delete level1.health_insurance_information;


              delete level1.current_medications;
              delete level1.doctor_name;
              delete level1.doctor_phone;
              delete level1.employment_status;


              delete level1.allergies_to_medicine;
              delete level1.birthdate;
              delete level1.child_lives_with;
              delete level1.city;

              // delete level1.programs;
              delete level1.new_childId;

              delete level1.child_currently_doctors_care;
              delete level1.comments_suggestion;
              delete level1.does_child_require_physical_education_service;
              delete level1.history_prev_diseases;
              delete level1.is_child_transferring;
              delete level1.list_any_allergies;
              delete level1.list_fears_unique_behavior;
              delete level1.list_special_dietary;
              delete level1.medical_action_plan;
              delete level1.mental_physical_disabilities;
              delete level1.needed_days;
              delete level1.preffered_start_date;
              delete level1.primary_language;
              delete level1.prev_school_address;
              delete level1.prev_school_attended;
              delete level1.prev_school_city;
              delete level1.prev_school_phone;
              delete level1.prev_school_state;
              delete level1.prev_school_zip_code;
              delete level1.schedule_tour;
              delete level1.transfer_reason;
              delete level1.voucher;
              delete level1.reasons_previous_hospitalizations;
              delete level1.current_classroom;
            }
            console.log("export application level1 updated", level1);
            for (const key2 of Object.keys(level1)) {

              if (key2 == 'ch_id') { continue; }
              if (key2 == 'birthdate') {
                const newDate = level1[key2] ? format(new Date(level1[key2]), DATE_FORMAT) : "";
                formattedApplication = { ...formattedApplication, ['(Child) ' + (application.is_daycare ? exportHeaders.child.daycare['birthdate'] : exportHeaders.child.main['birthdate'])]: newDate }
              } else if (key2 == 'has_suspended') {
                const val = level1[key2] == 1 ? 'Yes' : level1[key2] == 0 ? 'No' : '';
                formattedApplication = { ...formattedApplication, ['' + (application.is_daycare ? exportHeaders.child.daycare['has_suspended'] : exportHeaders.child.main['has_suspended'])]: val }
              }
              else if (LOT_FIELDS.includes(key2)) {
                formattedApplication = {
                  ...formattedApplication,
                  [`(Child) ${LOT_QUESTIONS[key2]}`]: level1[key2]
                }
              }
              else {
                if (!!application.is_daycare) {
                  formattedApplication = { ...formattedApplication, ['(Child) ' + exportHeaders.child.daycare[key2]]: level1[key2] ? level1[key2] : "" }
                }

                else {
                  formattedApplication = { ...formattedApplication, ['(Child) ' + exportHeaders.child.main[key2]]: level1[key2] ? level1[key2] : "" }
                }

              }
            }
          }
        } else {

          if (reportType === 'all') {
            if (key1 == "emergency_contacts") {
              try {
                const ecs = JSON.parse(application[key1]);
                if (Array.isArray(ecs)) {
                  for (const [i, ec] of ecs.entries()) {
                    for (const key4 of Object.keys(ec)) {
                      formattedApplication = { ...formattedApplication, ['Emergency Contacts' + "" + (i + 1) + " " + exportHeaders.emergency_contacts[key4]]: ec[key4] ? ec[key4] : "" }
                    }
                  }
                } else {
                  formattedApplication = { ...formattedApplication, [key1]: "" }
                }
              } catch (e) {
                formattedApplication = { ...formattedApplication, [key1]: "" }
              }
            } else {
              if (key1 == 'vendor') {
                formattedApplication = { ...formattedApplication, [exportHeaders['vendor']]: vendor?.name ? vendor.name : "" }
              } else if (key1 == 'application_date' ||
                key1 == 'section1_date_signed' ||
                key1 == 'section2_date_signed' ||
                key1 == 'section3_date_signed') {
                const newDate = application[key1] ? format(new Date(application[key1]), DATE_FORMAT) : "";
                formattedApplication = { ...formattedApplication, [exportHeaders[key1]]: newDate }
              } else {
                let val;
                if (key1 == 'student_status') {
                  val = getApplicationStatus(application[key1]);
                } else if (key1 == 'verification') {
                  val = getVerificationStatus(application[key1]);
                } else if (key1 == 'class_teacher') {
                  val = getClassTeacher(application[key1]);
                } else {
                  val = application[key1];
                }
                formattedApplication = { ...formattedApplication, [exportHeaders[key1]]: val ? val : "" }
              }

            }
          }

        }
      }
      delete formattedApplication.undefined;

      if (reportType === 'biographical_data') {
        let initialApplication = {
          // 'Id': formattedApplication['Id'],
          // 'Vendor': formattedApplication['Vendor'],
          // 'Verification': formattedApplication['Verification'],
          // 'Student Status': formattedApplication['Student Status'],
          // '(Child) Age': formattedApplication['(Child) Age'],
          // 'Class Teacher': formattedApplication['Class Teacher'],
          // 'Color Designation': formattedApplication['Color Designation'],
          // 'Recommended Class': '',
          // 'Notes': formattedApplication['Notes'],
          ...formattedApplication
        }
        if (isLot) {

          initialApplication = {
            ...initialApplication,

          }
        }
        rowKeys = Object.keys(initialApplication);
        initialApplication = Object.values(initialApplication);

        // exportApplications.unshift(Object.values(rowKeys))

        exportApplications.push(initialApplication);
      }
      else {
        let initialApplication = {
          'Id': formattedApplication['Id'],
          'Vendor': formattedApplication['Vendor'],
          'Verification': formattedApplication['Verification'],
          'Student Status': formattedApplication['Student Status'],
          '(Child) Age': formattedApplication['(Child) Age'],
          'Class Teacher': formattedApplication['Class Teacher'],
          'Color Designation': formattedApplication['Color Designation'],
          'Recommended Class': '',
          'Notes': formattedApplication['Notes'],
          ...formattedApplication
        }
        if (isLot) {

          initialApplication = {
            ...initialApplication,

          }
        }
        console.log('initialApplication',initialApplication)
        rowKeys = Object.keys(initialApplication);

        // initialApplication = Object.values(initialApplication);

        // exportApplications.unshift(Object.values(rowKeys))

        exportApplications.push(initialApplication);

      }


    }
  }




  console.log('filterApplicationsssss',filterApplications)
  const PROGRAMS_OPTIONS =
    app_programs.length > 0
      ? app_programs
      : [
        { id: 1, name: "Saturday Academy", label: "Satuday Academy" },
        { id: 2, name: "In school", label: "In school" }
      ];

  const LOCATION_SITE_OPTIONS =
    location_sites.length > 0
      ? location_sites
      : [
        { name: "Raleigh", value: "Raleigh" },
        { name: "Durham", value: "Durham" }
      ];

  // const csvHeaders = [
  //   { label: 'Child', key: '(Child) Address' },
  //   { label: 'Parent', key: '(Child) Address'},
  // ];


  return (
    <ExportFilterModal>
      <div className="modal">
        <div className="modal-content">

          <div className="modal-header">
            <h2>Export Applications</h2>
            <span onClick={handleExit} className="close">
              &times;
            </span>
          </div>
          <div className="modal-container">
            <p>Filter:</p>
            <div>
              <select
                className="form-control"
                value={appGroupText}
                onChange={e => {
                  console.log(e.target.value);
                  setAppGroupText(e.target.value);
                }}>
                <option value="">All Class</option>
                {appGroups.map((opt, i) => (
                  <option key={i} value={opt.app_grp_id}>
                    {opt.name}
                  </option>
                ))}
              </select>
              <select
                className="form-control"
                value={classText}
                onChange={e => {
                  console.log(e.target.value);
                  setClassText(e.target.value);
                }}>
                <option value="">All Grade</option>
                {CLASS_OPTIONS.map((opt, i) => (
                  <option key={i} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <select
                className="form-control"
                value={statusText}
                onChange={e => {
                  setStatusText(e.target.value);
                }}>
                <option value="">All Status</option>
                {STUDENT_CLASS_OPTIONS.map((opt, i) => (
                  <option key={i} value={opt.value}>
                    {opt.name}
                  </option>
                ))}
              </select>
              <select
                className="form-control"
                value={colorText}
                onChange={e => {
                  setColorText(e.target.value);
                }}>
                <option value="">All Color</option>
                {COLOR_OPTIONS.map((opt, i) => (
                  <option key={i} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <Multiselect
                autcomplete="false"
                className="field-input"
                hasSelectAll={false}
                options={PROGRAMS_OPTIONS}
                displayValue="name"
                closeIcon="cancel"
                closeOnSelect={true}
                showCheckbox={true}
                placeholder="Choose Programs"
                selectedValues={appPrograms}
                onSelect={selectedList => {
                  setAppPrograms([...selectedList]);
                }}
                onRemove={selectedList => {

                  setAppPrograms([...selectedList]);
                }}
              />
              <div style={{ display: 'block' }}>
                <input
                  type="checkbox"
                  name="programs_select_all"
                  onChange={e => {
                    if (e.target.checked) {
                      setAppPrograms([...PROGRAMS_OPTIONS]);
                    }
                    else {
                      setAppPrograms([]);
                    }
                  }}
                /> Select All
              </div>
              <Multiselect
                autcomplete="false"
                className="field-input"
                hasSelectAll={false}
                options={LOCATION_SITE_OPTIONS}
                displayValue="name"
                closeIcon="cancel"
                closeOnSelect={false}
                showCheckbox={true}
                placeholder="Choose Location Sites"
                selectedValues={locationSites}
                onSelect={selectedList => {
  
                  setLocationSites([...selectedList]);
                }}
                onRemove={selectedList => {
 
                  setLocationSites([...selectedList]);
                }}
              />
              <div style={{ display: 'block' }}>
                <input
                  type="checkbox"
                  name="location_site_select_all"
                  onChange={e => {
                    if (e.target.checked) {
                      setLocationSites([...LOCATION_SITE_OPTIONS]);
                    }
                    else {
                      setLocationSites([]);
                    }
                  }}
                /> Select All
              </div>
              <br />
              <p>Report:</p>
              <div>
                <select
                  className="form-control"
                  value={reportType}
                  onChange={e => {
                    setReportType(e.target.value);
                  }}>
{/* 
                  <option value="">Please Select</option> */}
                  {REPORT_OPTIONS.map((opt, i) => (
                    <option key={i} value={opt.value}>
                      {opt.name}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            {reportType === 'biographical_data' ? <CSVLink

              id="filterExportButton"
              onClick={() => {

                let rowKeys = Object.keys(exportApplications[0]).reduce((accum, key) => {
                  return {
                    ...accum,
                    [key]: key
                  }
                }, {});

                exportApplications = exportApplications.map(item => {
                  return Object.values(item);
                });

                exportApplications.unshift(Object.values(rowKeys))


              }}
              style={{
                marginTop: "25px"
              }}
              data={isCustomForm ? [
                ['Child', '', '', '', '', '', '', 'Parent', '', '', '', ''],
                rowKeys,
                ...exportApplications
              ] : [
                ['Child', '', '', '', '', '', '', 'Parent', '', '', '', ''],
                rowKeys,
                ...exportApplications
              ]}

              filename={getVendorFilename()}>
              <span>Export</span>
            </CSVLink> : <CSVLink
              id="filterExportButton"
              style={{
                marginTop: "25px"
              }}
              onClick={() => {
                console.log('ExportApplications', exportApplications)
              }}
              data={exportApplications}
              filename={getVendorFilename()}>
              <span>Export</span>
            </CSVLink>}

          </div>
        </div>
      </div>
    </ExportFilterModal>
  );
};

export default ExportFilter;
