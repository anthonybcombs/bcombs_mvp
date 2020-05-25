import React, { useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMinusCircle, faPlusCircle } from "@fortawesome/free-solid-svg-icons";

import ChildInformationFormStyled from "../../../ApplicationForm/ChildInformationForm";
import GeneralInformationFormStyled from "../../../ApplicationForm/GeneralInformationForm";
import MedicalCareInfoStyled from "../../../ApplicationForm/MedicalCareIformationForm";

import "../../../ApplicationForm/ApplicationForm.css";

const ChildFormViewStyled = styled.div`
  margin-top: 50px;
  h1 {
    color: #f26e21;
    text-align: center;
  }
`;

export default function index({
  application,
  vendor,
  ProfileImg
}) {


  console.log("applicaiton", application)

  const childInformation = {
    profile: {
      image: "",
      first_name: application.child.firstname ? application.child.firstname: "-",
      last_name: application.child.lastname ? application.child.lastname: "-",
      nick_name: application.child?.nickname ? application.child?.nickname: "-",
      date_of_birth: new Date(application.child.birthdate),
      gender: application.child.gender,
      phone_type: application.child.phone_type ? application.child.phone_type: "-",
      phone_number: application.child.phone_number ? application.child.phone_number: "-",
      email_type: application.child.email_type ? application.child.email_type: "-",
      email_address: application.child.email_address ? application.child.email_address: "-",
      address: application.child.address ? application.child.address: "-",
      city: application.child.city ? application.child.city: "-",
      state: application.child.state ? application.child.state: "",
      zip_code: application.child.zip_code ? application.child.zip_code: "-",
      location_site: application.child.location_site ? application.child.location_site: ""
    },
    general_information: {
      grade: application.child.grade_number ? application.child.grade_number: "",
      class_rank: application.child.class_rank ? application.child.class_rank : "=",
      gpa_quarter_year: application.child.gpa_quarter_year ? application.child.gpa_quarter_year : "-",
      gpa_quarter_q1: application.child.gpa_quarter_q1 ? application.child.gpa_quarter_q1 : "-",
      gpa_quarter_q2: application.child.gpa_quarter_q2 ? application.child.gpa_quarter_q2 : "-",
      gpa_quarter_q3: application.child.gpa_quarter_q3 ? application.child.gpa_quarter_q3 : "-",
      gpa_quarter_q4: application.child.gpa_quarter_q4 ? application.child.gpa_quarter_q4 : "-",
      gpa_cumulative_year: application.child.gpa_cumulative_year ? application.child.gpa_cumulative_year : "-",
      gpa_cumulative_q1: application.child.gpa_cumulative_q1 ? application.child.gpa_cumulative_q1 : "-",
      gpa_cumulative_q2: application.child.gpa_cumulative_q2 ? application.child.gpa_cumulative_q2 : "-",
      gpa_cumulative_q3: application.child.gpa_cumulative_q3 ? application.child.gpa_cumulative_q3 : "-",
      gpa_cumulative_q4: application.child.gpa_cumulative_q4 ? application.child.gpa_cumulative_q4 : "-",
      act_scores: [],
      sat_scores: [],
      psat_scores: [],
      school_name: application.child.school_name ? application.child.school_name : "-",
      school_phone: application.child.school_phone ? application.child.school_phone : "-",
      was_suspended: !!application.child.has_suspended,
      reason_suspended: application.child.reason_suspended,
      mentee_start_year: application.child.year_taken,
      hobbies: application.child.hobbies ? application.child.hobbies : "-",
      life_events: application.child.life_events ? application.child.life_events : "-",
      career_goals: application.child.career_goals ? application.child.career_goals : "-",
      colleges: application.child.colleges ? application.child.colleges : "-",
      team_affiliations: application.child.affiliations ? application.child.affiliations : "-",
      awards: application.child.awards ? application.child.awards : "-",
      accomplishments: application.child.accomplishments ? application.child.accomplishments : "-",
      mentee_gain: application.child.mentee_gain_program ? application.child.mentee_gain_program : "-"
    },
    emergency_care_information: {
      doctor_name: application.child.doctor_name ? application.child.doctor_name : "-",
      doctor_phone: application.child.doctor_phone ? application.child.doctor_phone : "-",
      hospital_preference: application.child.hospital_preference ? application.child.hospital_preference : "-",
      hospital_phone: application.child.hospital_phone ? application.child.hospital_phone : "-"
    }
  }

  const handleChildFormDetailsChange = () => {}

  const handleScoresChange = () => {}

  const { register, handleSubmit, errors } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });

  return (
    <ChildFormViewStyled>
      <h1>
        {vendor.name} Application Form
      </h1>
      <div id="applicationForm">
        <ChildInformationFormStyled 
          handleChildFormDetailsChange={handleChildFormDetailsChange}
          childProfile={childInformation.profile}
          counter={1}
          register={register}
          errors={errors}
          isReadonly={true}
          ProfileImg={ProfileImg}
        />
        <GeneralInformationFormStyled 
          handleChildFormDetailsChange={handleChildFormDetailsChange}
          childGeneralInformation={childInformation.general_information}
          counter={1}
          handleScoresChange={handleScoresChange}
          register={register}
          errors={errors}
          isReadonly={true}
        />
        <MedicalCareInfoStyled 
          childEmergencyCare={childInformation.emergency_care_information}
          handleChildFormDetailsChange={handleChildFormDetailsChange}
          counter={1}
          register={register}
          errors={errors}
          isReadonly={true}
        />
      </div>
    </ChildFormViewStyled>
  )
}