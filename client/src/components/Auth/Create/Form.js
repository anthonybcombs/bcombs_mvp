import React, { useContext } from "react";
import styled, { ThemeContext } from "styled-components";
const CreateUserFormStyled = styled.form`
  input:required {
    box-shadow: none;
  }
  input:invalid {
    box-shadow: none;
  }
  input {
    background: none;
    width: 100%;
    color: black;
    font-size: ${({ theme }) => theme.input.fontSize};
    display: block;
    border: none;
    border-radius: 1;
    border: none;
    outline: 0;
    border-bottom: 2px solid lightgrey;
    margin-top: 30px;
    margin-bottom: 30px;
    outline: 0;
  }
  input:focus {
    border-color: green;
    transition: 3s;
  }
  button {
    color: ${({ theme }) => theme.button.textColor.primary};
    font-size: ${({ theme }) => theme.button.fontSize} !important;
    border: none;
    box-shadow: 0px 3px 6px #908e8e;
    cursor: pointer;
  }
  button[type="submit"] {
    padding: 10px;
    display: block;
    margin: 10px auto;
    background-color: ${({ theme }) => theme.button.backgroundColor.primary};
    border: none;
    width: 100px !important;
  }
`;
export default function Form({ onSubmit, handleInputChange, userDetails }) {
  const theme = useContext(ThemeContext);
  return (
    <CreateUserFormStyled theme={theme}>
      <input
        type="text"
        id="username"
        name="username"
        data-testid="app-create-input-username"
        placeholder="Username"
        value={userDetails.username}
        onChange={({ target }) => {
          handleInputChange("username", target.value);
        }}
      />
      <input
        type="email"
        id="email"
        name="email"
        data-testid="app-create-input-email"
        placeholder="Email"
        value={userDetails.email}
        onChange={({ target }) => {
          handleInputChange("email", target.value);
        }}
      />
      <input
        type="password"
        id="password"
        name="password"
        data-testid="app-create-input-password"
        placeholder="Password"
        value={userDetails.password}
        onChange={({ target }) => {
          handleInputChange("password", target.value);
        }}
      />
      <input
        type="password"
        id="password"
        name="password"
        data-testid="app-create-input-confirm-password"
        placeholder="Confirm Password"
        value={userDetails.confirm_password}
        onChange={({ target }) => {
          handleInputChange("confirm_password", target.value);
        }}
      />
      <button type="submit" data-testid="app-create-button-signup">
        SIGN UP
      </button>
    </CreateUserFormStyled>
  );
}
