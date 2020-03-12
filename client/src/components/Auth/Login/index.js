import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "@reach/router";
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
  h2 {
    text-align: center;
    font-weight: normal;
  }
  p.error {
    color: red;
    text-align: center;
    font-size: 1.3em;
  }
  @media (min-width: 600px) {
    h2 {
      font-weight: bold;
    }
  }
`;
export default function index() {
  const [userDetails, setUserDetails] = useState({ email: "", password: "" });
  const { auth } = useSelector(({ auth }) => {
    return { auth };
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleInputChange = (id, value) => {
    setUserDetails({ ...userDetails, [id]: value });
  };
  const handleFormSubmit = async values => {
    await dispatch(requestAuth(userDetails));
  };
  if (auth.hasOwnProperty("sub") && auth.email_verified) {
    navigate("/dashboard", { state: { calendarName: "" } }, { replace: true });
  }
  return (
    <LoginStyled data-testid="app-login">
      <img data-testid="app-login-logo" src={Logo} alt="Bcombs Logo" />
      <h2 data-testid="app-login-header">Login To Your Account</h2>
      {auth && auth.message && <p className="error">{auth.message}</p>}
      <Form
        onSubmit={handleFormSubmit}
        userDetails={userDetails}
        handleInputChange={handleInputChange}
      />
    </LoginStyled>
  );
}
