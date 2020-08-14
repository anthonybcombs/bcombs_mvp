import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Form from "../Forms/CreateProfileForm";
//  overflow: auto;
const CreateProfileStyled = styled.div`
  display: block;
  margin: 0 auto;
  background-color: white;
  // width: 30%;

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
  @media (max-width: 768px) {
    width: 80%;
    margin-bottom: 2rem;
    padding-bottom: 1rem;
  }
  @media (min-width: 769px) {
    width: 100%;
    max-width: 600px;
    padding-bottom: 1rem;
  }
`;
export default function index({
  profileDetails,
  setCurrentPage,
  setProfileDetails,
  userType
}) {
  const [personalInfo, setPersonalInfo] = useState({
    firstname: profileDetails.firstname,
    lastname: profileDetails.lastname,
    gender: "",
    customgender: "",
    familyrelationship: "",
    zipcode: "",
    dateofbirth: ""
  });
  console.log(`profileDetails`, profileDetails);
  useEffect(() => {
    if (profileDetails) {
      setPersonalInfo({
        ...personalInfo,
        ...profileDetails
      });
    }
  }, [profileDetails]);
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
