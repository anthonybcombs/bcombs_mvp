import React, { useState } from "react";
import styled from "styled-components";
import Form from "./Form";
const CreateUserStyled = styled.div`
  display: block;
  margin: 0 auto;
  background-color: white;
  width: 60%;
  overflow: auto;
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
export default function index() {
  const [userDetails, setUserDetails] = useState({
    userType: "user",
    username: "",
    email: "",
    password: "",
    confirm_password: ""
  });
  const handleInputChange = (id, value) => {
    setUserDetails({ ...userDetails, [id]: value });
  };
  const handleChangeUserType = value => {
    setUserDetails({ ...userDetails, userType: value });
  };
  const handleFormSubmit = values => {
    //future backend code
  };
  return (
    <CreateUserStyled data-testid="app-create-user">
      <h2>Create my account ({userDetails.userType})</h2>
      <Form
        onSubmit={handleFormSubmit}
        handleInputChange={handleInputChange}
        userDetails={userDetails}
        handleChangeUserType={handleChangeUserType}
      />
    </CreateUserStyled>
  );
}
