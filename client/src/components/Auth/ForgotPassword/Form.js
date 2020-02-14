import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import styled, { ThemeContext } from "styled-components";
import ErrorMessage from "../../../helpers/ErrorMessage";
const ForgotPasswordFormStyled = styled.form`
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
  }
`;
export default function Form({ userDetails, onSubmit, handleInputChange }) {
  const { register, handleSubmit, errors } = useForm();
  return (
    <ForgotPasswordFormStyled
      data-testid="app-forgot-password-form"
      method="POST"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div>
        <input
          data-testid="app-forgot-password-input-email"
          type="email"
          name="email"
          value={userDetails.email}
          placeholder="Email"
          onChange={({ target }) => {
            handleInputChange("email", target.value);
          }}
          ref={register({ required: true })}
        />
      </div>

      <ErrorMessage
        field={errors.email}
        errorType="required"
        message="Email is required."
      />
      <button data-testid="app-forgot-password-send-button" type="submit">
        Reset Password
      </button>
    </ForgotPasswordFormStyled>
  );
}
