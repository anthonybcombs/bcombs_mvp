import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import ParentInformationStyled from "../../../ApplicationForm/ParentInformationForm";
import EmergencyContactFormStyled from "../../../ApplicationForm/EmergencyContacForm";

import "../../../ApplicationForm/ApplicationForm.css";

const ParentFormViewStyled = styled.div`

`;

export default function index({
  application,
  vendor,
  ProfileImg
}) {
  const handleParentFormDetailsChange = () => {}
    
  const { register, handleSubmit, errors } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });

  const emergencyContacts = [{
    first_name: "-",
    last_name: "-",
    gender: "-",
    mobile_phone: "-",
    work_phone: "-",
    relationship_to_child: "-"
  },{
    first_name: "-",
    last_name: "-",
    gender: "-",
    mobile_phone: "-",
    work_phone: "-",
    relationship_to_child: "-"
  },{
    first_name: "-",
    last_name: "-",
    gender: "-",
    mobile_phone: "-",
    work_phone: "-",
    relationship_to_child: "-"
  },{
    first_name: "-",
    last_name: "-",
    gender: "-",
    mobile_phone: "-",
    work_phone: "-",
    relationship_to_child: "-"
  }]

  const renderParentForm = () => {

    const parents = application.parents;

    let items = [];

    for(let i = 1; i <= parents.length; i++) {
      const parent = parents[i - 1];
      const profile = {
        first_name: parent.firstname ? parent.firstname : "-",
        last_name: parent.lastname ? parent.lastname : "-",
        phone_type: parent.phont_type ? parent.phone_type : "-",
        phone_number: parent.phone_number ? parent.phone_number : "-",
        email_type: parent.email_type ? parent.email_type : "-",
        email_address: parent.email_address ? parent.email_address : "-",
        address: parent.address ? parent.address : "-",
        city: parent.city ? parent.city : "-",
        state: parent.state ? parent.state : "-",
        zip_code: parent.zip_code ? parent.zip_code : "-",
        occupation: parent.zip_code ? parent.zip_code : "-",
        employer_name: parent.employer_name ? parent.employer_name : "-",
        goals_parent_program: parent.zip_cgoals_parent_programode ? parent.goals_parent_program : "-",
        goals_child_program: parent.zip_goals_child_programcode ? parent.goals_child_program : "-",
        live_area: parent.live_area ? parent.live_area : 0, // 1: 1 - 5 year, 2: 5 - 10 year, 3: more than 10 year
        level_education: parent.level_education ? parent.level_education : "-",
        child_importance_hs: parent.child_importance_hs ? parent.child_importance_hs : "-",
        child_importance_col: parent.child_importance_col ? parent.child_importance_col : "-"
      }

      console.log("PROFILE ", profile);

      if(i == 1) {
        items.push(
          <div key={i}>
            <ParentInformationStyled 
              key={i}
              handleParentFormDetailsChange={handleParentFormDetailsChange}
              parentProfile={profile}
              counter={i}
              register={register}
              errors={errors}
              isReadonly={true}
              ProfileImg={ProfileImg}
            />
          </div>
        )
      } else {
        items.push(
          <div key={i}>
            <hr className="style-eight"></hr>
            <ParentInformationStyled 
              key={i}
              handleParentFormDetailsChange={handleParentFormDetailsChange}
              parentProfile={profile}
              counter={i}
              register={register}
              errors={errors}
              isReadonly={true}
              ProfileImg={ProfileImg}
            />
          </div>
        )
      }
    }
    return items;
  }
  return (
    <ParentFormViewStyled>
      <div id="applicationForm">
        {renderParentForm()}
        <EmergencyContactFormStyled
          handleParentFormDetailsChange={handleParentFormDetailsChange}
          parentEmergencyContacts={emergencyContacts}
          isReadonly={true}
        />
      </div>
    </ParentFormViewStyled>
  )
}