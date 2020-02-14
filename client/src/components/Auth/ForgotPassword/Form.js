import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import styled, { ThemeContext } from "styled-components";
import ErrorMessage from "../../../helpers/ErrorMessage";
export default function Form({ userDetails, onSubmit, handleInputChange }) {
  const { register, handleSubmit, errors } = useForm();
  return (
    <form
      data-testid="app-forgot-password-form"
      method="POST"
      onSubmit={handleSubmit(onSubmit)}
    >
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
      <ErrorMessage
        field={errors.email}
        errorType="required"
        message="Email is required."
      />
      <button data-testid="app-forgot-password-send-button" type="button">
        Send
      </button>
    </form>
  );
}
