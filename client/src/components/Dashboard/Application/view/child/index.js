import React, { useState } from "react";
import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faPrint } from "@fortawesome/free-solid-svg-icons";

import ChildInformationFormStyled from "../../../ApplicationForm/ChildInformationForm";
import GeneralInformationFormStyled from "../../../ApplicationForm/GeneralInformationForm";
import MedicalCareInfoStyled from "../../../ApplicationForm/MedicalCareIformationForm";
import AllergyInformation from '../../../ApplicationForm/AllergyInformation'


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
  margin-bottom: 40px;
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
  handleSelectLatestApplication = null,
  isLot = 0
}) {
  const { applications } = useSelector(({ applications }) => {
    return { applications };
  });

  const handleScoresChange = () => { };

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

  console.log('childInformation555', childInformation)
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

      <ChildFormViewStyled className="printpage-break">
        <div id="applicationForm">
          <ChildInformationFormStyled
            printPageClassname="printpage-break child-information"
            handleChildFormDetailsChange={handleChildFormDetailsChange}
            childProfile={childInformation?.profile}
            counter={1}
            register={register}
            errors={errors}
            isReadonly={isReadonly}
            ProfileImg={ProfileImg}
            location_sites={location_sites}
            app_programs={app_programs}
            pastChildInformation={pastChildInformation}
            isVendorView={isVendorView}
          />
          <br />
          <GeneralInformationFormStyled
            printPageClassname="printpage-break general-information"
            handleChildFormDetailsChange={handleChildFormDetailsChange}
            childGeneralInformation={childInformation?.general_information}
            counter={1}
            handleScoresChange={handleScoresChange}
            register={register}
            errors={errors}
            isReadonly={isReadonly}
            pastChildInformation={pastChildInformation}
            isVendorView={isVendorView}
            isLot={isLot}
          />
          <br />
          {isLot && <AllergyInformation
            printPageClassname="printpage-break general-information"
            handleChildFormDetailsChange={handleChildFormDetailsChange}
            childGeneralInformation={childInformation?.general_information}
            counter={1}
            handleScoresChange={handleScoresChange}
            register={register}
            errors={errors}
            isReadonly={isReadonly}
            pastChildInformation={pastChildInformation}
            isVendorView={isVendorView}
          />}

          <br />
          <MedicalCareInfoStyled
            printPageClassname="printpage-break medicalCare-information"
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
