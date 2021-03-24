import React, { useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPrint } from "@fortawesome/free-solid-svg-icons";

import ChildInformationFormStyled from "../../../DaycareApplicationForm/ChildInformationForm";
import GeneralInformationFormStyled from "../../../DaycareApplicationForm/GeneralInformationForm";
import MedicalCareInfoStyled from "../../../ApplicationForm/MedicalCareIformationForm";

import ReactToPrint, { useReactToPrint } from "react-to-print";

import "../../../ApplicationForm/ApplicationForm.css";

const ChildFormHeader = styled.div`
  @media print {
    .edit-button {
      display: none !important;
    }
  }

  @media print {
    body {
      transform: scale(0.7);
    }

    .page-break {
      display: block;
      page-break-before: auto;
      position: relative;
    }
    #applicationForm .field,
    .form-group .field {
      margin-bottom: 0px !important;
    }
  }
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
    z-index: 2;
  }

  .edit-button.activeEdit {
    color: #599600;
  }

  .application-date {
    position: relative;
    z-index: 1;
  }
  .application-date div {
    position: absolute;
    font-size: 1.5em;
    color: #f26e21;
    width: 100%;
    text-align: center;
    top: 18px;
    padding-left: 40px;
  }
  .application-date a {
    position: absolute;
    right: 56px;
    top: 6px;
    font-size: 16px;
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
  app_programs = [],
  isVendorView = false,
  handleSelectLatestApplication = null
}) {
  const { applications } = useSelector(({ applications }) => {
    return { applications };
  });

  console.log('childInformation54444',childInformation)

  console.log("this is my daycare");
  
  const handleScoresChange = () => {};

  let pastChildInformation = {};

  if (
    applications &&
    applications.applicationHistory &&
    applications.applicationHistory.length > 0
  ) {
    const application = JSON.parse(applications.applicationHistory[0].details);

    if (application && application.child) {
      pastChildInformation = application.child;
    }
  }

  return (
    <>
      <ChildFormHeader id="userApplicationForm">
        {" "}
        <h1>{vendor.name} Application Form</h1>
        {!isFormHistory && !isVendorView && (
          <button
            className={`edit-button ${!isReadonly ? "activeEdit" : ""}`}
            type="button"
            onClick={handleChangeToEdit}>
            <FontAwesomeIcon icon={faEdit} />
          </button>
        )}
        <div className="application-date">
          <div>
            {childInformation?.profile?.application_date}
            {
              isFormHistory && handleSelectLatestApplication && (
                <a 
                  href=""
                  target="_blank" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleSelectLatestApplication()
                  }}
                >
                  View Latest
                </a>
              )
            }
          </div>
        </div>
      </ChildFormHeader>

      <ChildFormViewStyled>
        <div id="applicationForm">
          <ChildInformationFormStyled
            className="page-break"
            handleChildFormDetailsChange={handleChildFormDetailsChange}
            childProfile={childInformation?.profile}
            counter={1}
            register={register}
            errors={errors}
            isReadonly={isReadonly}
            ProfileImg={ProfileImg}
            location_sites={[]}
            app_programs={[]}
            pastChildInformation={pastChildInformation}
            isVendorView={isVendorView}
          />
          <br />
          <GeneralInformationFormStyled
            className="page-break"
            handleChildFormDetailsChange={handleChildFormDetailsChange}
            childGeneralInformation={childInformation?.general_information}
            counter={1}
            handleScoresChange={handleScoresChange}
            register={register}
            errors={errors}
            isReadonly={isReadonly}
            pastChildInformation={pastChildInformation}
            isVendorView={isVendorView}
          />
          <br />
          <MedicalCareInfoStyled
            className="page-break"
            childEmergencyCare={childInformation?.emergency_care_information}
            handleChildFormDetailsChange={handleChildFormDetailsChange}
            counter={1}
            register={register}
            errors={errors}
            isReadonly={isReadonly}
            pastChildInformation={pastChildInformation}
            isVendorView={isVendorView}
          />
        </div>
      </ChildFormViewStyled>
    </>
  );
}
