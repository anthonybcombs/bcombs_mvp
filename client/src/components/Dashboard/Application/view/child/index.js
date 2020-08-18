import React, { useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";

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
  .edit-button {
    border: 0;
    position: absolute;
    right: 10px;
    cursor: pointer;
    font-size: 2em;
    color: #f26e21;
    background: none;
    z-index: 1;
  }
`;

export default function index({
  childInformation,
  vendor = {},
  ProfileImg,
  isReadonly,
  handleChangeToEdit,
  errors,
  register,
  handleChildFormDetailsChange,
  isFormHistory = false
}) {
    
  const handleScoresChange = () => {}
  
  return (
    <ChildFormViewStyled>
      <h1>
        {vendor.name} Application Form
      </h1>
      <div id="applicationForm">
        {
          !isFormHistory && (
            <button
              className="edit-button"
              type="button"
              onClick={handleChangeToEdit}>
              <FontAwesomeIcon 
                icon={faEdit}
              />
            </button>
          )
        }


        <ChildInformationFormStyled 
          handleChildFormDetailsChange={handleChildFormDetailsChange}
          childProfile={childInformation.profile}
          counter={1}
          register={register}
          errors={errors}
          isReadonly={isReadonly}
          ProfileImg={ProfileImg}
        />
        <GeneralInformationFormStyled 
          handleChildFormDetailsChange={handleChildFormDetailsChange}
          childGeneralInformation={childInformation.general_information}
          counter={1}
          handleScoresChange={handleScoresChange}
          register={register}
          errors={errors}
          isReadonly={isReadonly}
        />
        <MedicalCareInfoStyled 
          childEmergencyCare={childInformation.emergency_care_information}
          handleChildFormDetailsChange={handleChildFormDetailsChange}
          counter={1}
          register={register}
          errors={errors}
          isReadonly={isReadonly}
        />
      </div>
    </ChildFormViewStyled>
  )
}