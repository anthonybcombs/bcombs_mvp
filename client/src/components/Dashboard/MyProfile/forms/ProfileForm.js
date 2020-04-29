import React, { useState, useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import { useForm } from "react-hook-form";
import ErrorMessage from "../../../../helpers/ErrorMessage";
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
    border: none;
    margin-top: 0.5em;
  }
  select {
    font-size: ${({ theme }) => theme.input.fontSize};
    display: block;
    width: 100% !important;
    border: none;
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
  @media (min-width: 600px) {
    .grid {
      grid-template-columns: 50% 50%;
      grid-gap: 1%;
    }
    button[type="submit"] {
      width: ${({ theme }) => theme.button.width.primary};
    }
  }

  .span-value {
    margin-left: 12px;
  }
`;
export default function ProfileForm({ data, onSubmit, handleInputChange }) {
  const [dateOfBirthElementType, setDateOfBirthElementType] = useState("text");
  const theme = useContext(ThemeContext);
  const { handleSubmit, errors } = useForm();
  const formattedDateOfBirth = new Date(data.dateofbirth);

  //data.dateofbirth

  return (
    <CreateProfileStyled
      data-testid="app-create-profile-form"
      method="POST"
      theme={theme}
      onSubmit={handleSubmit(onSubmit)}>
      {/* <input
        data-testid="app-profile-input-firstname"
        name="firstname"
        placeholder="First name"
        onChange={({ target }) => {
          handleInputChange("firstname", target.value);
        }}
        ref={register}
      />
   
      <input
        data-testid="app-profile-input-lastname"
        name="lastname"
        placeholder="Last name"
        onChange={({ target }) => {
          handleInputChange("lastname", target.value);
        }}
        ref={register}
      />
   
      <span>Family Relationship</span>
      <select
        data-testid="app-profile-select-family-relationship"
        name="familyrelationship"
        onChange={({ target }) => {
          handleInputChange("familyrelationship", target.value);
        }}
        ref={register}>
        <option value="" disabled hidden>
          Family relationship
        </option>
        <option value="father">Father</option>
        <option value="mother">Mother</option>
        <option value="sibling">Sibling</option>
      </select>
    
      <span>Gender</span>
      <select
        data-testid="app-profile-select-gender"
        name="gender"
        onChange={({ target }) => {
          handleInputChange("gender", target.value);
        }}
        ref={register}>
        <option value="" disabled hidden>
          Gender
        </option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
      

      <input
        data-testid="app-profile-input-zip-code"
        name="zipcode"
        type="number"
        placeholder="Zip code"
        onChange={({ target }) => {
          handleInputChange("zipcode", target.value);
        }}
        ref={register}
      />
 
      <input
        //data-testid="app-profile-input-date-of-birth"
        name="dateofbirth"
        type="date"
        type={dateOfBirthElementType}
        placeholder="Date of Birth"
        onFocus={() => {
          handleDateOfBirthElementTypeChange("date");
        }}
        onBlur={() => {
          handleDateOfBirthElementTypeChange("text");
        }}
        onChange={({ target }) => {
          handleInputChange("dateofbirth", target.value);
        }}
        ref={register}
      />
       */}
    </CreateProfileStyled>
  );
}
