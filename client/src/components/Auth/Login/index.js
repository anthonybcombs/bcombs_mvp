import React, { useState } from "react";
import styled from "styled-components";
import Logo from "../../../images/logo1.png";
import Form from "./Form";

const LoginStyled = styled.div`
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
    height: 420px;
    h1 {
      font-weight: bold;
    }
  }
`;
export default function index() {
  const [userDetails, setUserDetails] = useState({ email: "", password: "" });
  const handleInputChange = (id, value) => {
    setUserDetails({ ...userDetails, [id]: value });
  };
  const handleFormSubmit = e => {
    e.preventDefault();
    //future backend code
  };
  return (
    <LoginStyled data-testid="app-login">
      <img data-testid="app-login-logo" src={Logo} alt="Bcombs Logo" />
      <h1 data-testid="app-login-header">Login To Your Account</h1>
      <Form
        onSubmit={handleFormSubmit}
        userDetails={userDetails}
        handleInputChange={handleInputChange}
      />
    </LoginStyled>
  );
}
