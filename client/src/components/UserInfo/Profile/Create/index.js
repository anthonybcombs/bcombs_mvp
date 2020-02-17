import React from "react";
import styled from "styled-components";
import Form from "./Form";
const CreateProfileStyled = styled.div`
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
  return (
    <CreateProfileStyled data-testid="app-profile-create">
      <h2>Let's get started</h2>
      <Form />
    </CreateProfileStyled>
  );
}
