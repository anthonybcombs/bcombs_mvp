import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import styled, { ThemeContext } from "styled-components";
import ErrorMessage from "../../../helpers/ErrorMessage";
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
    border-color: ${({ theme }) => theme.input.focus.border.color};
    transition: 3s;
  }
  button {
    color: ${({ theme }) => theme.button.textColor.primary};
    font-size: ${({ theme }) => theme.button.fontSize} !important;
    background-color: lightgrey;
    border: none;
    box-shadow: 0px 3px 6px #908e8e;
  }
  button[type="submit"] {
    background-color: ${({ theme }) => theme.button.backgroundColor.primary};
    padding: 10px;
    display: block;
    margin: 10px auto;
    border: none;
    width: 100px !important;
  }
  select {
    display: block;
    width: 100%;
    font-size: ${({ theme }) => theme.select.fontSize};
    border: none;
  }
  select:focus {
  }
  select option {
    font-weight: normal;
  }
  #userTypes {
    display: grid;
    grid-gap: 5%;
  }
  #userTypes button.selected {
    background-color: ${({ theme }) => theme.button.backgroundColor.primary};
    box-shadow: 0px 3px 6px
      ${({ theme }) => theme.button.backgroundColor.primary};
  }
  @media (min-width: 600px) {
    #userTypes {
      grid-template-columns: 50% 50%;
      grid-gap: 0;
    }
  }
`;
export default function Form({
  onSubmit,
  handleInputChange,
  handleChangeUserType,
  userDetails
}) {
  const theme = useContext(ThemeContext);
  const { register, handleSubmit, errors } = useForm();
  const { userType } = userDetails;
  return (
    <CreateUserFormStyled
      data-testid="app-create-form"
      theme={theme}
      onSubmit={handleSubmit(e => {
        onSubmit(e);
      })}
    >
      <div id="userTypes">
        <button
          data-testid="app-create-button-user"
          className={userType === "user" ? "selected" : ""}
          type="button"
          onClick={() => {
            handleChangeUserType("user");
          }}
        >
          User
        </button>
        <button
          data-testid="app-create-button-vendor"
          className={userType === "vendor" ? "selected" : ""}
          type="button"
          onClick={() => {
            handleChangeUserType("vendor");
          }}
        >
          Vendor
        </button>
      </div>
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
        ref={register({ required: true })}
      />
      <ErrorMessage
        field={errors.username}
        errorType="required"
        message="Username is required."
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
        ref={register({ required: true })}
      />
      <ErrorMessage
        field={errors.email}
        errorType="required"
        message="Email is required."
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
        ref={register({ required: true })}
      />
      <ErrorMessage
        field={errors.password}
        errorType="required"
        message="Password is required."
      />
      <input
        type="password"
        id="confirm_password"
        name="confirm_password"
        data-testid="app-create-input-confirm-password"
        placeholder="Confirm Password"
        value={userDetails.confirm_password}
        onChange={({ target }) => {
          handleInputChange("confirm_password", target.value);
        }}
        ref={register({
          required: true,
          validate: value => value === password.value
        })}
      />
      <ErrorMessage
        field={errors.confirm_password}
        errorType="required"
        message="Confirm password is required."
      />
      <ErrorMessage
        field={errors.confirm_password}
        errorType="validate"
        message="The passwords do not match."
      />
      <button type="submit" data-testid="app-create-button-signup">
        SIGN UP
      </button>
    </CreateUserFormStyled>
  );
}
