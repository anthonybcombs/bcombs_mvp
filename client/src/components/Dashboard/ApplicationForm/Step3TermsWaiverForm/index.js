import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import Section1FormStyled from "../Section1Form";
import Section2FormStyled from "../Section2Form";
import Section3FormStyled from "../Section3Form";
import moment from "moment";

const TermsWaiverFormStyled = styled.div`

`;

export default function index({
  handleWaiverFormDetailsChange,
  termsWaiver,
  register,
  errors,
  vendor
}) {

  const parseDate = (date) => {
    let today = new Date(date);
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();

    today = mm + '/' + dd + '/' + yyyy;

    return today;
  }

  //let pDate = parseDate(termsWaiver.date);

  let pDate = moment(termsWaiver.date).format("MM/DD/yyyy");
  
  console.log('pDate', pDate);

  return (
    <TermsWaiverFormStyled>
      {
        vendor.section1_show > 0 ?
        <Section1FormStyled 
          handleWaiverFormDetailsChange={handleWaiverFormDetailsChange}
          section1={termsWaiver.section1}
          pDate={pDate}
          register={register}
          errors={errors}
          name={vendor.section1_name}
          text={vendor.section1_text}
        />
        :
        ""
      }
      <br/>
      <br/>
      {
        vendor.section2_show > 0 ?
        <Section2FormStyled
          handleWaiverFormDetailsChange={handleWaiverFormDetailsChange}
          section2={termsWaiver.section2}
          pDate={pDate}
          register={register}
          errors={errors}
          name={vendor.section2_name}
          text={vendor.section2_text}
        />
        :
        ""
      }
      <br/>
      <br/>
      {
        vendor.section3_show > 0 ?
        <Section3FormStyled
          handleWaiverFormDetailsChange={handleWaiverFormDetailsChange}
          section3={termsWaiver.section3}
          pDate={pDate}
          register={register}
          errors={errors}
          name={vendor.section3_name}
          text={vendor.section3_text}
        />
        :
        ""
      }
      <br/>
      <br/>
    </TermsWaiverFormStyled>
  )
}