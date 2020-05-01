import React, { useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";

import ParentInformationStyled from "../ParentInformationForm";
import EmergencyContactFormStyled from "../EmergencyContacForm";

const ParentFormStyled = styled.div`

`;

export default function index() {

  const data = {};
  const {groups} = useSelector( ({groups}) => ({groups}) );

  return (
    <ParentFormStyled>
      <ParentInformationStyled />
      <EmergencyContactFormStyled />
    </ParentFormStyled>
  )
}