import React, { useState } from "react";
import styled from "styled-components";
import Form from "../Forms/CreateProfileForm";
//  overflow: auto;
const CreateProfileStyled = styled.div`
  display: block;
  margin: 0 auto;
  background-color: white;
  width: 30%;

  height: auto;
  padding: 5px 30px 5px 30px;
  position: relative;
  top: 3vh;
  box-shadow: 0 0 25px #eae9e9;
  img {
    display: block;
    margin: 0 auto;
  }
  h2 {
    text-align: center;
    font-weight: normal;
  }
  @media (min-width: 600px) {
    h2 {
      font-weight: bold;
    }
  }
`;
export default function index({ setCurrentPage, setProfileDetails, userType }) {
  const [personalInfo, setPersonalInfo] = useState({
    firstname: "",
    lastname: "",
    gender: "male",
    customgender: "",
    familyrelationship: "father",
    zipcode: "",
    dateofbirth: ""
  });
  const handleInputChange = (id, value) => {
    setPersonalInfo({ ...personalInfo, [id]: value });
  };
  const handleFormSubmit = values => {
    setCurrentPage(prevCurrentPage => {
      return prevCurrentPage + 1;
    });
    setProfileDetails(prevPersonalDetails => {
      return { ...prevPersonalDetails, personalInfo: personalInfo };
    });
  };
  return (
    <CreateProfileStyled data-testid="app-profile">
      <h2>Let's get started!</h2>
      <Form
        data={personalInfo}
        onSubmit={handleFormSubmit}
        handleInputChange={handleInputChange}
        userType={userType}
      />
    </CreateProfileStyled>
  );
}
