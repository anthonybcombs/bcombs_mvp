import React, { useState } from "react";
import styled from "styled-components";
import Form from "./Form";
const CreateUserStyled = styled.div`
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
  const [userDetails, setUserDetails] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: ""
  });
  const handleInputChange = (id, value) => {
    setUserDetails({ ...userDetails, [id]: value });
  };
  const handleFormSubmit = e => {
    e.preventDefault();
    //future backend code
  };
  return (
    <CreateUserStyled data-testid="app-create-user">
      <h1>Create my account</h1>
      <Form
        onSubmit={handleFormSubmit}
        handleInputChange={handleInputChange}
        userDetails={userDetails}
      />
    </CreateUserStyled>
  );
}
