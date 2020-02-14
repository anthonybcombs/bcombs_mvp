import React, { useState } from "react";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import Logo from "../../../images/logo1.png";
import Form from "./Form";
import { requestAuth } from "../../../redux/actions/Auth";

const LoginStyled = styled.div`
  display: block;
  margin: 0 auto;
  background-color: white;
  width: 50%;
  padding: 20px;
  height: auto;
  overflow: auto;
  position: relative;
  top: 3vh;
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
  const [userDetails, setUserDetails] = useState({ email: "", password: "" });
  const dispatch = useDispatch();
  const handleInputChange = (id, value) => {
    setUserDetails({ ...userDetails, [id]: value });
  };
  const handleFormSubmit = values => {
    dispatch(requestAuth());
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
