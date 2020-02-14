import React, { useState } from "react";
import styled from "styled-components";
import Form from "./Form";
const ForgotPasswordStyled = styled.div`
  display: block;
  margin: 0 auto;
  background-color: white;
  width: 40%;
  overflow: auto;
  height: auto;
  padding: 20px;
  position: relative;
  top: 5vh;
  box-shadow: 0 0 25px #eae9e9;
  img {
    display: block;
    margin: 0 auto;
  }
  h1 {
    text-align: center;
    font-weight: normal;
  }
  @media (min-width: 600px) {
    h1 {
      font-weight: bold;
    }
  }
`;
export default function index() {
  const [userDetails, setUserDetails] = useState({
    email: ""
  });
  const handleInputChange = (id, value) => {
    setUserDetails({ ...userDetails, [id]: value });
  };
  const handleFormSubmit = values => {
    console.log(values);
    //future backend code
  };
  return (
    <ForgotPasswordStyled data-testid="app-forgot-password">
      <h1 data-testid="app-forgot-password-header">Forgot Password</h1>
      <Form
        userDetails={userDetails}
        onSubmit={handleFormSubmit}
        handleInputChange={handleInputChange}
      />
    </ForgotPasswordStyled>
  );
}
