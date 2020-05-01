import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import WaiverFormStyled from "../WaiverForm";
import LiabilityWaiverFormStyled from "../LiabilityWaiverForm";
import TermsConditionsFormStyled from "../TermsConditionForm";

const TermsWaiverFormStyled = styled.div`

`;

export default function index() {

  const data = {};
  const {groups} = useSelector( ({groups}) => ({groups}) );

  return (
    <TermsWaiverFormStyled>
      <WaiverFormStyled />
      <LiabilityWaiverFormStyled />
      <TermsConditionsFormStyled />
    </TermsWaiverFormStyled>
  )
}