import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import ParentInformationStyled from "../../../ApplicationForm/ParentInformationForm";
import EmergencyContactFormStyled from "../../../ApplicationForm/EmergencyContacForm";

import "../../../ApplicationForm/ApplicationForm.css";

const ParentFormViewStyled = styled.div`
  margin-bottom: 40px;
  padding-left: 15px;
  padding-right: 15px;

  @media print {
    padding: 10px !important;
  }

`;

export default function index({
  parents,
  vendor,
  ProfileImg,
  handleParentFormDetailsChange,
  isReadonly,
  emergencyContacts = [],
  isVendorView = false,
  selectedApplication = {}
}) {
  const { register, handleSubmit, errors } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });

  const { applications } = useSelector(
    ({ applications }) => {
      return {applications}
    }
  );

  let pastParentInformation = [];

  let pastEmergencyContacts = []

  if(applications && 
    applications.applicationHistory && 
    applications.applicationHistory.length > 0) {

    const application = JSON.parse(applications.applicationHistory[0].details); 

    if(application && application.parents && application.parents.length > 0) {
      pastParentInformation = application.parents;
    }

    if(application && application.emergency_contacts) {
      pastEmergencyContacts = JSON.parse(application.emergency_contacts);

      if(Array.isArray(pastEmergencyContacts) && pastEmergencyContacts.length > 0) {
        pastEmergencyContacts = pastEmergencyContacts;
      } else {
        pastEmergencyContacts = [];
      }

      console.log("pastEmergencyContacts", pastEmergencyContacts);      
    }
  }
  
  let tempEC = [
    {
      first_name: "-",
      last_name: "-",
      gender: "-",
      mobile_phone: "-",
      work_phone: "-",
      relationship_to_child: "-"
    },
    {
      first_name: "-",
      last_name: "-",
      gender: "-",
      mobile_phone: "-",
      work_phone: "-",
      relationship_to_child: "-"
    },
    {
      first_name: "-",
      last_name: "-",
      gender: "-",
      mobile_phone: "-",
      work_phone: "-",
      relationship_to_child: "-"
    },
    {
      first_name: "-",
      last_name: "-",
      gender: "-",
      mobile_phone: "-",
      work_phone: "-",
      relationship_to_child: "-"
    }
  ];

  const renderParentForm = () => {
    let items = [];

    for (let i = 1; i <= parents.length; i++) {
      const parent = parents[i - 1];
      // const profile = {
      //   first_name: parent.firstname ? parent.firstname : "-",
      //   last_name: parent.lastname ? parent.lastname : "-",
      //   phone_type: parent.phont_type ? parent.phone_type : "-",
      //   phone_number: parent.phone_number ? parent.phone_number : "-",
      //   email_type: parent.email_type ? parent.email_type : "-",
      //   email_address: parent.email_address ? parent.email_address : "-",
      //   address: parent.address ? parent.address : "-",
      //   city: parent.city ? parent.city : "-",
      //   state: parent.state ? parent.state : "-",
      //   zip_code: parent.zip_code ? parent.zip_code : "-",
      //   occupation: parent.zip_code ? parent.zip_code : "-",
      //   employer_name: parent.employer_name ? parent.employer_name : "-",
      //   goals_parent_program: parent.zip_cgoals_parent_programode ? parent.goals_parent_program : "-",
      //   goals_child_program: parent.zip_goals_child_programcode ? parent.goals_child_program : "-",
      //   live_area: parent.live_area ? parent.live_area : 0, // 1: 1 - 5 year, 2: 5 - 10 year, 3: more than 10 year
      //   level_education: parent.level_education ? parent.level_education : "-",
      //   child_importance_hs: parent.child_importance_hs ? parent.child_importance_hs : "-",
      //   child_importance_col: parent.child_importance_col ? parent.child_importance_col : "-"
      // }

      // console.log("PROFILE ", profile);

      if (i == 1) {
        items.push(
          <div key={i}>
            <ParentInformationStyled
              key={i}
              handleParentFormDetailsChange={handleParentFormDetailsChange}
              parentProfile={parent.profile}
              counter={i}
              register={register}
              errors={errors}
              isReadonly={isReadonly}
              isUpdate={true}
              ProfileImg={ProfileImg}
              pastParentInformation={pastParentInformation[i - 1]}
              isVendorView={isVendorView}
              selectedApplication={selectedApplication}
            />
          </div>
        );
      } else {
        items.push(
          <div key={i}>
            <hr className="style-eight"></hr>
            <ParentInformationStyled
              key={i}
              handleParentFormDetailsChange={handleParentFormDetailsChange}
              parentProfile={parent.profile}
              counter={i}
              register={register}
              errors={errors}
              isReadonly={isReadonly}
              isUpdate={true}
              ProfileImg={ProfileImg}
              pastParentInformation={pastParentInformation[i - 1]}
              isVendorView={isVendorView}
              selectedApplication={selectedApplication}
            />
          </div>
        );
      }
    }
    return items;
  };

  console.log("parentProfile", parents);
  return (
    <ParentFormViewStyled className="printpage-break parent-information">
      <div id="applicationForm">
        {renderParentForm()}
        <br/>
        <br/>
        <EmergencyContactFormStyled
          handleParentFormDetailsChange={handleParentFormDetailsChange}
          parentEmergencyContacts={
            emergencyContacts.length > 0 ? emergencyContacts : tempEC
          }
          isReadonly={isReadonly}
          register={register}
          errors={errors}
          pastEmergencyContacts={pastEmergencyContacts}
          isVendorView={isVendorView}
        />
      </div>
    </ParentFormViewStyled>
  );
}
