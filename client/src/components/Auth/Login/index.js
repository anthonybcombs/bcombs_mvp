import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "@reach/router";
import { webAuth } from ".././../../helpers/Auth0";
import { parse } from "query-string";

import styled from "styled-components";
import Logo from "../../../images/logo1.png";
import Form from "./Form";
import { requestAuth } from "../../../redux/actions/Auth";
const LoginStyled = styled.div`
  display: block;
  margin: 0 auto;
  background-color: white;
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
  p.info {
    text-align: center;
    font-size: 1.3em;
    color: #f26e21;
  }
  p.error {
    text-align: center;
    font-size: 1.3em;
    color: red;
  }
  @media (min-width: 600px) {
    h2 {
      font-weight: bold;
    }
  }

  @media (max-width: 768px) {
    width: 80%;
  }
  @media (min-width: 769px) {
    width: 50%;
  }
`;
const SUCCESS_STATUS = `User created! We sent confirmation email`;

export default function index(props) {
  const [userDetails, setUserDetails] = useState({ email: "", password: "" });
  const [registrationSuccess, setRegistrationSuccess] = useState("");
  const { auth, status } = useSelector(({ auth, status }) => {
    return { auth, status };
  });

  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = parse(location.search);

  useEffect(() => {
    if (queryParams && queryParams.success) {
      try {
        let decodedStrings = decodeURIComponent(queryParams.success);

        if (decodedStrings && decodedStrings.includes(SUCCESS_STATUS)) {
          setRegistrationSuccess(decodedStrings);
        }
      } catch (err) {
        console.log("Error", err);
      }
    }
  }, []);
  const handleInputChange = (id, value) => {
    setUserDetails({ ...userDetails, [id]: value });
  };

  const handleFormSubmit = values => {
    dispatch(requestAuth(userDetails));
  };
  if (auth.hasOwnProperty("sub") && auth.email_verified) {
    navigate("/dashboard", { state: { calendarName: "" } }, { replace: true });
  }
  const handleFacebookSignIn = () => {
    webAuth.authorize({
      connection: "facebook",
      responseType: "token",
      redirectUri: `${process.env.HOST}/sociallanding`
    });
  };
  const handleGoogleSignIn = () => {
    webAuth.authorize({
      connection: "google-oauth2",
      responseType: "token",
      redirectUri: `${process.env.HOST}/sociallanding`
    });
  };
  return (
    <LoginStyled data-testid="app-login">
      <img data-testid="app-login-logo" src={Logo} alt="Bcombs Logo" />
      {status && status.message && (
        <p className={`${status.messageType}`}>{status.message}</p>
      )}
      {registrationSuccess !== "" && (
        <p className={`info`}>{registrationSuccess}</p>
      )}
      <h2 data-testid="app-login-header">Login To Your Account</h2>
      <Form
        onSubmit={handleFormSubmit}
        handleInputChange={handleInputChange}
        handleGoogleSignIn={handleGoogleSignIn}
        handleFacebookSignIn={handleFacebookSignIn}
      />
    </LoginStyled>
  );
}
