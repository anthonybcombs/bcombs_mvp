import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Form from "../Forms/CreateSecurityQuestionsForm";
//  overflow: auto;
const CreateSecurityQuestionsStyled = styled.div`
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
export default function index({
  profileDetails,
  setCurrentPage,
  setProfileDetails
}) {
  const [personalInfo, setPersonalInfo] = useState({
    firstname: profileDetails.firstname,
    lastname: profileDetails.lastname,
    gender: profileDetails.gender,
    customgender: profileDetails.customgender,
    familyrelationship: profileDetails.familyrelationship,
    zipcode: profileDetails.zipcode,
    dateofbirth: profileDetails.dateofbirth,
    securityquestion1: "",
    securityquestion1answer: "",
    securityquestion2: "",
    securityquestion2answer: "",
    securityquestion3: "",
    securityquestion3answer: "",
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
    <CreateSecurityQuestionsStyled>
      <Form
        data={personalInfo}
        onSubmit={handleFormSubmit}
        handleInputChange={handleInputChange}
      />
    </CreateSecurityQuestionsStyled>
  );
}
