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
  application,
  handleWaiverFormDetailsChange = {},
  register,
  errors,
  isReadonly,
  termsWaiver,
  vendor,
  isVendorView = false
}) {


  console.log("selected vendor", vendor);
  console.log("application", application);

  const pDate = isReadonly ? 
                moment(application.section1_date_signed).format("MM/DD/YYYY") :
                moment().format("MM/DD/YYYY")
                
  return (
    <TermsWaiverFormViewStyled>
      <div id="applicationForm">
        {
          (application.section1_name && application.section1_text) || 
          (!isReadonly && vendor.section1_show) ||
          (isVendorView && vendor.section1_show && application.section1_name && application.section1_text) ?
          <>
            <Section1FormStyled 
              handleWaiverFormDetailsChange={handleWaiverFormDetailsChange}
              section1={termsWaiver.section1}
              pDate={pDate}
              register={register}
              errors={errors}
              name={isReadonly ? application.section1_name : vendor.section1_name}
              text={isReadonly ? application.section1_text : vendor.section1_text}
              isReadonly={isVendorView ? true: isReadonly}
              isVendorView={isVendorView}
            />
            <br/>
            <br/>
          </>
          :
          ""
        }
        {
          (application.section2_name && application.section2_text) || 
          (!isReadonly && vendor.section2_show) ||
          (isVendorView && vendor.section2_show && application.section2_name && application.section2_text) ?
          <>
            <Section2FormStyled
              handleWaiverFormDetailsChange={handleWaiverFormDetailsChange}
              section2={termsWaiver.section2}
              pDate={pDate}
              register={register}
              errors={errors}
              name={isReadonly ? application.section2_name : vendor.section2_name}
              text={isReadonly ? application.section2_text : vendor.section2_text}
              isReadonly={isVendorView ? true: isReadonly}
              isVendorView={isVendorView}
            />
            <br/>
            <br/>
          </>
          :
          ""
        }

        {
          (application.section3_name && application.section3_text) || 
          (!isReadonly && vendor.section3_show) ||
          (isVendorView && vendor.section3_show && application.section3_name && application.section3_text) ?
          <>
            <Section3FormStyled
              handleWaiverFormDetailsChange={handleWaiverFormDetailsChange}
              section3={termsWaiver.section3}
              pDate={pDate}
              register={register}
              errors={errors}
              name={isReadonly ? application.section3_name : vendor.section3_name}
              text={isReadonly ? application.section3_text : vendor.section3_text}
              isReadonly={isVendorView ? true: isReadonly}
              isVendorView={isVendorView}
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