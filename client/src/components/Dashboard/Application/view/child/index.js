import React, { useRef, useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPrint } from "@fortawesome/free-solid-svg-icons";

import ChildInformationFormStyled from "../../../ApplicationForm/ChildInformationForm";
import GeneralInformationFormStyled from "../../../ApplicationForm/GeneralInformationForm";
import MedicalCareInfoStyled from "../../../ApplicationForm/MedicalCareIformationForm";

import ReactToPrint, { useReactToPrint } from "react-to-print";

import "../../../ApplicationForm/ApplicationForm.css";

const ChildFormHeader = styled.div`
  h1 {
    color: #f26e21;
    text-align: center;
  }
  .edit-button {
    border: 0;
    position: absolute;
    right: 80px;
    cursor: pointer;
    font-size: 2em;
    color: #f26e21;
    background: none;
    z-index: 1;
  }

  .print-button {
    border: 0;
    position: absolute;
    right: 150px;
    cursor: pointer;
    font-size: 2em;
    color: #f26e21;
    background: none;
    z-index: 1;
  }

  .application-date { position: relative; }
  .application-date div {
    position: absolute;
    font-size: 1.5em;
    color: #f26e21;
    width: 100%;
    text-align: center;
    top: 18px;
    padding-left: 40px;
  }

  @media (max-width: 768px) {
    .application-date div {
      top: unset;
      bottom: -10px;
      padding-left: unset;
      font-size: 1em;
    }
  }
`;

const ChildFormViewStyled = styled.div`
  padding-left: 15px;
  padding-right: 15px;
  margin-top: 30px;
  h1 {
    color: #f26e21;
    text-align: center;
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
  isFormHistory = false,
  location_sites = [],
  app_programs = []
}) {
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    copyStyles: true
  });

  const handleScoresChange = () => {};

  return (
    <>
      <ChildFormHeader id="userApplicationForm">
        {" "}
        <h1>{vendor.name} Application Form</h1>
        {!isFormHistory && (
          <button
            className="edit-button"
            type="button"
            onClick={handleChangeToEdit}>
            <FontAwesomeIcon icon={faEdit} />
          </button>
        )}
        <button className="print-button" onClick={handlePrint}>
          {" "}
          <FontAwesomeIcon icon={faPrint} />
        </button>
        <div className='application-date'>
          <div>{childInformation.profile.application_date}</div>
        </div>
      </ChildFormHeader>

      <ChildFormViewStyled ref={componentRef}>
        <div id="applicationForm">
          <ChildInformationFormStyled
            handleChildFormDetailsChange={handleChildFormDetailsChange}
            childProfile={childInformation.profile}
            counter={1}
            register={register}
            errors={errors}
            isReadonly={isReadonly}
            ProfileImg={ProfileImg}
            location_sites={location_sites}
            app_programs={app_programs}
          />
          <br />
          <GeneralInformationFormStyled
            handleChildFormDetailsChange={handleChildFormDetailsChange}
            childGeneralInformation={childInformation.general_information}
            counter={1}
            handleScoresChange={handleScoresChange}
            register={register}
            errors={errors}
            isReadonly={isReadonly}
          />
          <br />
          <br />
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
    </>
  );
}
