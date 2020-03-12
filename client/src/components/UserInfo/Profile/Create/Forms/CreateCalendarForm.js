import React, { useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import { useForm } from "react-hook-form";
import ErrorMessage from "../../../../../helpers/ErrorMessage";
const CreateCalendarFormStyled = styled.form`
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
    font-size: ${({ theme }) => theme.input.fontSize} !important;
    display: block;
    border: none;
    border-radius: 1;
    border: none;
    outline: 0;
    border-bottom: 2px solid lightgrey;
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
    border-radius: ${({ theme }) => theme.button.borderRadius} !important;
  }
  button[type="submit"] {
    background-color: ${({ theme }) => theme.button.backgroundColor.primary};
    padding: 10px;
    display: block;
    margin: 10px auto;
    width: 100%;
    border: none;
    margin-top: 20em;
  }
  @media (min-width: 600px) {
    button[type="submit"] {
      width: ${({ theme }) => theme.button.width.primary};
    }
    input {
      width: 50%;
      margin: 0 auto;
    }
  }
`;
export default function CreateCalendarForm({
  details,
  onSubmit,
  handleInputChange
}) {
  const { register, handleSubmit, errors } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange"
  });
  const theme = useContext(ThemeContext);
  return (
    <CreateCalendarFormStyled
      data-testid="app-profile-calendar-create-form"
      theme={theme}
      method="POST"
      onSubmit={handleSubmit(onSubmit)}
    >
      <input
        data-testid="app-profile-input-calendar-name"
        placeholder="Calendar name"
        name="name"
        value={details.name}
        onChange={({ target }) => {
          handleInputChange("name", target.value);
        }}
        ref={register({ required: true })}
      />
      <ErrorMessage
        field={errors.name}
        errorType="required"
        message="Calendar name is required."
      />
      <button data-testid="app-profile-save-button" type="submit">
        Save and Done!
      </button>
    </CreateCalendarFormStyled>
  );
}
