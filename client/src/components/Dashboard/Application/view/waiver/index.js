import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";

import Section1FormStyled from "../../../ApplicationForm/Section1Form";
import Section2FormStyled from "../../../ApplicationForm/Section2Form";
import Section3FormStyled from "../../../ApplicationForm/Section3Form";;

import moment from "moment";
import "../../../ApplicationForm/ApplicationForm.css";

const TermsWaiverFormViewStyled = styled.div`
  margin-bottom: 40px;
  padding-left: 15px;
  padding-right: 15px;
`;

export default function index({
  application
}) {

  const pDate = moment(application.section1_date_signed).format("MM/DD/YYYY");

  const termsWaiver = {
    section1: {
      checked: !!application.section1_signature,
      signature: application.section1_signature
    },
    section2: {
      checked: !!application.section2_signature,
      signature: application.section2_signature
    },
    section3: {
      checked: !!application.section3_signature,
      signature: application.section3_signature
    }
  }

  const handleWaiverFormDetailsChange = () => {}
  const { register, handleSubmit, errors } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });

  console.log("waiver applciation", application);

  return (
    <TermsWaiverFormViewStyled>
      <div id="applicationForm">
        {
          application.section1_name && application.section1_text ?
          <>
            <Section1FormStyled 
              handleWaiverFormDetailsChange={handleWaiverFormDetailsChange}
              section1={termsWaiver.section1}
              pDate={pDate}
              register={register}
              errors={errors}
              name={application.section1_name}
              text={application.section1_text}
              isReadonly={true}
            />
            <br/>
            <br/>
          </>
          :
          ""
        }
        {
          application.section2_name && application.section2_text ?
          <>
            <Section2FormStyled
              handleWaiverFormDetailsChange={handleWaiverFormDetailsChange}
              section2={termsWaiver.section2}
              pDate={pDate}
              register={register}
              errors={errors}
              name={application.section2_name}
              text={application.section2_text}
              isReadonly={true}
            />
            <br/>
            <br/>
          </>
          :
          ""
        }

        {
          application.section3_name && application.section3_text ?
          <>
            <Section3FormStyled
              handleWaiverFormDetailsChange={handleWaiverFormDetailsChange}
              section3={termsWaiver.section3}
              pDate={pDate}
              register={register}
              errors={errors}
              name={application.section3_name}
              text={application.section3_text}
              isReadonly={true}
            />
            <br/>
            <br/>
          </>
          :
          ""
        }
      </div>
    </TermsWaiverFormViewStyled>
  )
}