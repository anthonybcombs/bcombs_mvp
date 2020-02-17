import React, { useState, useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import { useForm } from "react-hook-form";
import ErrorMessage from "../../../../../helpers/ErrorMessage";
const CreateProfileStyled = styled.form`
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
    margin-top: 2.5em;
    margin-bottom: 1.5em;
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
    border: none;
    width: 200px !important;
    margin-top: 0.5em;
  }
  select {
    font-size: ${({ theme }) => theme.input.fontSize};
    display: block;
    width: 100% !important;
    border: none;
    border-radius: 1;
    margin-top: 2.5em;
    margin-bottom: 1.5em;
  }
  option:not([value=""]) {
    color: black !important;
  }
  h3 {
    text-align: center;
  }

  [hidden] {
    display: none;
  }
  input[type="date"]:after {
    content: attr(placeholder);
  }
  @media (min-width: 600px) {
    .grid {
      grid-template-columns: 50% 50%;
      grid-gap: 1%;
    }
  }
`;
export default function CreateProfileForm({
  details,
  onSubmit,
  handleInputChange
}) {
  const [dateOfBirthElementType, setDateOfBirthElementType] = useState("text");
  const theme = useContext(ThemeContext);
  const { register, handleSubmit, errors } = useForm();
  const handleDateOfBirthElementTypeChange = value => {
    setDateOfBirthElementType(value);
  };
  return (
    <CreateProfileStyled
      data-testid="app-create-profile-form"
      method="POST"
      theme={theme}
      onSubmit={handleSubmit(onSubmit)}
    >
      <h3>Create my profile</h3>
      <input
        data-testid="app-profile-create-input-firstname"
        name="firstname"
        placeholder="First name"
        value={details.firstname}
        onChange={({ target }) => {
          handleInputChange("firstname", target.value);
        }}
        ref={register({ required: true })}
      />
      <ErrorMessage
        field={errors.firstname}
        errorType="required"
        message="Firstname is required."
      />
      <input
        data-testid="app-profile-create-input-lastname"
        name="lastname"
        placeholder="Last name"
        value={details.lastname}
        onChange={({ target }) => {
          handleInputChange("lastname", target.value);
        }}
        ref={register({ required: true })}
      />
      <ErrorMessage
        field={errors.lastname}
        errorType="required"
        message="Lastname is required."
      />
      <div className="grid">
        <div>
          <select
            data-testid="app-profile-create-select-gender"
            name="gender"
            value={details.gender}
            onChange={({ target }) => {
              handleInputChange("gender", target.value);
            }}
            ref={register({ required: true })}
          >
            <option value="" disabled hidden>
              Gender
            </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          <ErrorMessage
            field={errors.gender}
            errorType="required"
            message="Gender is required."
          />
        </div>
        <div>
          <select
            data-testid="app-profile-create-select-family-relationship"
            name="familyrelationship"
            value={details.familyrelationship}
            onChange={({ target }) => {
              handleInputChange("familyrelationship", target.value);
            }}
            ref={register({ required: true })}
          >
            <option value="" disabled hidden>
              Family relationship
            </option>
            <option value="father">Father</option>
            <option value="mother">Mother</option>
            <option value="sibling">Sibling</option>
          </select>
          <ErrorMessage
            field={errors.familyrelationship}
            errorType="required"
            message="Family relationship is required."
          />
        </div>
      </div>
      <div className="grid">
        <div>
          <input
            data-testid="app-profile-create-input-zip-code"
            name="zipcode"
            type="number"
            placeholder="Zip code"
            value={details.zipcode}
            onChange={({ target }) => {
              handleInputChange("zipcode", target.value);
            }}
            ref={register({ required: true })}
          />
          <ErrorMessage
            field={errors.zipcode}
            errorType="required"
            message="Zip code is required."
          />
        </div>
        <div>
          <input
            data-testid="app-profile-create-input-date-of-birth"
            name="dateofbirth"
            type={dateOfBirthElementType}
            placeholder="Date of Birth"
            onFocus={() => {
              handleDateOfBirthElementTypeChange("date");
            }}
            onBlur={() => {
              handleDateOfBirthElementTypeChange("text");
            }}
            value={details.dateofbirth}
            onChange={({ target }) => {
              handleInputChange("dateofbirth", target.value);
            }}
            ref={register({ required: true })}
          />
          <ErrorMessage
            field={errors.dateofbirth}
            errorType="required"
            message="Date of Birth is required."
          />
        </div>
      </div>

      <button data-testid="app-profile-create-submit-button" type="submit">
        Save and Continue
      </button>
    </CreateProfileStyled>
  );
}