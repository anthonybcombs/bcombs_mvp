import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import ChildInformationFormStyled from "../ChildInformationForm";
import GeneralInformationFormStyled from "../GeneralInformationForm";
import MedicalCareInfoStyled from '../MedicalCareIformationForm'

const ChildFormStyled = styled.div`

`;

export default function index() {

  const data = {};
  const {groups} = useSelector( ({groups}) => ({groups}) );

  return (
    <ChildFormStyled>
      <ChildInformationFormStyled />
      <GeneralInformationFormStyled />
      <MedicalCareInfoStyled />
    </ChildFormStyled>
  )
}