import React, { useContext } from "react";
import { Link } from "@reach/router";
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
    outline: 0;
    margin-top: 2.5em;
    margin-bottom: 2.5em;
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
    border-radius: ${({ theme }) => theme.button.borderRadius};
  }
  button[type="submit"] {
    background-color: ${({ theme }) => theme.button.backgroundColor.primary};
    padding: 10px;
    display: block;
    margin: 10px auto;
    border: none;
    width: 100px !important;
    margin-top: 0.5em;
  }
  select {
    display: block;
    width: 100%;
    font-size: ${({ theme }) => theme.select.fontSize};
    border: none;
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
  p {
    font-weight: bold;
    text-align: center;
    padding: 0;
    margin-top: 1em;
    font-size: ${({ theme }) => theme.p.fontSize} !important;
    text-align: left;
  }
  p a {
    color: ${({ theme }) => theme.anchor.textColor.primary};
    font-size: ${({ theme }) => theme.anchor.fontSize} !important;
    text-decoration: none;
  }
  @media (min-width: 600px) {
    #userTypes {
      grid-template-columns: 50% 50%;
      grid-gap: 0.5%;
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
      onSubmit={handleSubmit(onSubmit)}
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
        ref={register({ required: true, minLength: 5 })}
      />
      <ErrorMessage
        field={errors.username}
        errorType="required"
        message="Username is required."
      />
      <ErrorMessage
        field={errors.password}
        errorType="minLength"
        message="Username minimum length must be at least 5 characters."
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
        ref={register({ required: true, minLength: 5 })}
      />
      <ErrorMessage
        field={errors.password}
        errorType="required"
        message="Password is required."
      />
      <ErrorMessage
        field={errors.password}
        errorType="minLength"
        message="Password minimum length must be at least 5 characters."
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
          minLength: 5,
          validate: value => value === password.value
        })}
      />
      <ErrorMessage
        field={errors.confirm_password}
        errorType="required"
        message="Confirm password is required."
      />
      <ErrorMessage
        field={errors.password}
        errorType="minLength"
        message="Confirm password minimum length must be at least 5 characters."
      />
      <ErrorMessage
        field={errors.confirm_password}
        errorType="validate"
        message="The passwords do not match."
      />
      <button type="submit" data-testid="app-create-button-signup">
        SIGN UP
      </button>
      <p>
        Already Member! <Link to="/">Sign In</Link>
      </p>
    </CreateUserFormStyled>
  );
}
