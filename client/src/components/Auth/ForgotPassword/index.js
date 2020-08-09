import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { requestPasswordChange } from "../../../redux/actions/Auth";
import Form from "./Form";
const ForgotPasswordStyled = styled.div`
  display: block;
  margin: 0 auto;
  background-color: white;
  width: 50%;
  overflow: auto;
  height: auto;
  padding: 5px 30px 5px 30px;
  position: relative;
  top: 5vh;
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
  p.info {
    color: #f26e21;
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
  const [userDetails, setUserDetails] = useState({
    email: "",
    reset_type: "email",
    security_question1: "",
    security_question2: "",
    security_question3: ""
  });
  const { status } = useSelector(({ status }) => {
    return { status };
  });
  const dispatch = useDispatch();
  const handleInputChange = (id, value) => {
    setUserDetails({ ...userDetails, [id]: value });
  };
  const handleFormSubmit = values => {
    // if (userDetails.hasOwnProperty('confirm_password')) {
    //   delete userDetails.confirm_password;
    // }

    console.log("user Details");
    dispatch(requestPasswordChange(userDetails));
  };
  return (
    <ForgotPasswordStyled data-testid="app-forgot-password">
      {status.message && status.message.length > 0 && (
        <p className={`${status.messageType}`}>{status.message}</p>
      )}
      <h2 data-testid="app-forgot-password-header">Forgot Password</h2>
      <Form
        onSubmit={handleFormSubmit}
        handleInputChange={handleInputChange}
        hasStatus={status.message && status.message.length}
      />
    </ForgotPasswordStyled>
  );
}
